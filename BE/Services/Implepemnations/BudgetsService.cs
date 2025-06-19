using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;

namespace SummerPracticeWebApi.Services.Implepemnations
{
    public class BudgetsService : IBudgetsService
    {
        private readonly AppDbContext _context;

        public BudgetsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Budget>> GetAllBudgetsForUserAsync(int userId)
        {
            return await _context.Budgets.Where(e => e.user_id == userId).ToListAsync();
        }

        public async Task<Budget> CreateBudgetAsync(Budget budget)
        {
            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();
            return budget;
        }

        private async Task<bool> BudgetExistsAsync(int userId)
        {
            return await _context.Budgets.AnyAsync(e => e.user_id == userId);
        }

        public async Task<bool> UpdateBudgetAsync(int userId, int cat_id, double limit)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.user_id == userId && b.category_id == cat_id);
            if (budget == null)
            {
                return false;
            }
            budget.limit = limit;
            _context.Entry(budget).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await BudgetExistsAsync(userId))
                {
                    return false;
                }
                throw;
            }
        }

        public Task<int> GetBudgetByIdAsync(int id)
        {

            return _context.Budgets
                .Where(b => b.BudgetId == id)
                .Select(b => b.BudgetId)
                .FirstOrDefaultAsync();
        }
    }
}
