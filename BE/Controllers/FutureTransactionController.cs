using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.Models;

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FutureTransactionController : ControllerBase
    {
        private readonly AppDbContext _context;
        public FutureTransactionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "FutureTransaction controller is working!", timestamp = DateTime.Now });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFutureTransaction(int id)
        {
            try
            {
                var transaction = await _context.Future_transactions.FindAsync(id);
                if (transaction == null)
                {
                    return NotFound($"Future transaction with id {id} not found");
                }
                _context.Future_transactions.Remove(transaction);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = "Future transaction deleted successfully",
                    deletedId = id
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/futuretransaction/1?year=2025&month=6
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserTransactionsByMonth(int userId, [FromQuery] int year, [FromQuery] int month)
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


        // POST: api/futuretransaction
        [HttpPost]
        public async Task<IActionResult> CreateFutureTransaction([FromBody] CreateFutureTransactionDto dto)
        {

            try
            {
                if (dto == null)
                {
                    return BadRequest("Transaction data is required");
                }

                if (dto.CategoryId <= 0)
                {
                    return BadRequest("Valid category ID is required");
                }

                if (dto.UserId <= 0)
                {
                    return BadRequest("Valid user ID is required");
                }

                if (dto.Amount <= 0)
                {
                    return BadRequest("Amount must be greater than 0");
                }

                if (dto.Type != 'I' && dto.Type != 'E')
                {
                    return BadRequest("Type must be 'I' for income or 'E' for expense");
                }

                var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == dto.CategoryId);
                if (!categoryExists)
                {
                    return BadRequest("Category does not exist");
                }

                var userExists = await _context.Users.AnyAsync(u => u.UserId == dto.UserId);
                if (!userExists)
                {
                    return BadRequest("User does not exist");
                }

                var futureTransaction = new FutureTransaction
                {
                    category_id = dto.CategoryId,
                    user_id = dto.UserId,
                    amount = dto.Amount,
                    type = dto.Type,
                    date = dto.Date
                };

                _context.Future_transactions.Add(futureTransaction);
                await _context.SaveChangesAsync();


                var response = new
                {
                    id = futureTransaction.FutureTransactionId,
                    categoryId = futureTransaction.category_id,
                    userId = futureTransaction.user_id,
                    amount = futureTransaction.amount,
                    type = futureTransaction.type,
                    date = futureTransaction.date,
                    message = "Future transaction created successfully"
                };

                return CreatedAtAction(nameof(GetUserTransactionsByMonth),
                    new { userId = futureTransaction.user_id, year = futureTransaction.date.Year, month = futureTransaction.date.Month },
                    response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        //PUT: api/futuretransaction/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFtureTransaction(int id, [FromBody] CreateFutureTransactionDto dto)
        {
            try
            {
                var transaction = await _context.Future_transactions.FindAsync(id);
                if(transaction == null)
                {
                    return NotFound($"Transaction with ID {id} not found.");
                }

                transaction.category_id = dto.CategoryId;
                transaction.user_id = dto.UserId;
                transaction.amount = dto.Amount;
                transaction.type = dto.Type;
                transaction.date = dto.Date;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Transaction updated successfully.",
                    udpatedId = id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class CreateFutureTransactionDto
    {
        public int CategoryId { get; set; }
        public int UserId { get; set; }
        public double Amount { get; set; }
        public char Type { get; set; } // income expense
        public DateTime Date { get; set; }
    }
}
