using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SummerPracticeWebApi.Models;
using SummerPracticeWebApi.Services.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetsController : ControllerBase
    {
        private readonly IBudgetsService _budgetsService;
        public BudgetsController(IBudgetsService budgetsService)
        {
            _budgetsService = budgetsService;
        }



        // GET api/<BudgetsController>/5
        [HttpGet("{userId}")]
        public async Task<IActionResult> Get(int userId)
        {
            try
            {
                var budgets = await _budgetsService.GetAllBudgetsForUserAsync(userId);
                return Ok(budgets);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST api/<BudgetsController>
        [HttpPost("{userId}")]
        public async Task<IActionResult> Post(int userId, [FromQuery] int cat_id, [FromQuery] double limit)
        {
            try
            {
                var date = DateTime.Now;
                var budget = new Budget
                {
                    user_id = userId,
                    category_id = cat_id,
                    date = date,
                    limit = limit
                };
                cat_id = 0;
                await _budgetsService.CreateBudgetAsync(budget);
                return Ok(budget);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

        // PUT api/<BudgetsController>/5
        [HttpPut("{userId}")]
        public async Task<IActionResult> Put(int userId,[FromQuery] int cat_id, [FromQuery]double limit)
        {
            
            try
            {
                var budget = await _budgetsService.UpdateBudgetAsync(userId, cat_id, limit);
                if (budget == null)
                {
                    return NotFound($"Budget with ID {cat_id} not found.");
                }
                cat_id = 0;
                return Ok(budget);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
