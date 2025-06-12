using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{
    public class Account

    {
        [Column("id")]
        public int AccountId { get; set; }
        public string iban { get; set; }
        public int user_id { get; set; }
        
    }
}
