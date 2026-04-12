using FactifyApi.Data;
using FactifyApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace FactifyApi.Controllers
{
    [ApiController]
    [Route("admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public AdminController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet("access")]
        public IActionResult CheckAccess()
        {
            return Ok(new { canAccess = true });
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalPredictions = await _context.Predictions.CountAsync();
            var totalFeedback = await _context.Feedbacks.CountAsync();

            var verdictChart = await _context.Predictions
                .AsNoTracking()
                .GroupBy(p => p.Verdict)
                .Select(g => new ChartItemViewModel
                {
                    Label = string.IsNullOrWhiteSpace(g.Key) ? "Unknown" : g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .ToListAsync();

            var languageChart = await _context.Predictions
                .AsNoTracking()
                .GroupBy(p => p.Language)
                .Select(g => new ChartItemViewModel
                {
                    Label = string.IsNullOrWhiteSpace(g.Key) ? "Unknown" : g.Key.ToUpper(),
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .ToListAsync();

            var feedbackChart = await _context.Feedbacks
                .AsNoTracking()
                .GroupBy(f => f.Vote)
                .Select(g => new ChartItemViewModel
                {
                    Label = g.Key == "yes" ? "Helpful" : "Not Helpful",
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .ToListAsync();

            var hasPredictions = await _context.Predictions.AnyAsync();
            var avgScores = new ModelPerformanceViewModel();

            if (hasPredictions)
            {
                avgScores.AverageFinalScore = await _context.Predictions.AverageAsync(x => x.FinalScore);
                avgScores.AveragePatternScore = await _context.Predictions.AverageAsync(x => x.PatternScore);
                avgScores.AverageEvidenceScore = await _context.Predictions.AverageAsync(x => x.EvidenceScore);
            }

            var dashboard = new AdminDashboardViewModel
            {
                TotalUsers = totalUsers,
                TotalPredictions = totalPredictions,
                TotalFeedback = totalFeedback,
                VerdictChart = verdictChart,
                LanguageChart = languageChart,
                FeedbackChart = feedbackChart,
                ModelPerformance = avgScores
            };

            return Ok(dashboard);
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportPredictions()
        {
            var predictions = await _context.Predictions
                .AsNoTracking()
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Text,
                    p.Verdict,
                    p.Language,
                    p.PatternLabel,
                    p.FinalScore,
                    p.PatternScore,
                    p.EvidenceScore,
                    p.EvidenceFound,
                    p.RealProbability,
                    p.FakeProbability,
                    p.UserId
                })
                .ToListAsync();

            var csv = new StringBuilder();
            csv.AppendLine("Id,UserId,Text,Verdict,Language,PatternLabel,FinalScore,PatternScore,EvidenceScore,EvidenceFound,RealProbability,FakeProbability");

            foreach (var item in predictions)
            {
                csv.AppendLine(
                    $"{item.Id}," +
                    $"{EscapeCsv(item.UserId.ToString())}," +
                    $"{EscapeCsv(item.Text)}," +
                    $"{EscapeCsv(item.Verdict)}," +
                    $"{EscapeCsv(item.Language)}," +
                    $"{EscapeCsv(item.PatternLabel)}," +
                    $"{item.FinalScore:F4}," +
                    $"{item.PatternScore:F4}," +
                    $"{item.EvidenceScore:F4}," +
                    $"{item.EvidenceFound}," +
                    $"{item.RealProbability:F4}," +
                    $"{item.FakeProbability:F4}");
            }

            var csvBytes = Encoding.UTF8.GetBytes(csv.ToString());
            var bom = Encoding.UTF8.GetPreamble();
            var bytes = bom.Concat(csvBytes).ToArray();
            return File(bytes, "text/csv", "prediction-data-export.csv");
        }

        private static string EscapeCsv(string? value)
        {
            var safeValue = value ?? string.Empty;
            return $"\"{safeValue.Replace("\"", "\"\"")}\"";
        }
    }
}
