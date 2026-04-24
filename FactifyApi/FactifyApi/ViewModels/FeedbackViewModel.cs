using System.ComponentModel.DataAnnotations;

namespace FactifyApi.ViewModels
{
    public class FeedbackViewModel
    {
        [Required]
        public int Id { get; set; }                    

        [Required]
        [RegularExpression("yes|no", ErrorMessage = "Vote must be 'yes' or 'no'")]
        public string Vote { get; set; }

        public List<string> Tags { get; set; } = [];

        [MaxLength(300)]
        public string? Comment { get; set; }
    }
}
