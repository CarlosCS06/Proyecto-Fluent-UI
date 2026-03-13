using AutoMapper;
using Contoso.Pizza.AdminApi.Models;
using Contoso.Pizza.AdminApi.Services.Contracts;
using Contoso.Pizza.Data.Contracts;
using DM = Contoso.Pizza.Data.Models;

namespace Contoso.Pizza.AdminApi.Services;

public class OtherFoodService : IOtherFoodService
{
    private readonly IOtherFoodRepository _repository;
    private readonly IMapper _mapper;

    public OtherFoodService(IOtherFoodRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<OtherFoodEntity>> GetAllAsync()
    {
        var otherFoods = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<OtherFoodEntity>>(otherFoods);
    }

    public async Task<OtherFoodEntity?> GetByIdAsync(Guid id)
    {
        var otherFood = await _repository.GetByIdAsync(id);
        return _mapper.Map<OtherFoodEntity>(otherFood);
    }

    public async Task<OtherFoodEntity> AddAsync(OtherFoodEntity entity)
    {
        var newOtherFood = _mapper.Map<DM.OtherFood>(entity);
        await _repository.AddAsync(newOtherFood);
        return _mapper.Map<OtherFoodEntity>(newOtherFood);
    }

    public async Task<int> UpdateAsync(OtherFoodEntity entity)
    {
        var otherFoodToUpdate = _mapper.Map<DM.OtherFood>(entity);
        return await _repository.UpdateAsync(otherFoodToUpdate);
    }

    public async Task<int> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }
}
