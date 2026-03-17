using System.ComponentModel.DataAnnotations;

namespace Contoso.Pizza.Data.Models;

public class Product : BaseModel
{
    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    [Required]
    [MaxLength(50)]
    public required string Sku { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Cost { get; set; }

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    [Range(0, int.MaxValue)]
    public int MinStockLevel { get; set; }

    [MaxLength(50)]
    public string? Category { get; set; }
}
