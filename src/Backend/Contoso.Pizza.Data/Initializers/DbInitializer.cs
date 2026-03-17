using Contoso.Pizza.Data.Models;

namespace Contoso.Pizza.Data.Initializers;

public static class DbInitializer
{
    public static void Initialize(ContosoPizzaDataContext context)
    {
        if (!context.Products.Any())
        {
            var products = new Product[]
            {
                new Product { Name = "Harina de Trigo 25kg", Sku = "HAR-001", Price = 18.50m, StockQuantity = 50, MinStockLevel = 10, Category = "Ingredientes" },
                new Product { Name = "Queso Mozzarella 5kg", Sku = "QUE-001", Price = 45.00m, StockQuantity = 20, MinStockLevel = 5, Category = "Ingredientes" },
                new Product { Name = "Tomate Triturado 10kg", Sku = "TOM-001", Price = 12.00m, StockQuantity = 8, MinStockLevel = 10, Category = "Ingredientes" },
                new Product { Name = "Cajas Pizza Mediana (100u)", Sku = "CAJ-001", Price = 35.00m, StockQuantity = 100, MinStockLevel = 20, Category = "Packaging" },
                new Product { Name = "Aceite de Oliva 5L", Sku = "ACE-001", Price = 25.00m, StockQuantity = 15, MinStockLevel = 3, Category = "Ingredientes" }
            };

            context.Products.AddRange(products);
            context.SaveChanges();

            var movements = new StockMovement[]
            {
                new StockMovement { Product = products[0], Quantity = 50, Type = "In", Reason = "Compra inicial", MovementDate = DateTime.UtcNow.AddDays(-5) },
                new StockMovement { Product = products[1], Quantity = 20, Type = "In", Reason = "Compra inicial", MovementDate = DateTime.UtcNow.AddDays(-5) },
                new StockMovement { Product = products[2], Quantity = 20, Type = "In", Reason = "Compra inicial", MovementDate = DateTime.UtcNow.AddDays(-5) },
                new StockMovement { Product = products[2], Quantity = 12, Type = "Out", Reason = "Producción diaria", MovementDate = DateTime.UtcNow.AddDays(-1) }
            };
            context.StockMovements.AddRange(movements);
        }

        context.SaveChanges();
    }
}
