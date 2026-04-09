using FactifyApi.Data;
using FactifyApi.Entities;
using FactifyApi.ViewModels;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace FactifyApi.Services
{
    public class NewsCheckService : INewsCheckService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AuthDbContext _dbContext;


        public NewsCheckService(HttpClient httpClient, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, AuthDbContext authDbContext)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _dbContext = authDbContext;
        }

        public async Task<FakeNewsResultViewModel> CheckNewsAsync(string text)
        {
            var user = _httpContextAccessor.HttpContext.User;
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var url = _configuration["ExternalApis:RagApiUrl"];

            var requestData = new
            {
                text = text
            };

            var json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("External API failed");
            }
           

            var result = await response.Content.ReadFromJsonAsync<FakeNewsResultViewModel>(
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            List<Entities.TopEvidence> evediences = new List<Entities.TopEvidence>();
            if (result.Top_Evidence.Count > 0)
            {
                foreach (var item in result.Top_Evidence)
                {
                    var evidence = new Entities.TopEvidence
                    {
                        Rank = item.Rank,
                        Source = item.Source,
                        Title = item.Title,
                        Url = item.Link,
                        Snippet = item.Similarity.ToString()
                    };
                    evediences.Add(evidence);

                }
            }
            
            var insert = new Prediction
            {
                Text = text,
                EvidenceFound = result.Evidence_Found,
                EvidenceScore = result.Evidence_Score,
                FinalScore = result.Final_Score,
                Language = result.Language,
                PatternLabel = result.Pattern_Label,
                PatternScore = result.Pattern_Score,
                Verdict = result.Verdict,
                RealProbability = result.Pattern_Probs.REAL,
                FakeProbability = result.Pattern_Probs.FAKE,
                UserId = Guid.Parse(userId),
                TopEvidences = evediences
            };
            _dbContext.Predictions.Add(insert);
            await _dbContext.SaveChangesAsync();
            var createdId = insert.Id;

            // assign to result
            result.Id = createdId;
            return result;
        }
    }
}
