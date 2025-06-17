using SendGrid;
using SendGrid.Helpers.Mail;
using SummerPracticeWebApi.DTOs;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;

namespace SummerPracticeWebApi.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly ISendGridClient _client;
        private readonly ITransactionService _transactionService;
        private readonly IReportGeneratorService _reportGenerator;

        public EmailService(
            ISendGridClient client,
            ITransactionService transactionService,
            IReportGeneratorService reportGenerator)
        {
            _client = client;
            _transactionService = transactionService;
            _reportGenerator = reportGenerator;
        }

        public async Task SendSimpleEmail(string toEmail, int userId)
        {
            var date = DateTime.Today;
            var transactionData = await _transactionService.GetMonthlyTransactionAsync(userId, date);

            var reportText = _reportGenerator.GenerateMonthlyReport(transactionData, date);
            var subject = $"Вашият отчет – {date.ToString("MMMM yyyy", new CultureInfo("bg-BG"))}";

            var from = new EmailAddress("ivanaborisova24@gmail.com", "Budget Tracker");
            var to = new EmailAddress(toEmail);
            var htmlContent = $"<pre>{reportText}</pre>";

            var msg = MailHelper.CreateSingleEmail(from, to, subject, reportText, htmlContent);
            Console.WriteLine(reportText);
            await _client.SendEmailAsync(msg);
        }
    }


}