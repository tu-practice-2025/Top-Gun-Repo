using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.Models;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase

    {
        private readonly AppDbContext _context;

        public  UsersController(AppDbContext context)
        {
            _context = context;
        }
        // GET: api/<UsersController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var users = await _context.Users
                .Where(x => x.UserId == id)
                .OrderBy(x => x.UserId)
                .FirstOrDefaultAsync();

            return Ok(users);

        }



        [HttpPost]
        public async Task<IActionResult> Post([FromBody] User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            
            return CreatedAtAction(nameof(Get),
                                   new { id = user.UserId },
                                   user);
        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}   
