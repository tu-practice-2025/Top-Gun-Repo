using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{
    public enum Currency
    {
        EUR,
        BGN
    }

    public enum PaymentType
    {
        Cash,
        Card
    }

    public enum TransactionType
    {
        Expense,
        Income
    }

    public class Transaction
    {
        [Column("id")]
        public int TransactionId { get; set; }
        public int category_id { get; set; }
        public int merchant_id { get; set; }
        public int user_id { get; set; }

        public int card_number { get; set; }

        public double amount { get; set; }

        public Currency currency { get; set; }
        public DateTime date { get; set; }
        public PaymentType payment_type { get; set; }
        public TransactionType type { get; set; }
    }
}
