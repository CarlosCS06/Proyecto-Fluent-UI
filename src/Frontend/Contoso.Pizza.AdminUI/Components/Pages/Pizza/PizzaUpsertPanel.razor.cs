using Contoso.Pizza.AdminApi.Models;
using Contoso.Pizza.AdminUI.Services;
using Contoso.Pizza.AdminUI.Services.Contracts;
using Microsoft.AspNetCore.Components;

namespace Contoso.Pizza.AdminUI.Components.Pages.Pizza;

public partial class PizzaUpsertPanel
{
    [Inject]
    ISauceService SauceService { get; set; } = default!;
    
    [Inject]
    IToppingService ToppingService { get; set; } = default!;
    
    [Parameter]
    public PizzaEntity Content { get; set; } = default!;

    IEnumerable<SauceEntity>? _sauces;
    List<ToppingEntity>? _toppings = [];
    bool isBusy;

    protected override async Task OnInitializedAsync()
    {
        try
        {
            isBusy = true;        
            _sauces = await SauceService.GetAllSaucesAsync() ?? Array.Empty<SauceEntity>();
            
            if (Content.Sauce == null && _sauces.Any())
            {
                Content.Sauce = _sauces.FirstOrDefault();
            }
            
            _toppings = (await ToppingService.GetAllToppingsAsync())?.ToList() ?? new List<ToppingEntity>();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error initializing PizzaUpsertPanel: {ex.Message}");
        }
        finally
        {
            isBusy = false;
        }
    }

    protected void OnToppingSelected(ToppingEntity item, bool selected)
    {
        if(selected)
        {
            Content.Toppings!.Add(item);
        }
        else
        {
            Content.Toppings!.Remove(item);
        }
    }
}
