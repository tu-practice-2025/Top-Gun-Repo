using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.DTOs;
using SummerPracticeWebApi.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;
         

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Transactions
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var transactions = await _context.Transactions.ToListAsync();
            return Ok(transactions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var transaction = await _context.Transactions
                .Where(x => x.TransactionId == id)
                .OrderBy(x => x.TransactionId)
                .FirstOrDefaultAsync();

            return Ok(transaction);
        }

            // PUT: api/Transactions/5
           
         [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, Transaction transaction)
        {
            if (id != transaction.TransactionId)
            {
                return BadRequest();
            }

            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Transaction updated");
        }

        // POST: api/Transactions
 
        [HttpPost]
        public async Task<IActionResult> Post(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = transaction.TransactionId }, transaction);
        }

        // DELETE: api/Transactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return Ok("Transaction deleted");
        }

        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.TransactionId == id);
        }



        [HttpGet("{userId}")]
        public async Task<IActionResult> GetTransactions(int userId, DataSetDateTime date)
        {
           

        }
    }
}
