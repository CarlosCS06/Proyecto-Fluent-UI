using Contoso.Pizza.AdminApi.Models;

namespace Contoso.Pizza.AdminUI.Services.Contracts;

public interface IOtherFoodService
{
    Task<IEnumerable<OtherFoodEntity>> GetAllOtherFoodsAsync();
    Task<OtherFoodEntity> AddOtherFoodAsync(OtherFoodEntity entity);
    Task UpdateOtherFoodAsync(OtherFoodEntity entity);
    Task DeleteOtherFoodAsync(OtherFoodEntity entity);
}
