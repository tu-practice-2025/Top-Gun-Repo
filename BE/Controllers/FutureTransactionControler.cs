using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.Services.Interfaces;

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FutureTransactionControler : Controller
    {
        private readonly AppDbContext _context;

        public FutureTransactionControler(AppDbContext context)
        {
            _context = context;
        }
        // GET: FutureTransactionControler
        public ActionResult Index()
        {
            return View();
        }

        // GET: FutureTransactionControler/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: FutureTransactionControler/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: FutureTransactionControler/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: FutureTransactionControler/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: FutureTransactionControler/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: FutureTransactionControler/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: FutureTransactionControler/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
        // GET: api/futuretransaction/5?year=2025&month=6
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserTransactionsByMonth(int userId, [FromQuery] int year, [FromQuery] int month)
        {
            {
                try
                {
                    var transactions = await _context.FutureTransactionViews
    .Where(t => t.userId.HasValue && 
               t.userId.Value == userId &&
               t.TransactionYear == year &&
               t.TransactionMonth == month)
    .Select(t => new
    {
        userId = t.userId.Value,
        categoryName = t.categoryName,
        amount = t.amount,
        date = t.date,
        type = t.type,
    })
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
}
