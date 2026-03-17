using Contoso.Pizza.AdminApi.Models;
using Contoso.Pizza.AdminApi.Services.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Contoso.Pizza.AdminApi.MVC.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InventoryDashboardController : ControllerBase
{
    private readonly IProductService _productService;

    public InventoryDashboardController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var products = await _productService.GetAllAsync();
        var totalStock = products.Sum(p => p.StockQuantity);
        var lowStockCount = products.Count(p => p.StockQuantity <= p.MinStockLevel);
        var inventoryValue = products.Sum(p => p.StockQuantity * p.Price);
        var inventoryCost = products.Sum(p => p.StockQuantity * p.Cost);

        return Ok(new
        {
            TotalProducts = products.Count(),
            TotalStock = totalStock,
            LowStockCount = lowStockCount,
            TotalValue = inventoryValue,
            TotalCost = inventoryCost,
            StockLevels = products.Select(p => new { p.Name, p.StockQuantity, p.MinStockLevel })
        });
    }
}
