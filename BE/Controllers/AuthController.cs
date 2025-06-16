using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] string email, [FromForm] string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email && u.password == password);

            if (user == null)
            {
                return Unauthorized(new { message = "Грешен имейл или парола" });
            }

            HttpContext.Session.SetString("UserEmail", user.email);
            return Ok("Login successful");


        }
    }
}
