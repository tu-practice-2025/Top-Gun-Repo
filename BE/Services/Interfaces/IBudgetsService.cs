using SummerPracticeWebApi.Models;

namespace SummerPracticeWebApi.Services.Interfaces
{
    public interface IBudgetsService
    {
        Task<List<Budget>> GetAllBudgetsForUserAsync(int userId);
        Task<Budget> CreateBudgetAsync(Budget budget);
        Task<bool> UpdateBudgetAsync(int userId, double new_limit);
        Task<int> GetBudgetByIdAsync(int id);
    }
}