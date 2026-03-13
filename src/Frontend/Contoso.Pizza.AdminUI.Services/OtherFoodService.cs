using Contoso.Pizza.AdminApi.Models;
using Contoso.Pizza.AdminUI.Services.Contracts;
using System.Net.Http.Json;

namespace Contoso.Pizza.AdminUI.Services;

public class OtherFoodService : IOtherFoodService
{
    private readonly HttpClient _httpClient;
    private const string _baseUri = "/api/otherfoods";

    public OtherFoodService(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient("AdminApi");
    }

    public async Task<OtherFoodEntity> AddOtherFoodAsync(OtherFoodEntity entity)
    {
        var response = await _httpClient.PostAsJsonAsync(_baseUri, entity);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<OtherFoodEntity>())!;
    }

    public async Task DeleteOtherFoodAsync(OtherFoodEntity entity)
    {
        var deleteUri = $"{_baseUri}/{entity.Id}";
        var response = await _httpClient.DeleteAsync(deleteUri);
        response.EnsureSuccessStatusCode();
    }

    public async Task<IEnumerable<OtherFoodEntity>> GetAllOtherFoodsAsync()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<OtherFoodEntity>>(_baseUri) ?? Array.Empty<OtherFoodEntity>();
    }

    public async Task UpdateOtherFoodAsync(OtherFoodEntity entity)
    {
        var updateUri = $"{_baseUri}/{entity.Id}";
        var response = await _httpClient.PutAsJsonAsync(updateUri, entity);
        response.EnsureSuccessStatusCode();
    }
}
