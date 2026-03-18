using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowReact");
app.MapControllers();
app.Run();
