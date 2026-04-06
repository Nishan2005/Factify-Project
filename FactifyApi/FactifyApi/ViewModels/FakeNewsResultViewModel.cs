using System.Text.Json.Serialization;

namespace FactifyApi.ViewModels
{
    public class FakeNewsResultViewModel
    {
        [JsonPropertyName("pattern_label")]
        public string Pattern_Label { get; set; }

        [JsonPropertyName("pattern_probs")]
        public PatternProbs Pattern_Probs { get; set; }

        [JsonPropertyName("language")]
        public string Language { get; set; }

        [JsonPropertyName("verdict")]
        public string Verdict { get; set; }

        [JsonPropertyName("final_score")]
        public double Final_Score { get; set; }

        [JsonPropertyName("pattern_score")]
        public double Pattern_Score { get; set; }

        [JsonPropertyName("evidence_score")]
        public double Evidence_Score { get; set; }

        [JsonPropertyName("evidence_found")]
        public bool Evidence_Found { get; set; }

        [JsonPropertyName("top_evidence")]
        public List<TopEvidence> Top_Evidence { get; set; }
    }
    public class PatternProbs
    {
        public double REAL { get; set; }
        public double FAKE { get; set; }
    }

    public class TopEvidence
    {
        public int Rank { get; set; }
        public string Source { get; set; }
        public string Title { get; set; }
        public string Link { get; set; }
        public double Similarity { get; set; }
    }
}
