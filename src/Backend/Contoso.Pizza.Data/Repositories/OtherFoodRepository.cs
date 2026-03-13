using Contoso.Pizza.Data.Contracts;
using Contoso.Pizza.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Contoso.Pizza.Data.Repositories;

public class OtherFoodRepository : IOtherFoodRepository
{
    private readonly ContosoPizzaDataContext _dbContext;

    public OtherFoodRepository(ContosoPizzaDataContext context)
    {
        _dbContext = context;
    }

    public async Task<IEnumerable<OtherFood>> GetAllAsync()
    {
        return await _dbContext.OtherFoods
                               .OrderByDescending(t => t.Modified)
                               .ThenBy(t => t.Created)
                               .AsNoTracking()
                               .ToListAsync();
    }

    public async Task<OtherFood?> GetByIdAsync(Guid id)
    {
        return await _dbContext.OtherFoods
                               .AsNoTracking()
                               .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<OtherFood> AddAsync(OtherFood otherFood)
    {
        otherFood.Id = Guid.NewGuid();
        await _dbContext.OtherFoods.AddAsync(otherFood);
        await _dbContext.SaveChangesAsync();

        return otherFood;
    }

    public async Task<int> UpdateAsync(OtherFood otherFood)
    {
        var storedOtherFood = await _dbContext.OtherFoods
                                     .Where(t => t.Id == otherFood.Id)
                                     .FirstOrDefaultAsync();

        if (storedOtherFood == null)
        {
            return -1;
        }
        storedOtherFood.Name = otherFood.Name;
        storedOtherFood.Description = otherFood.Description;
        storedOtherFood.Modified = DateTime.UtcNow;

        var result = await _dbContext.SaveChangesAsync();

        return result;
    }

    public async Task<int> DeleteAsync(Guid id)
    {
        var result = await _dbContext.OtherFoods
                                     .Where(t => t.Id == id)
                                     .ExecuteDeleteAsync();
        return result;
    }
}
