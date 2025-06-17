public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string plainTextContent, string htmlContent);
}
