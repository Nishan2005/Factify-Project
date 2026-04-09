using FactifyApi.ViewModels;

namespace FactifyApi.Services
{
    public interface INewsCheckService
    {
        public Task<FakeNewsResultViewModel> CheckNewsAsync(string text);
    }
}
