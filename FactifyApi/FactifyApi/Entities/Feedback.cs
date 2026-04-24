namespace FactifyApi.Entities
{
    public class Feedback
    {
        public int Id { get; set; }
        public int PredictionId { get; set; }         
        public string Vote { get; set; }           
        public List<string> Tags { get; set; } = [];   
        public string? Comment { get; set; }           
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Prediction Prediction { get; set; }
    }
}
