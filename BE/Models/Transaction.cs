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
        public int TransactionId { get; set; }
        public int CategoryId { get; set; }
        public int MerchantId { get; set; }
        public int UserId { get; set; }

        public string MerchantName { get; set; }

        public double Amount { get; set; }

        public Currency Currency { get; set; }
        public DateTime Date { get; set; }
        public PaymentType PaymentType { get; set; }
        public TransactionType TransactionType { get; set; }
    }
}
