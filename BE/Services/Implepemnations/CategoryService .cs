using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;

namespace SummerPracticeWebApi.Services.Implepemnations
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        private async Task<bool> CategoryExistsAsync(int id)
        {
            return await _context.Categories.AnyAsync(e => e.CategoryId == id);
        }
        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories
                .Where(x => x.CategoryId == id)
                .OrderBy(x => x.CategoryId)
                .FirstOrDefaultAsync();
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<bool> UpdateCategoryAsync(int id, Category category)
        {
            if (id != category.CategoryId)
            {
                return false;
            }

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await CategoryExistsAsync(id))
                {
                    return false;
                }
                throw;
            }
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return false;
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<CategorieSpendingView>> GetCategorySpendingAsync()
        {
            return await _context.CategorySpending
                .OrderByDescending(x => x.TotalSpent)
                .ToListAsync();
        }

        public async Task<IEnumerable<CategorieSpendingView>> GetCategorySpendingByUserAsync(int userId)
        {
            return await _context.Categories
                .Select(c => new CategorieSpendingView
                {
                    Code = c.code,
                    Name = c.name,
                    TotalSpent = _context.Transactions
                        .Where(t => t.category_id == c.CategoryId && t.user_id == userId && !c.name.Contains("Income"))
                        .Sum(t => (decimal?)t.amount) ?? 0,
                    UserId = userId
                })
                .OrderByDescending(cs => cs.TotalSpent)
                .ToListAsync();
        }

        public async Task<IEnumerable<CategorieSpendingView>> GetCategoryIncomeByUserAsync(int userId)
        {
            return await _context.Categories
                .Select(c => new CategorieSpendingView
                {
                    Code = c.code,
                    Name = c.name,
                    TotalSpent = _context.Transactions
                        .Where(t => t.category_id == c.CategoryId && t.user_id == userId && c.name.Contains("Income"))
                        .Sum(t => (decimal?)t.amount) ?? 0,
                    UserId = userId
                })
                .OrderByDescending(cs => cs.TotalSpent)
                .ToListAsync();
        }


        public async Task<CategorieSpendingView?> GetSpecificCategorySpendingByUser(string categoryName, int userId)
        {

            return await _context.Categories
                .Where(c => c.name.Equals(categoryName)) 
                .Select(c => new CategorieSpendingView
                {
                    Code = c.code,
                    Name = c.name,
                    TotalSpent = _context.Transactions
                        .Where(t => t.category_id == c.CategoryId && t.user_id == userId)
                        .Sum(t => (decimal?)t.amount) ?? 0,
                    UserId = userId
                })
                .FirstOrDefaultAsync();
        }
        //monthly spending by specific year and month
        public async Task<IEnumerable<CategorieSpendingView>> GetCategorySpendingByUserForMonthAsync(int userId, int year, int month)
        {
            return await _context.Categories
                .Select(c => new CategorieSpendingView
                {
                    Code = c.code,
                    Name = c.name,
                    TotalSpent = _context.Transactions
                        .Where(t => t.category_id == c.CategoryId &&
                                   t.user_id == userId &&
                                   !c.name.Contains("Income") &&
                                   t.date.Year == year &&
                                   t.date.Month == month)
                        .Sum(t => (decimal?)t.amount) ?? 0,
                    UserId = userId
                })
                .OrderByDescending(cs => cs.TotalSpent)
                .ToListAsync();
        }

        // monthly income by specific year and month
        public async Task<IEnumerable<CategorieSpendingView>> GetCategoryIncomeByUserForMonthAsync(int userId, int year, int month)
        {
            return await _context.Categories
                .Select(c => new CategorieSpendingView
                {
                    Code = c.code,
                    Name = c.name,
                    TotalSpent = _context.Transactions
                        .Where(t => t.category_id == c.CategoryId &&
                                   t.user_id == userId &&
                                   c.name.Contains("Income") &&
                                   t.date.Year == year &&
                                   t.date.Month == month)
                        .Sum(t => (decimal?)t.amount) ?? 0,
                    UserId = userId
                })
                .OrderByDescending(cs => cs.TotalSpent)
                .ToListAsync();
        }

        //current month spending
        public async Task<IEnumerable<CategorieSpendingView>> GetCurrentMonthCategorySpendingByUserAsync(int userId)
        {
            var currentDate = DateTime.Now;
            return await GetCategorySpendingByUserForMonthAsync(userId, currentDate.Year, currentDate.Month);
        }

        //current month income
        public async Task<IEnumerable<CategorieSpendingView>> GetCurrentMonthCategoryIncomeByUserAsync(int userId)
        {
            var currentDate = DateTime.Now;
            return await GetCategoryIncomeByUserForMonthAsync(userId, currentDate.Year, currentDate.Month);
        }

    }
}
