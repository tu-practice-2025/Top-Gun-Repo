using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;
using SummerPracticeWebApi.Services.Interfaces;
using SummerPracticeWebApi.DTOs;

namespace SummerPracticeWebApi.Services.Implepemnations
{
    public class LLMChatService : ILLMChatService
    {

        private readonly HttpClient _httpClient;
        private readonly ITransactionService _transactionService;
        private readonly IReportGeneratorService _reportGenerator;

        public LLMChatService(
            HttpClient httpClient,
            ITransactionService transactionService,
            IReportGeneratorService reportGenerator
            )
        {
            _httpClient = httpClient;
            _transactionService = transactionService;
            _reportGenerator = reportGenerator;
        }

        public async Task<IActionResult> PromptChat(int userId)
        {
            var date = DateTime.Today;
            var transactionData = await _transactionService.GetMonthlyTransactionAsync(userId, date);
            var data = _reportGenerator.GenerateMonthlyReport(transactionData, date);

            string prompt = "Качил съм данни за разходи по категории за един потребител и общите разходи и приходи. "
                + "Всяка категория съдържа име и сума. Моля, дай ми точно три персонализирани финансови съвета въз основа на данните. "
                + "Фокусирай се върху най-големите разходи, възможности за оптимизация. Отговорът да е практичен и кратък без излишен текст в началото и края и в точния формат. "
                + "Приеми, че отговаряш директно на клиента."
                + "ВАЖНО ЗА ОТГОВОРА: Не включвай никакъв въвеждащ или заключителен текст и не използвай никакви специални символи,емоджита и тн. Отговорът трябва да съдържа само три съвета без заглавия, без допълнителни обяснения преди или след тях и да е в markdown формат. ЗАДЪЛЖИТЕЛНО върни три съвета и не споменавай заданието си!"
                + "Във формат:\n" +
                "• съвет 1\n" +
                "• съвет 2\n" +
                "• съвет 3";


            var request = new LLMRequestDTO
            {
                Messages = new List<ChatMessageDTO>
                {
                    new ChatMessageDTO
                    {
                        Role = "user",
                        Content = 
                        $"\"{data}\" \n" +
                        $"{prompt}"
                    }
                },
            };


            HttpResponseMessage response = await _httpClient.PostAsJsonAsync("http://localhost:8080/v1/chat/completions", request);

            if (!response.IsSuccessStatusCode)
                return new BadRequestObjectResult("Invalid request to LLM API");
                    

            var json = await response.Content.ReadAsStringAsync();

            using var doc = System.Text.Json.JsonDocument.Parse(json);
            var content = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

           

            return new OkObjectResult(content);
        }


    }
}
