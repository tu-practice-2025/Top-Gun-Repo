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

        int cat_id;


        private List<string> categories = new List<string>
        {
            "Транспорт и авто услуги",
            "Супермаркети",
            "Пътуване и ваканция",
            "Шопинг",
            "Ресторанти и барове",
            "Финансови услуги",
            "Инвестиции",
            "Забавление и спорт",
            "Здраве и красота",
            "Дрехи",
            "Кеш",
            "За дома",
            "Публични услуги",
            "Бизнес услуги",
            "Битови сметки",
            "Образование",
            "Задължения и такси",
            "Преводи",
            "Други",
            "Погасяване по кредитни продукти",
            "Приход",
            "Приход ATM"
        };


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
        public async Task<IActionResult> Post(int userId, [FromQuery] string cat_name, [FromQuery] double limit)
        {
            foreach (var category in categories)
            {
                if (category == cat_name)
                {
                    cat_id = categories.IndexOf(category) + 1; 
                    break;
                }
            }
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
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string cat_name, [FromQuery]double new_limit)
        {
            foreach (var category in categories)
            {
                if (category == cat_name)
                {
                    cat_id = categories.IndexOf(category) + 1;
                    break;
                }
            }
            try
            {
                var budget = await _budgetsService.UpdateBudgetAsync(cat_id, new_limit);
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
