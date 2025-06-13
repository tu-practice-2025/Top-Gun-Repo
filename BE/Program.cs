using Microsoft.EntityFrameworkCore;
using SummerPracticeWebApi.DataAccess;
using SummerPracticeWebApi.DataAccess.Context;
using SummerPracticeWebApi.Services.Implementations;
using SummerPracticeWebApi.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IDbInitializer, DbInitializer>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()  // Allows any origin
              .AllowAnyMethod()  // Allows any HTTP method
              .AllowAnyHeader(); // Allows any headers
    });
});





builder.Services.AddScoped<ITransactionService, TransactionService>();





var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
// Enable CORS for the application
app.UseCors("AllowAll");

app.Run();
