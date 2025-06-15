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
    public class MerchantsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MerchantsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Merchants
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var merchants = await _context.Users.ToListAsync();
            return Ok(merchants);
        }

        // GET: api/Merchants/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var merchants = await _context.Merchants
                .Where(x => x.MerchantId == id)
                .OrderBy(x => x.MerchantId)
                .FirstOrDefaultAsync();

            return Ok(merchants);
        }

        // PUT: api/Merchants/5
       
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMerchant(int id, Merchant merchant)
        {
            if (id != merchant.MerchantId)
            {
                return BadRequest();
            }

            _context.Entry(merchant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MerchantExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Merchants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Merchant>> PostMerchant(Merchant merchant)
        {
            _context.Merchant.Add(merchant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMerchant", new { id = merchant.MerchantId }, merchant);
        }

        // DELETE: api/Merchants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMerchant(int id)
        {
            var merchant = await _context.Merchant.FindAsync(id);
            if (merchant == null)
            {
                return NotFound();
            }

            _context.Merchant.Remove(merchant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MerchantExists(int id)
        {
            return _context.Merchant.Any(e => e.MerchantId == id);
        }
    }
}
