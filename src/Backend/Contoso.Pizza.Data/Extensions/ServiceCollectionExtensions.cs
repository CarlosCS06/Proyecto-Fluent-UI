using Contoso.Pizza.Data.Contracts;
using Contoso.Pizza.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Contoso.Pizza.Data.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ContosoPizzaDataContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("ContosoPizza")));

        services.AddScoped<IProductRepository, ProductRepository>();

        return services;
    }
}
