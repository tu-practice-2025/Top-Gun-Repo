using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{
    public class Budget
    {

        [Column("id")]
        public int BudgetId { get; set; }
        
        public int category_id { get; set; }
        public int user_id { get; set; }
        public DateTime date { get; set; }
        public double limit { get; set; }
      
    }
}
