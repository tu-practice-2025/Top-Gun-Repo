using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.Controllers;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;

namespace SummerPracticeWebApi.Services.Implepemnations
{
    public class FutureTransactionService : IFutureTransactionService
    {
        private readonly AppDbContext _context;

        public FutureTransactionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetUserTransactionsByMonthAsync(int userId, int year, int month)
        {
            var transactions = await _context.FutureTransactionViews
                .Where(t => t.userId.HasValue &&
                           t.userId.Value == userId &&
                           t.TransactionYear == year &&
                           t.TransactionMonth == month)
                .Select(t => new
                {
                    tranId=t.TransactionId,
                    userId = t.userId.Value,
                    categoryName = t.categoryName,
                    amount = t.amount,
                    date = t.date,
                    type = t.type,
                })
                .ToListAsync();

            return transactions;
        }

        public async Task<FutureTransaction> CreateFutureTransactionAsync(CreateFutureTransactionDto dto)
        {
            var futureTransaction = new FutureTransaction
            {
                category_id = dto.CategoryId,
                user_id = dto.UserId,
                amount = dto.Amount,
                type = dto.Type,
                date = dto.Date,
            };

            _context.Future_transactions.Add(futureTransaction);
            await _context.SaveChangesAsync();

            return futureTransaction;
        }

        public async Task<bool> DeleteFutureTransactionAsync(int id)
        {
            var transaction = await _context.Future_transactions.FindAsync(id);
            if (transaction == null)
            {
                return false;
            }

            _context.Future_transactions.Remove(transaction);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CategoryExistsAsync(int categoryId)
        {
            return await _context.Categories.AnyAsync(c => c.CategoryId == categoryId);
        }

        public async Task<bool> UserExistsAsync(int userId)
        {
            return await _context.Users.AnyAsync(u => u.UserId == userId);
        }
    }
}