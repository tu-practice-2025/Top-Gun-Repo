using SummerPracticeWebApi.Models;

namespace SummerPracticeWebApi.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category?> GetCategoryByIdAsync(int id);
        Task<Category> CreateCategoryAsync(Category category);
        Task<bool> UpdateCategoryAsync(int id, Category category);
        Task<bool> DeleteCategoryAsync(int id);
        Task<IEnumerable<CategorieSpendingView>> GetCategorySpendingAsync();
        Task<IEnumerable<CategorieSpendingView>> GetCategorySpendingByUserAsync(int userId);
        Task<IEnumerable<CategorieSpendingView>> GetCategoryIncomeByUserAsync(int userId);
        Task<CategorieSpendingView?> GetSpecificCategorySpendingByUser(string categoryName, int userId);

        //monthly tracking
        Task<IEnumerable<CategorieSpendingView>> GetCategorySpendingByUserForMonthAsync(int userId, int year, int month);
        Task<IEnumerable<CategorieSpendingView>> GetCategoryIncomeByUserForMonthAsync(int userId, int year, int month);
        Task<IEnumerable<CategorieSpendingView>> GetCurrentMonthCategorySpendingByUserAsync(int userId);
        Task<IEnumerable<CategorieSpendingView>> GetCurrentMonthCategoryIncomeByUserAsync(int userId);
    }
}
