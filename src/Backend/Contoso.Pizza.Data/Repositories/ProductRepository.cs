using Contoso.Pizza.Data.Contracts;
using Contoso.Pizza.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Contoso.Pizza.Data.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ContosoPizzaDataContext _context;

    public ProductRepository(ContosoPizzaDataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task<Product> AddAsync(Product entity)
    {
        _context.Products.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<int> UpdateAsync(Product entity)
    {
        _context.Products.Update(entity);
        return await _context.SaveChangesAsync();
    }

    public async Task<int> DeleteAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return 0;
        _context.Products.Remove(product);
        return await _context.SaveChangesAsync();
    }
}
