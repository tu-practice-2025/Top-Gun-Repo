using Microsoft.AspNetCore.Mvc;
using YourNamespace.Services.Implementations;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public EmailController(EmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendTestEmail(string email, int userId )
    {
        await _emailService.SendSimpleEmail(email, userId);
        return Ok("Изпратено.");
    }
}
