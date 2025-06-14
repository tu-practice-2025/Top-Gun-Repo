using Microsoft.AspNetCore.Mvc;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
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
    }
}