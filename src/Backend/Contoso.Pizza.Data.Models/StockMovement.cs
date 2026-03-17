using System.ComponentModel.DataAnnotations;

namespace Contoso.Pizza.Data.Models;

public class StockMovement : BaseModel
{
    public Guid ProductId { get; set; }
    public required Product Product { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Required]
    [MaxLength(10)]
    public required string Type { get; set; } // "In" or "Out"

    public DateTime MovementDate { get; set; } = DateTime.UtcNow;

    public string? Reason { get; set; }
}
