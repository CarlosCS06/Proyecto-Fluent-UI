using Contoso.Pizza.AdminApi.Models;

namespace Contoso.Pizza.AdminApi.Services.Contracts;

public interface IProductService
{
    Task<ProductEntity?> GetByIdAsync(Guid id);
    Task<IEnumerable<ProductEntity>> GetAllAsync();
    Task<ProductEntity> AddAsync(ProductEntity entity);
    Task<int> UpdateAsync(ProductEntity entity);
    Task<int> DeleteAsync(Guid id);
    Task<IEnumerable<ProductEntity>> GetLowStockAsync();
}
