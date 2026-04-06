using FactifyApi.ViewModels;

namespace FactifyApi.Services
{
    public interface INewsCheckService
    {
        Task<FakeNewsResultViewModel> CheckNewsAsync(string text);
    }
}
