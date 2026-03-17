using AutoMapper;
using Contoso.Pizza.AdminApi.Models;
using Contoso.Pizza.AdminApi.Services.Contracts;
using Contoso.Pizza.Data;
using Contoso.Pizza.Data.Contracts;
using Microsoft.EntityFrameworkCore;
using DM = Contoso.Pizza.Data.Models;

namespace Contoso.Pizza.AdminApi.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;
    private readonly IMapper _mapper;

    public ProductService(IProductRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductEntity>> GetAllAsync()
    {
        var products = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<ProductEntity>>(products);
    }

    public async Task<ProductEntity?> GetByIdAsync(Guid id)
    {
        var product = await _repository.GetByIdAsync(id);
        return _mapper.Map<ProductEntity>(product);
    }

    public async Task<ProductEntity> AddAsync(ProductEntity newEntity)
    {
        var product = _mapper.Map<DM.Product>(newEntity);
        await _repository.AddAsync(product);
        return _mapper.Map<ProductEntity>(product);
    }

    public async Task<int> UpdateAsync(ProductEntity entity)
    {
        var product = _mapper.Map<DM.Product>(entity);
        return await _repository.UpdateAsync(product);
    }

    public async Task<int> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    public async Task<IEnumerable<ProductEntity>> GetLowStockAsync()
    {
        var products = await _repository.GetAllAsync();
        var lowStock = products.Where(p => p.StockQuantity <= p.MinStockLevel);
        return _mapper.Map<IEnumerable<ProductEntity>>(lowStock);
    }
}
