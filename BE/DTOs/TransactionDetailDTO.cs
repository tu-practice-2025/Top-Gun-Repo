namespace SummerPracticeWebApi.DTOs
{
    public class TransactionDetailDTO
    {
        public DateTime Date { get; set; }          
        public string MerchantName { get; set; }    
        public string Iban { get; set; }            
        public double Amount { get; set; }
        public string CardNumber { get; set; }
    }
}
