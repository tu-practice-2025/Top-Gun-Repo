using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess.Context;

namespace SummerPracticeWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _context.Products
                .Where(x => x.Id == id)
                .OrderBy(x => x.Id)
                .FirstOrDefaultAsync();

            return Ok(product);
        }

        // GET: api/products/list
        [HttpGet("list")]
        public IActionResult GetProducts()
        {
            var products = _context.Products.ToList();
            return Ok(products);
        }
    }
}
