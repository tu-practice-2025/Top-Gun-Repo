using SummerPracticeWebApi.DTOs;

namespace SummerPracticeWebApi.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendSimpleEmail(string toEmail, int userId);
    }
}
