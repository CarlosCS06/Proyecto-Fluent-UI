using Contoso.Pizza.AdminApi.Models;
using Contoso.Pizza.AdminApi.Services.Contracts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Contoso.Pizza.AdminApi.MVC.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OtherFoodsController : ControllerBase
{
    private readonly IOtherFoodService _service;

    public OtherFoodsController(IOtherFoodService service)
    {
        _service = service;
    }

    [HttpGet(Name = nameof(GetOtherFoods))]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IEnumerable<OtherFoodEntity>> GetOtherFoods()
    {
        var otherFoods = await _service.GetAllAsync();
        return otherFoods;
    }

    [HttpGet("{id:guid}", Name = "OtherFoodById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<Results<NotFound, Ok<OtherFoodEntity>>> GetOtherFoodById(Guid id)
    {
        var otherFood = await _service.GetByIdAsync(id);

        return otherFood == null ? TypedResults.NotFound() :
                                   TypedResults.Ok(otherFood);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Post([FromBody] OtherFoodEntity newOtherFood)
    {
        var createdOtherFood = await _service.AddAsync(newOtherFood);
        return CreatedAtAction(nameof(GetOtherFoodById), new { id = createdOtherFood.Id }, createdOtherFood);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Put(Guid id, [FromBody] OtherFoodEntity otherFood)
    {
        otherFood.Id = id;
        var result = await _service.UpdateAsync(otherFood);
        return result == 1 ? Ok() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        return result == 1 ? Ok() : NotFound();
    }
}
