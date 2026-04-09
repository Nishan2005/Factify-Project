using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FactifyApi.Entities
{
    public class Prediction
    {
        [Key]
        public int Id { get; set; }
        public string Text { get; set; }

        public bool EvidenceFound { get; set; }

        public double EvidenceScore { get; set; }

        public double FinalScore { get; set; }

        [MaxLength(20)]
        public string Language { get; set; } = string.Empty;

        [MaxLength(50)]
        public string PatternLabel { get; set; } = string.Empty;

        public double PatternScore { get; set; }

        [MaxLength(50)]
        public string Verdict { get; set; } = string.Empty;

        // For pattern_probs
        public double RealProbability { get; set; }

        public double FakeProbability { get; set; }
        public Guid UserId { get; set; }

        // Navigation property
        public ICollection<TopEvidence> TopEvidences { get; set; } = new List<TopEvidence>();
    }

    
}