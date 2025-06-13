using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{



    public class Transaction
    {
        [Column("id")]
        public int TransactionId { get; set; }

        public string transaction_code { get; set; }
        public int category_id { get; set; }
        public int merchant_id { get; set; }
        public int user_id { get; set; }

        public string card_number { get; set; }

        public double amount { get; set; }

        public DateTime date { get; set; }
        public char type { get; set; }
    }
}
