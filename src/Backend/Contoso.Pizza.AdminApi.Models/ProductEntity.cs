using Contoso.Pizza.AdminApi.Models;

namespace Contoso.Pizza.AdminApi.Models;

public class ProductEntity : BaseEntity
{
    public required string Name { get; set; }
    public required string Sku { get; set; }
    public decimal Price { get; set; }
    public decimal Cost { get; set; }
    public int StockQuantity { get; set; }
    public int MinStockLevel { get; set; }
    public string? Category { get; set; }
}
