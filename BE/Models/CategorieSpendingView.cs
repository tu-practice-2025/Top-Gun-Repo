using System.ComponentModel.DataAnnotations;

namespace SummerPracticeWebApi.Models
{
    public class CategorieSpendingView
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal TotalSpent { get; set; }
        public int? UserId { get; set; }
    }
}
