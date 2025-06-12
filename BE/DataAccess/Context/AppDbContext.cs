using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.Models;

namespace SummerPracticeWebApi.DataAccess.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
    }
}
