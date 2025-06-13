using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.Models;
using System.Data;

namespace SummerPracticeWebApi.DataAccess.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
        
 public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Merchant> Merchants { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<FutureTransaction> Future_transactions { get; set; }
        public DbSet<CategorieSpendingView> CategorySpending { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<CategorieSpendingView>(entity =>
            {
                entity.HasNoKey();
                entity.ToView("category_spending");
                entity.Property(e => e.Code).HasColumnName("code");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.TotalSpent).HasColumnName("total_spent");
            });


        }

   

        public DbSet<SummerPracticeWebApi.Models.Merchant> Merchant { get; set; } = default!;
    }
}
