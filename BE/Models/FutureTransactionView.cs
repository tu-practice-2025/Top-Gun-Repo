using Org.BouncyCastle.Asn1.Crmf;
using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{
    public class FutureTransactionView
    {
        [Column("user_id")]
        public int? userId { get; set; }

        [Column("category_name")]
        public string? categoryName { get; set; }

        public double amount { get; set; }
        public DateTime date { get; set; }
        public char type { get; set; }

        [Column("transaction_year")]
        public int TransactionYear { get; set; }

        [Column("transaction_month")]
        public int TransactionMonth { get; set; }
    }
}
