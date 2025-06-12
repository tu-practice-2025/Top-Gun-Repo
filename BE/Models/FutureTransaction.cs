using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{

    public enum TType
    {
        expense,
        income
    }
    public class FutureTransaction
    {
        [Column("id")]
        public int FutureTransactionId { get; set; }
        public int category_id { get; set; }
        public int user_id { get; set; }
        public double amount { get; set; }
        public TType type { get; set; }
    }
}
