using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{
    [Table("users")]
    public class User
    {
        [Column("id")]
        
        public int UserId { get; set; }

        public string name { get; set; }
        public string username { get; set; }
        public string password { get; set; }

        public int next_month_income { get; set; }
    }
}
