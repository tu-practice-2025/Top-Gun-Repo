namespace SummerPracticeWebApi.Models
{
    public class Budget
    {
        public int BudgetId { get; set; }
        
        public int CategoryId { get; set; }
        public int UserId { get; set; }
        public double Limit { get; set; }
      
    }
}
