using SendGrid;
using SendGrid.Helpers.Mail;
using SummerPracticeWebApi.DTOs;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;

namespace YourNamespace.Services.Implementations
{
    public class EmailService
    {
        private readonly ISendGridClient _client;
        private readonly ITransactionService _transactionService;

        public EmailService(ISendGridClient client, ITransactionService transactionService
            )

        {
            
            _client = client;
            _transactionService = transactionService;
        }

        public async Task SendSimpleEmail(string toEmail, int userId)
        {
            var date = DateTime.Today;
            var dto = await _transactionService.GetMonthlyTransactionAsync(userId, date);
            var expenses = dto.Expenses;
            var incomes = dto.Income;
            Console.WriteLine(expenses.Count);



            var reportText = new StringBuilder();
            reportText.AppendLine($"📊 Отчет за {date.ToString("MMMM yyyy", new CultureInfo("bg-BG"))}");

            reportText.AppendLine($"\n🟥 Разходи: {dto.totalExpenses}лв");
            foreach (TransactionListDTO e in expenses)
            {
                Console.WriteLine(e);
                reportText.AppendLine($"- {e.CategoryName}: {e.TotalAmount:F2}лв - {e.PercentageAmount:F2}%");
            }

            reportText.AppendLine($"\n🟩 Приходи: {dto.totalIncome}лв");
            foreach (var i in incomes)
            {
                reportText.AppendLine($"- {i.CategoryName}: {i.TotalAmount:F2}лв - {i.PercentageAmount:F2}%");
            }
            var subject = $"Вашият отчет – {date.ToString("MMMM yyyy", new CultureInfo("bg-BG"))}";

            var from = new EmailAddress("ivanaborisova24@gmail.com", "Budget Tracker");
            var to = new EmailAddress(toEmail);

            var htmlContent = $"<pre>{reportText}</pre>";

            var msg = MailHelper.CreateSingleEmail(from, to, subject, reportText.ToString(), htmlContent);
            Console.WriteLine(reportText);
            var response = await _client.SendEmailAsync(msg);
        }

    }
}