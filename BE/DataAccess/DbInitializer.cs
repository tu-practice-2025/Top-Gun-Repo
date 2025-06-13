using SummerPracticeWebApi.DataAccess.Context;
using static Org.BouncyCastle.Asn1.Cmp.Challenge;
using SummerPracticeWebApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace SummerPracticeWebApi.DataAccess
{
    public class DbInitializer : IDbInitializer
    {
        private readonly AppDbContext context;

        public DbInitializer(AppDbContext context)
        {
            this.context = context;
        }
        public async Task SeedUsersAsync(int start, int end)
        {
            var random = new Random();
            var categories = await context.Categories.ToListAsync();
            var merchants = await context.Merchants.ToListAsync();
            var iban_counter = 27530600708090;
            var card_counter = 1000030600500402;

            var transactionDescriptions = new Dictionary<string, string>
                {
                    { "WCH", "Теглене на пари на каса от клнт с-к" },
                    { "WCO", "Теглене/Трансфер от клнт с-ка" },
                    { "C29", "Такса превод за пътни такси и глоби" },
                    { "CS4", "Такса комуникационни услуги" },
                    { "FMC", "Операция по колективни инвестиционни схеми" },
                    { "LPR", "Погасяване на главница" },
                    { "LPI", "Погасяв.на л-ва за редовна главница" },
                    { "LPE", "Пог.на л-ва за просрочена главница" },
                    { "LPN", "Погасяване на наказателна лихва" },
                    { "LZC", "Застрахователна премия" },
                    { "TF6", "Покупка на винетка/компенсаторна такса" },
                    { "TB1", "BLINK Платежно нареждане извън банката" },
                    { "TF1", "Издаден вътр.банков превод" },
                    { "THO", "Платежно нареждане извън банката" },
                    { "TBD", "Превод данъчно задължение" },
                    { "TF3", "Издаден вътр.превод мобилен номер" },
                    { "MMU", "Комунално плащане mBanking" },
                    { "FFU", "Комунално плащане" },
                    { "OOU", "Комунално плащане BBO" },
                    { "C24", "BLINK Такса за междубанков превод" },
                    { "UCH", "Такса за превод" },
                    { "CHH", "Такса за вътрешнобанков превод" }
                };

            for (int i = start; i <= end; i++) // Set user start id and end
            {
                var user = new User
                {
                    name = $"Човек{i}",
                    username = $"user{i}",
                    password = $"pass{i}",
                    next_month_income = random.Next(1000, 3000)
                };

                context.Users.Add(user);
                await context.SaveChangesAsync();

                var account = new Account
                {
                    iban = $"BG00UNCR{iban_counter++}",
                    user_id = user.UserId
                };

                context.Accounts.Add(account);

                int numCards = random.Next(1, 3);
                var cardNumbers = new List<string>();
                for (int j = 0; j < numCards; j++)
                {
                    string cardNumber = card_counter++.ToString();
                    context.Cards.Add(new Card
                    {
                        card_number = cardNumber,
                        user_id = user.UserId
                    });
                    cardNumbers.Add(cardNumber);
                }

                for (int t = 0; t < 20; t++)
                {
                    var category = categories[random.Next(categories.Count)];
                    var merchant = merchants[random.Next(merchants.Count)];
                    var transactionInfo = transactionDescriptions.ElementAt(random.Next(transactionDescriptions.Count));

                    var paymentType = random.Next(2) == 0 ? "cash" : "card";
                    var type = category.name.Contains("Income") ? 'I' : 'E';
                    var transaction_desc_index = random.Next(0, 22);

                    context.Transactions.Add(new Transaction
                    {
                        transaction_code = type == 'E' ? transactionDescriptions.ElementAt(transaction_desc_index).Key : "INCOME",
                        category_id = category.CategoryId,
                        merchant_id = merchant.MerchantId,
                        user_id = user.UserId,
                        card_number = cardNumbers[random.Next(0, numCards - 1)],
                        amount = Math.Round(random.NextDouble() * (1000 - 5) + 5, 2),
                        date = DateTime.Today.AddDays(-random.Next(0, 30)),
                        type = type
                    });
                }

                await context.SaveChangesAsync();
            }
        }


    }
}
