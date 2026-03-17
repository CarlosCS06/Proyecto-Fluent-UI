using Contoso.Pizza.AdminApi.Models;
using Contoso.Pizza.AdminApi.Services.Contracts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Contoso.Pizza.AdminApi.MVC.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    [HttpGet(Name = nameof(GetProducts))]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IEnumerable<ProductEntity>> GetProducts()
    {
        return await _service.GetAllAsync();
    }

    [HttpGet("{id:guid}", Name = "ProductById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<Results<NotFound, Ok<ProductEntity>>> GetProductById(Guid id)
    {
        var product = await _service.GetByIdAsync(id);
        return product == null ? TypedResults.NotFound() : TypedResults.Ok(product);
    }

    [HttpGet("low-stock")]
    public async Task<IEnumerable<ProductEntity>> GetLowStock()
    {
        return await _service.GetLowStockAsync();
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Post([FromBody] ProductEntity newProduct)
    {
        var createdProduct = await _service.AddAsync(newProduct);
        return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Put(Guid id, [FromBody] ProductEntity product)
    {
        product.Id = id;
        var result = await _service.UpdateAsync(product);
        return result == 1 ? Ok() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        return result == 1 ? Ok() : NotFound();
    }
}
