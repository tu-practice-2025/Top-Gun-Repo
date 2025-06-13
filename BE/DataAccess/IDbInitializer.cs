
namespace SummerPracticeWebApi.DataAccess
{
    public interface IDbInitializer
    {
        Task SeedUsersAsync(int start, int end);
    }
}