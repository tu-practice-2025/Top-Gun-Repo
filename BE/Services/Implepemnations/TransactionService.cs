using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.DTOs;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

            var startDate = new DateTime(date.Year, date.Month, 1);

            var endDate = startDate.AddMonths(1).AddDays(-1);

            // Dictionary<int, string> categoryNames = new Dictionary<int, string>();

            var categoryNames = await _context.Categories
                .ToDictionaryAsync(c => c.CategoryId, c => c.name);

            var expenseSum = await _context.Transactions
                .Where(t => t.user_id == userID && t.type == 'E' && t.date >= startDate && t.date <= endDate)
                .GroupBy(t => t.category_id)

                //за всяка транзакция x в групата g извличаш x.amount и ги събираш.
                .Select(g => new { CatId = g.Key, Sum = g.Sum(x => x.amount) }).ToListAsync();


            double totalExpenses = expenseSum.Sum(x => x.Sum);

            var expenses = expenseSum.Select(x => new TransactionListDTO
            {
                CategoryName = categoryNames.GetValueOrDefault(x.CatId, "Unknown"),
                PercentageAmount = totalExpenses == 0
                    ? 0
                    : Math.Round(x.Sum / totalExpenses * 100, 2),
                TotalAmount = Math.Round(x.Sum, 2)
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
                TotalAmount = Math.Round(x.Sum, 2)
            }).ToList();


            return new TransactionDTO
            {
                Expenses = expenses,
                Income = incomes,
                totalExpenses = totalExpenses,
                totalIncome = totalIncome
            };

        }

        public async Task<List<TransactionDetailDTO>> GetByCategoryAsync(
      int userId, int categoryId, DateTime month)
        {
            var start = new DateTime(month.Year, month.Month, 1);
            var end = start.AddMonths(1);


            var query = _context.Transactions
                .Where(t => t.user_id == userId
                         && t.category_id == categoryId
                         && t.date >= start
                         && t.date < end);


            var joined = query
                .Join(_context.Merchants,
                      t => t.merchant_id,
                      m => m.MerchantId,
                      (t, m) => new { t, m });
            //.Join(_context.Cards,
            //      tm => tm.t.card_number,
            //      c => c.card_number,
            //      (tm, c) => new { tm.t, tm.m, c });




            var projected = joined
                .OrderByDescending(x => x.t.date)
                .Select(x => new TransactionDetailDTO
                {
                    Date = x.t.date,
                    MerchantName = x.m.mcc_name,
                    Iban = x.t.iban,
                    Amount = x.t.type == 'E'
                                     ? -x.t.amount
                                     : x.t.amount,
                    CardNumber = x.t.type == 'E'
                                ? x.t.card_number
                                : null

                });

            return await projected.ToListAsync();
        }

        //api/transactions/5/by-month/5
        public async Task<object> GetTransactionsByMonth(int userId, DateTime date)
        {

            var startDate = new DateTime(date.Year, date.Month, 1);

            var endDate = startDate.AddMonths(1).AddDays(-1);

            var transactions = await _context.TransactionDetailsViews
                .Where(t => t.UserId == userId && t.TransactionMonth == date.Month)
                .Select(t => new
                {
                    TransactionId = t.TransactionId,
                    TransactionCode = t.TransactionCode,
                    CategoryName = t.CategoryName,
                    MerchantName = t.MerchantName,
                    MerchantDescription = t.MerchantDescription,
                    CardNumber = t.CardNumber,
                    Amount = t.Amount,
                    Date = t.Date,
                    Type = t.Type,
                    iban = t.iban,
                })
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            if (!transactions.Any())
            {
                return new { message = "No transactions found for the specified month", data = transactions };
            }



            return transactions;
        }





        // public async Task<(double TotalExpense, double TotalIncome)>
        //GetMonthlyTotalsAsync(int userId, int year, int month)
        // {
        //     var start = new DateTime(year, month, 1);
        //     var end = start.AddMonths(1);

        //     var expense = await _ctx.Transactions
        //         .Where(t => t.user_id == userId
        //                  && t.type == 'E'
        //                  && t.date >= start
        //                  && t.date < end)
        //         .SumAsync(t => t.amount);

        //     var income = await _ctx.Transactions
        //         .Where(t => t.user_id == userId
        //                  && t.type == 'I'
        //                  && t.date >= start
        //                  && t.date < end)
        //         .SumAsync(t => t.amount);

        //     return (expense, income);
        // }


    }


    //    public async Task<List<TransactionDetailDTO>> 
    //    GetTransactionDetailsAsync(int userId, int categoryId, DateTime month)
    //{
    //    var start = new DateTime(month.Year, month.Month, 1);
    //    var end   = start.AddMonths(1);

    //    // Зареждаме мърчант-имена в речник (по merchant_id)
    //    var merchants = await _context.Merchants
    //        .ToDictionaryAsync(m => m.MerchantId, m => m.mcc_name);

    //    // Query-раме транзакциите
    //    var txs = await _context.Transactions
    //        .Where(t => t.user_id == userId
    //                 && t.category_id == categoryId
    //                 && t.date >= start
    //                 && t.date < end)
    //        .OrderByDescending(t => t.date)
    //        .Select(t => new TransactionDetailDTO {
    //            Date     = t.date,
    //            Merchant = merchants.GetValueOrDefault(t.merchant_id, null),
    //            Category = _context.Categories
    //                              .Where(c => c.CategoryId == t.category_id)
    //                              .Select(c => c.name)
    //                              .FirstOrDefault(), 
    //            Amount   = t.amount,
    //            Type     = t.type == 'E' ? "expense" : "income"
    //        })
    //        .ToListAsync();

    //    return txs;
    //}



}
