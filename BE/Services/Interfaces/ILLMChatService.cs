using Microsoft.AspNetCore.Mvc;

namespace SummerPracticeWebApi.Services.Interfaces
{
    public interface ILLMChatService
    {
        Task<IActionResult> PromptChat(int userId);
    }
}
