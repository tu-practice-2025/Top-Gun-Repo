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
            return Ok(new { userId = user.UserId , email = user.email , name = user.name});


        }

        [HttpPost("auth-check")]
        public IActionResult CheckAuth()
        {
            var email = HttpContext.Session.GetString("UserEmail");

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Not logged in");
            }

            return Ok(new { message = "Logged in", email });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("UserEmail");
            return Ok("Logout successful");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] string name, [FromForm] string email, [FromForm] string password)
        {
            if (await _context.Users.AnyAsync(u => u.email == email))
            {
                return BadRequest(new { message = "Потребител с този имейл вече съществува" });
            }
            var user = new Models.User
            {
                name = name,
                email = email,
                password = password,
                next_month_income = 0
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Регистрацията е успешна" });
        }
    }
}
