using Contoso.Pizza.AdminApi.Services;
using Contoso.Pizza.AdminApi.Services.Contracts;
using Microsoft.Extensions.DependencyInjection;

namespace Contoso.Pizza.AdminApi.Services.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBusinessServices(this IServiceCollection services)
        {
            services.AddScoped<IProductService, ProductService>();
            return services;
        }
    }
}
