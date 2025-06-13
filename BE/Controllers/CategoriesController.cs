using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.Models;

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var categories = await _context.Transactions.ToListAsync();
            return Ok(categories);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var category = await _context.Categories
                .Where(x => x.CategoryId == id)
                .OrderBy(x => x.CategoryId)
                .FirstOrDefaultAsync();

            return Ok(category);
        }

        // PUT: api/Categories/5

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Category category)
        {
            if (id != category.CategoryId)
            {
                return BadRequest();
            }

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Category updated");
        }


        [HttpGet("spending")]
        public async Task<IActionResult> GetCategorySpending()
        {
            try
            {
                var categorySpending = await _context.CategorySpending
                    .OrderByDescending(x => x.TotalSpent)
                    .ToListAsync();

                return Ok(categorySpending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> Post(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = category.CategoryId }, category);
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok("Category deleted");
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.CategoryId == id);
        }

        [HttpGet("spending/{userId}")]
        public async Task<IActionResult> GetCategorySpendingByUser(int userId)
        {
            try
            {
                var categorySpending = await _context.Categories
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

                return Ok(categorySpending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("income/{userId}")]
        public async Task<IActionResult> GetCategoryIncomeByUser(int userId)
        {
            try
            {
                var categorySpending = await _context.Categories
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

                return Ok(categorySpending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
