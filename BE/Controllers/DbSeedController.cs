using Microsoft.AspNetCore.Mvc;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.DataAccess;

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DbSeedController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IDbInitializer initializer;

        public DbSeedController(AppDbContext context, IDbInitializer initializer)
        {
            _context = context;
            this.initializer = initializer;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            await initializer.SeedUsersAsync(1,1000);
            return Ok();
        }
    }
}
