using Microsoft.AspNetCore.Mvc;
using SummerPracticeWebApi.Services.Interfaces;
using System.Net.Http;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SummerPracticeWebApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class LLMChatController : Controller
    {
        private readonly ILLMChatService _llmChatService;

        public LLMChatController(ILLMChatService llmChatService)
        {
            _llmChatService = llmChatService;
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> promptChat(int userId)
        {
           var response = await _llmChatService.PromptChat(userId);

            if (response is OkObjectResult okResult)
            {
                return Ok(okResult.Value);
            }
            else if (response is BadRequestObjectResult badRequestResult)
            {
                return BadRequest(badRequestResult.Value);
            }
            else
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }


    }
}
