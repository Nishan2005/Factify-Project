using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FactifyApi.Entities
{
    public class TopEvidence
    {
        [Key]
        public int Id { get; set; }

        public int Rank { get; set; }

        [MaxLength(200)]
        public string Source { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        public string? Url { get; set; }

        public string? Snippet { get; set; }

        // Foreign key
        public int PredictionId { get; set; }

        [ForeignKey(nameof(PredictionId))]
        public Prediction Prediction { get; set; } = null!;
    }
}