using Contoso.Pizza.AdminApi.Models;
using Contoso.Pizza.AdminUI.Services.Contracts;
using Microsoft.AspNetCore.Components;
using Microsoft.FluentUI.AspNetCore.Components;

namespace Contoso.Pizza.AdminUI.Components.Pages.OtherFood;

public partial class OtherFoodsPage
{
    [Inject]
    public required IOtherFoodService Service { get; set; }

    private IQueryable<OtherFoodEntity>? _otherFoods;

    private IDialogReference? _dialog;

    protected override async Task OnInitializedAsync()
    {
        await LoadOtherFoods();
    }

    private async Task LoadOtherFoods()
    {
        _otherFoods = (await Service.GetAllOtherFoodsAsync()).AsQueryable();
    }

    private async Task OnAddNewOtherFoodClick()
    {
        var panelTitle = $"Add other food";
        var result = await ShowPanel(panelTitle, new OtherFoodEntity() { Name = "New Food" });
        if (result.Cancelled)
        {
            return;
        }
        var entity = result.Data as OtherFoodEntity;
        ShowProgressToast(nameof(OnAddNewOtherFoodClick), "Other Food", entity!.Name);
        _ = await Service.AddOtherFoodAsync(entity!);
        CloseProgressToast(nameof(OnAddNewOtherFoodClick));
        ShowSuccessToast("Other Food", entity!.Name);
        await LoadOtherFoods();
    }

    private async Task OnEditOtherFoodClick(OtherFoodEntity otherFood)
    {
        var panelTitle = $"Edit other food";
        var result = await ShowPanel(panelTitle, otherFood, false);
        if (result.Cancelled)
        {
            return;
        }
        var entity = result.Data as OtherFoodEntity;
        ShowProgressToast(nameof(OnEditOtherFoodClick), "Other Food", entity!.Name, Operation.Update);
        await Service.UpdateOtherFoodAsync(entity!);
        CloseProgressToast(nameof(OnEditOtherFoodClick));
        ShowSuccessToast("Other Food", entity!.Name, Operation.Update);
        await LoadOtherFoods();
    }

    private async Task OnDeleteOtherFoodClick(OtherFoodEntity entity)
    {
        var confirm = await ShowConfirmationDialogAsync("Delete Food", $"Are you sure you want to delete {entity.Name}?");
        if (confirm.Cancelled)
        {
            return;
        }
        ShowProgressToast(nameof(OnDeleteOtherFoodClick), "Other Food", entity.Name, Operation.Delete);
        await Service.DeleteOtherFoodAsync(entity);
        CloseProgressToast(nameof(OnDeleteOtherFoodClick));
        ShowSuccessToast("Other Food", entity.Name, Operation.Delete);
        await LoadOtherFoods();
    }

    private async Task<DialogResult> ShowPanel(string title, OtherFoodEntity otherFood, bool isAdd = true)
    {
        var primaryActionText = isAdd ? "Add" : "Save changes";
        var dialogParameter = new DialogParameters<OtherFoodEntity>()
        {
            Content = otherFood,
            Alignment = HorizontalAlignment.Right,
            Title = title,
            PrimaryAction = primaryActionText,
            Width = "500px",
            PreventDismissOnOverlayClick = true,
        };
        _dialog = await DialogService.ShowPanelAsync<OtherFoodUpsertPanel>(otherFood, dialogParameter);
        return await _dialog.Result;
    }
}
