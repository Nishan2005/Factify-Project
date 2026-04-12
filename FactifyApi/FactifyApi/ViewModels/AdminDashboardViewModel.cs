namespace FactifyApi.ViewModels
{
    public class AdminDashboardViewModel
    {
        public int TotalUsers { get; set; }
        public int TotalPredictions { get; set; }
        public int TotalFeedback { get; set; }
        public List<ChartItemViewModel> VerdictChart { get; set; } = [];
        public List<ChartItemViewModel> LanguageChart { get; set; } = [];
        public List<ChartItemViewModel> FeedbackChart { get; set; } = [];
        public ModelPerformanceViewModel ModelPerformance { get; set; } = new();
    }

    public class ChartItemViewModel
    {
        public string Label { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class ModelPerformanceViewModel
    {
        public double AverageFinalScore { get; set; }
        public double AveragePatternScore { get; set; }
        public double AverageEvidenceScore { get; set; }
    }
}
