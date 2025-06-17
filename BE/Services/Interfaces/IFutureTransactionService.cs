using SummerPracticeWebApi.Controllers;
using SummerPracticeWebApi.Models;

namespace SummerPracticeWebApi.Services.Interfaces
{
    public interface IFutureTransactionService
    {
        Task<object> GetUserTransactionsByMonthAsync(int userId, int year, int month);
        Task<FutureTransaction> CreateFutureTransactionAsync(CreateFutureTransactionDto dto);
        Task<bool> DeleteFutureTransactionAsync(int id);
        Task<bool> CategoryExistsAsync(int categoryId);
        Task<bool> UserExistsAsync(int userId);
    }
}