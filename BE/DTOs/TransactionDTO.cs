namespace SummerPracticeWebApi.DTOs
{
    public class TransactionDTO

    {
        public List<TransactionListDTO> Expenses { get; set; } = new();
        public List<TransactionListDTO> Income { get; set; } = new();
    }

    public class TransactionListDTO
    {
        public string? CategoryName { get; set; }
        public double? PercentageAmount { get; set; }

    }

  

}

    



