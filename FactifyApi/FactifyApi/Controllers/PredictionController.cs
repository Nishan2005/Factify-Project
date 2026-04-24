using FactifyApi.Services;
using FactifyApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace FactifyApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class PredictionController : ControllerBase
    {
        private readonly INewsCheckService _newsCheckService;
        public PredictionController(INewsCheckService newsCheckService)
        {
            _newsCheckService = newsCheckService;
        }
        [HttpGet]
        public async Task<IActionResult> CheckNews(string text)
        {
            try
            {
                var result = await _newsCheckService.CheckNewsAsync(text);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
