namespace Contoso.Pizza.Data.Models;

public class OtherFood : BaseModel
{
    public required string Name { get; set; }
    public string? Description { get; set; } = string.Empty;
}
