using FactifyApi.Data;
using FactifyApi.Entities;
using FactifyApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FactifyApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class FeedbackController : ControllerBase
    {
        private readonly AuthDbContext _context;
        public FeedbackController(AuthDbContext context) {
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var feedback = new Feedback
                {
                    PredictionId = model.Id,
                    Vote = model.Vote,
                    Tags = model.Tags,
                    Comment = model.Comment,
                };

                _context.Feedbacks.Add(feedback);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Feedback saved." });
            }catch(Exception ex)
            {
                return BadRequest(ex.ToString());
            }
           
        }
    }
}
