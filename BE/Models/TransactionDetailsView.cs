using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SummerPracticeWebApi.Models
{
    [Table("transaction_details_view")]
    public class TransactionDetailsView
    {
        [Key]
        [Column("transaction_id")]
        public int TransactionId { get; set; }

        [Column("transaction_code")]
        public string TransactionCode { get; set; }

        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("category_name")]
        public string CategoryName { get; set; }

        [Column("merchant_id")]
        public int MerchantId { get; set; }

        [Column("merchant_name")]
        public string MerchantName { get; set; }

        [Column("merchant_description")]
        public string MerchantDescription { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("card_number")]
        public string CardNumber { get; set; }

        [Column("amount")]
        public double Amount { get; set; }

        [Column("date")]
        public DateTime Date { get; set; }

        [Column("type")]
        public char Type { get; set; }

        [Column("transaction_year")]
        public int TransactionYear { get; set; }

        [Column("transaction_month")]
        public int TransactionMonth { get; set; }
    }
}
/*
CREATE VIEW transaction_details_view AS
SELECT 
    t.id AS transaction_id,
    t.transaction_code,
    t.category_id,
    c.name AS category_name,
    t.merchant_id,
    m.mcc_name AS merchant_name,
    m.mcc_desc AS merchant_description,
    t.user_id,
    t.card_number,
    t.amount,
    t.date,
    t.type,
    YEAR(t.date) AS transaction_year,
    MONTH(t.date) AS transaction_month
FROM transactions t
LEFT JOIN merchants m ON t.merchant_id = m.id
LEFT JOIN categories c ON t.category_id = c.id;
*/