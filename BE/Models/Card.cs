using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{
    public class Card
    {
        [Column("id")]
        public int CardId { get; set; }
        public int mcc_code { get; set; }
        public string mcc_name { get; set; }
        public string mcc_desc { get; }

        public string mcc_cat { get; set; }
        public int cat_id { get; set; }
    }
}
