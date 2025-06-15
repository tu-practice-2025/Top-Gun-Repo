using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.DTOs;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;

namespace SummerPracticeWebApi.Services.Implementations
{

    public class TransactionService : ITransactionService
    {
        //injektirane AppDbCntex

        private readonly AppDbContext _context;

        public TransactionService(AppDbContext context)
        {
                       _context = context;
        }

        public async Task<TransactionDTO> GetMonthlyTransactionAsync(int userID, DateTime date)
        {
            // Get the first day of the month
            var startDate = new DateTime(date.Year, date.Month, 1);
            // Get the last day of the month
            var endDate = startDate.AddMonths(1).AddDays(-1);
            // Query to get transactions for the user within the specified date range

           // Dictionary<int, string> categoryNames = new Dictionary<int, string>();

            var categoryNames = await _context.Categories 
                .ToDictionaryAsync(c => c.CategoryId, c=> c.name);

            var expenseSum = await _context.Transactions
                .Where(t => t.user_id == userID && t.type == 'E' && t.date >= startDate && t.date <= endDate)
                .GroupBy(t => t.category_id)

                //за всяка транзакция x в групата g извличаш x.amount и ги събираш.
                .Select(g => new {CatId = g.Key, Sum = g.Sum(x=> x.amount)}).ToListAsync();


            double totalExpenses = expenseSum.Sum(x=>x.Sum);

            var expenses = expenseSum.Select(x => new TransactionListDTO
            {
                CategoryName = categoryNames.GetValueOrDefault(x.CatId,"Unknown"),
                PercentageAmount = totalExpenses == 0
                ? 0
                : Math.Round(x.Sum / totalExpenses * 100, 2),
                
            }).ToList();



            var incomeSum = await _context.Transactions

                .Where(t => t.user_id == userID && t.type == 'I' && t.date >= startDate && t.date <= endDate)
                .GroupBy(t => t.category_id)
                .Select(g => new { CatId = g.Key, Sum = g.Sum(x => x.amount) })
                .ToListAsync();

            double totalIncome = incomeSum.Sum(x => x.Sum);

            var incomes = incomeSum.Select(x => new TransactionListDTO
            {
                CategoryName = categoryNames.GetValueOrDefault(x.CatId, "Unknown"),
                PercentageAmount = totalIncome == 0
                    ? 0
                    : Math.Round(x.Sum / totalIncome * 100, 2),
            })
            .ToList();






            return new TransactionDTO
            {
                Expenses = expenses,
                Income = incomes
            };

        }


    }



}
