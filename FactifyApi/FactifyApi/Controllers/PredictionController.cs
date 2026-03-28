using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace FactifyApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PredictionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public PredictionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> CheckNews(string text)
        {
            var url = _configuration["ExternalApis:RagApiUrl"];

            var requestData = new
            {
                text = text
            };

            var json = JsonSerializer.Serialize(requestData);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                var response = await client.PostAsync(url, content);

                var result = await response.Content.ReadAsStringAsync();

                return Ok(result);
            }
        }
    }
}
