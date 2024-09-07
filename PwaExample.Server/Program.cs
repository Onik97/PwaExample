var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    });
}

var app = builder.Build();

if (builder.Environment.IsDevelopment())
{
    app.UseCors();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api", () =>
{
    return new { Message = "Yes, I am from the API" };
});

app.MapFallbackToFile("/index.html");

app.Run();
