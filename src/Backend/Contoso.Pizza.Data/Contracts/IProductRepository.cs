using Contoso.Pizza.Data.Models;

namespace Contoso.Pizza.Data.Contracts;

public interface IProductRepository : IRepository<Product>
{
    // Add custom product methods if needed
}
