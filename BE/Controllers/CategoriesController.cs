using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly AppDbContext _context;

        public CategoriesController(ICategoryService categoryService, AppDbContext context)
        {
            _categoryService = categoryService;
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                if (category == null)
                {
                    return NotFound();
                }
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Categories/
        [HttpPost]
        public async Task<IActionResult> Post(Category category)
        {
            try
            {
                var createdCategory = await _categoryService.CreateCategoryAsync(category);
                return CreatedAtAction(nameof(Get), new { id = createdCategory.CategoryId }, createdCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Category category)
        {
            try
            {
                var success = await _categoryService.UpdateCategoryAsync(id, category);
                if (!success)
                {
                    return BadRequest("Invalid category data or category not found");
                }
                return Ok("Category updated");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var success = await _categoryService.DeleteCategoryAsync(id);
                if (!success)
                {
                    return NotFound();
                }
                return Ok("Category deleted");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Categories/spending
        [HttpGet("spending")]
        public async Task<IActionResult> GetCategorySpending()
        {
            try
            {
                var categorySpending = await _categoryService.GetCategorySpendingAsync();
                return Ok(categorySpending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Categories/spending/5
        [HttpGet("spending/{userId}")]
        public async Task<IActionResult> GetCategorySpendingByUser(int userId)
        {
            try
            {
                var categorySpending = await _categoryService.GetCategorySpendingByUserAsync(userId);
                return Ok(categorySpending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Categories/income/5
        [HttpGet("income/{userId}")]
        public async Task<IActionResult> GetCategoryIncomeByUser(int userId)
        {
            try
            {
                var categoryIncome = await _categoryService.GetCategoryIncomeByUserAsync(userId);
                return Ok(categoryIncome);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Categories/spending/Transport/5
        [HttpGet("spending/{categoryname}/{userId}")]
        public async Task<IActionResult> GetSpecificCategorySpendingByUser(string categoryname, int userId)
        {
            try
            {
                var categoryIncome = await _categoryService.GetSpecificCategorySpendingByUser(categoryname, userId);
                return Ok(categoryIncome);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Categories/spending/current-month/5
        [HttpGet("spending/current-month/{userId}")]
        public async Task<IActionResult> GetCurrentMonthCategorySpendingByUser(int userId)
        {
            try
            {
                var categorySpending = await _categoryService.GetCurrentMonthCategorySpendingByUserAsync(userId);
                return Ok(categorySpending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Categories/spending/month/5?year=2025&month=6
        [HttpGet("spending/month/{userId}")]
        public async Task<IActionResult> GetCategorySpendingByUserForMonth(int userId, [FromQuery] int year, [FromQuery] int month)
        {
            try
            {
                var categorySpending = await _categoryService.GetCategorySpendingByUserForMonthAsync(userId, year, month);
                return Ok(categorySpending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        // GET: api/Categories/income/current-month/5
        [HttpGet("income/current-month/{userId}")]
        public async Task<IActionResult> GetCurrentMonthCategoryIncomeByUser(int userId)
        {
            try
            {
                var categoryIncome = await _categoryService.GetCurrentMonthCategoryIncomeByUserAsync(userId);
                return Ok(categoryIncome);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Categories/income/month/5?year=2025&month=6
        [HttpGet("income/month/{userId}")]
        public async Task<IActionResult> GetCategoryIncomeByUserForMonth(int userId, [FromQuery] int year, [FromQuery] int month)
        {
            try
            {
                var categoryIncome = await _categoryService.GetCategoryIncomeByUserForMonthAsync(userId, year, month);
                return Ok(categoryIncome);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

 // GET: api/Categories/transactions/month/5?year=2025&month=6
        [HttpGet("transactions/month/{userId}")]
        public async Task<IActionResult> GetUserTransactionsByMonth(int userId, [FromQuery] int year, [FromQuery] int month)
        {
            try
            {

                var transactions = await _context.TransactionDetailsViews
                    .Where(t => t.UserId == userId && 
                               t.TransactionYear == year && 
                               t.TransactionMonth == month)
                    .OrderByDescending(t => t.Date)
                    .ToListAsync();

                if (!transactions.Any())
                {
                    return Ok(new { message = "No transactions found for the specified month", data = transactions });
                }

                return Ok(transactions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}