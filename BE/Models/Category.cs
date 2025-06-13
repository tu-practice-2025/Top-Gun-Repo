using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{
    public class Category
    {
        [Column("id")]
        public int CategoryId { get; set; }

        public string code { get; set; }
        public string name { get; set; }


    }
}
