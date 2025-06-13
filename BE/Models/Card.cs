using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{
    public class Card
    {
        [Column("id")]
    
        public int CardId { get; set; }
        public string card_number { get; set; }
        public int user_id { get; set; }
    }

}
