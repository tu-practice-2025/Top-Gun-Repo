using SummerPracticeWebApi.DTOs;

namespace SummerPracticeWebApi.Services.Interfaces
{
    public interface IReportGeneratorService
    {
        string GenerateMonthlyReport(TransactionDTO transactionData, DateTime date);
    }
}