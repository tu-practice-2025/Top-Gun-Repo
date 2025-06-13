using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{
    public class Merchant
    {
        [Column("id")]
        public int MerchantId { get; set; }
        public int mcc_code { get; set; }
        public string mcc_name
        {
            get; set;
        }
        public string mcc_desc { get; set; }
        public string mcc_cat { get; set; }

        
    }

}