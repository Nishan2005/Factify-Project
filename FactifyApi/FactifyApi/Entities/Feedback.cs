namespace FactifyApi.Entities
{
    public class Feedback
    {
        public int Id { get; set; }
        public int PredictionId { get; set; }          // FK → your Prediction/Result table
        public string Vote { get; set; }               // "yes" | "no"
        public List<string> Tags { get; set; } = [];   // EF Core JSON column
        public string? Comment { get; set; }           // nullable — optional field
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation property (optional but recommended)
        public Prediction Prediction { get; set; }
    }
}
