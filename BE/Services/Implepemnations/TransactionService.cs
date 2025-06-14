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
    /// <summary>
    /// Service implementation that retrieves and computes
    /// monthly expense and income percentages by category.
    /// </summary>
    public class TransactionService : ITransactionService
    {
        private readonly AppDbContext _context;

        public TransactionService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Returns both expenses and incomes for the given user and month,
        /// grouped by category and expressed as percentages of the total.
        /// </summary>
        public async Task<TransactionListDTO> GetMonthlyTransactionsAsync(int userId, DateTime date)
        {
            // 1) Determine month boundaries
            var start = new DateTime(date.Year, date.Month, 1);
            var end = start.AddMonths(1);

            // 2) Load category names into a lookup
            var categoryNames = await _context.Categories
                .ToDictionaryAsync(c => c.CategoryId, c => c.name);

            // 3) Sum expenses (type = 'E')
            var expenseSums = await _context.Transactions
                .Where(t => t.user_id == userId
                         && t.date >= start
                         && t.date < end
                         && t.type == 'E')
                .GroupBy(t => t.category_id)
                .Select(g => new { CatId = g.Key, Sum = g.Sum(x => x.amount) })
                .ToListAsync();

            // 4) Sum incomes (type = 'I')
            var incomeSums = await _context.Transactions
                .Where(t => t.user_id == userId
                         && t.date >= start
                         && t.date < end
                         && t.type == 'I')
                .GroupBy(t => t.category_id)
                .Select(g => new { CatId = g.Key, Sum = g.Sum(x => x.amount) })
                .ToListAsync();

            // 5) Compute totals
            double totalExpense = expenseSums.Sum(x => x.Sum);
            double totalIncome = incomeSums.Sum(x => x.Sum);

            // 6) Project to DTOs
            var expenses = expenseSums
                .Select(x => new TransactionListDTO
                {
                    CategoryName = categoryNames.GetValueOrDefault(x.CatId, "Unknown"),
                    PercentageAmount = totalExpense == 0
                        ? 0
                        : Math.Round(x.Sum / totalExpense * 100, 2)
                })
                .ToList();

            var incomes = incomeSums
                .Select(x => new TransactionListDTO
                {
                    CategoryName = categoryNames.GetValueOrDefault(x.CatId, "Unknown"),
                    PercentageAmount = totalIncome == 0
                        ? 0
                        : Math.Round(x.Sum / totalIncome * 100, 2)
                })
                .ToList();

            // 7) Return the combined DTO
            return new TransactionListDTO
            {
                Expenses = expenses,
                Income = incomes
            };
        }

    
    }
}
