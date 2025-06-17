namespace SummerPracticeWebApi.DTOs
{
    public class TransactionDTO

    {
        public List<TransactionListDTO> Expenses { get; set; } = new();
        public List<TransactionListDTO> Income { get; set; } = new();

        public double totalExpenses { get; set; }
        public double totalIncome { get; set; }

    }

    public class TransactionListDTO
    {
        public string? CategoryName { get; set; }
        public double? PercentageAmount { get; set; }

        public double? TotalAmount { get; set; }

    }

  

}

    



