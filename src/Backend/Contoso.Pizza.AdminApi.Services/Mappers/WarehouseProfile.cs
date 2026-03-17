using AutoMapper;
using Contoso.Pizza.AdminApi.Models;
using DM = Contoso.Pizza.Data.Models;

namespace Contoso.Pizza.AdminApi.Services.Mappers;

public class WarehouseProfile : Profile
{
    public WarehouseProfile()
    {
        CreateMap<DM.Product, ProductEntity>()
            .ReverseMap();
        
        // We will add StockMovement mappings if needed later
    }
}
