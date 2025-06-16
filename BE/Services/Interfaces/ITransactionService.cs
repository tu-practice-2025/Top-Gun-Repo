using SummerPracticeWebApi.DTOs;

namespace SummerPracticeWebApi.Services.Interfaces
{
    public interface ITransactionService
    {
        Task<TransactionDTO> GetMonthlyTransactionAsync(int userID, DateTime date);


        Task<List<TransactionDetailDTO>>
        GetByCategoryAsync(int userId, int categoryId, DateTime month);
    }
}
