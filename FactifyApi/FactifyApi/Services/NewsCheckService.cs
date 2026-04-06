using FactifyApi.ViewModels;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace FactifyApi.Services
{
    public class NewsCheckService : INewsCheckService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public NewsCheckService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<FakeNewsResultViewModel> CheckNewsAsync(string text)
        {
            var url = _configuration["ExternalApis:RagApiUrl"];

            var requestData = new
            {
                text = text
            };

            var json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("External API failed");
            }

            var result = await response.Content.ReadFromJsonAsync<FakeNewsResultViewModel>(
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            return result;
        }
    }
}
