using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.DTOs;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;

namespace SummerPracticeWebApi.Services.Implementations
{
   
    public class ReportGeneratorService : IReportGeneratorService
    {
        public string GenerateMonthlyReport(TransactionDTO transactionData, DateTime date)
        {
            var reportText = new StringBuilder();
            reportText.AppendLine($"📊 Отчет за {date.ToString("MMMM yyyy", new CultureInfo("bg-BG"))}");

            reportText.AppendLine($"\n🟩 Приходи: {transactionData.totalIncome:F2}лв");
            foreach (var income in transactionData.Income)
            {
                reportText.AppendLine($"• {income.CategoryName}: {income.TotalAmount:F2}лв - {income.PercentageAmount:F2}%");
            }

            reportText.AppendLine($"\n🟥 Разходи: {transactionData.totalExpenses:F2}лв");
            foreach (var expense in transactionData.Expenses)
            {
                reportText.AppendLine($"• {expense.CategoryName}: {expense.TotalAmount:F2}лв - {expense.PercentageAmount:F2}%");
            }

            return reportText.ToString();
        }
    }
}
