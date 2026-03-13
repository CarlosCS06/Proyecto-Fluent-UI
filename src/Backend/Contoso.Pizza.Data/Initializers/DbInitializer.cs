using Contoso.Pizza.Data.Models;
using DM = Contoso.Pizza.Data.Models;

namespace Contoso.Pizza.Data.Initializers;

public static class DbInitializer
{
    public static void Initialize(ContosoPizzaDataContext context)
    {
        if (!context.Pizza.Any() && !context.Toppings.Any() && !context.Sauces.Any())
        {
            var pepperoniTopping = new Topping { Name = "Pepperoni", Calories = 130 };
            var sausageTopping = new Topping { Name = "Sausage", Calories = 100 };
            var hamTopping = new Topping { Name = "Ham", Calories = 70 };
            var chickenTopping = new Topping { Name = "Chicken", Calories = 50 };
            var pineappleTopping = new Topping { Name = "Pineapple", Calories = 75 };

            var tomatoSauce = new Sauce { Name = "Tomato", IsVegan = true };
            var alfredoSauce = new Sauce { Name = "Alfredo", IsVegan = false };

            var pizzas = new DM.Pizza[]
            {
                new DM.Pizza
                {
                    Name = "Meat Lovers",
                    Sauce = tomatoSauce,
                    Toppings = new List<Topping>
                    {
                        pepperoniTopping,
                        sausageTopping,
                        hamTopping,
                        chickenTopping
                    }
                },
                new DM.Pizza
                {
                    Name = "Hawaiian",
                    Sauce = tomatoSauce,
                    Toppings = new List<Topping>
                    {
                        pineappleTopping,
                        hamTopping
                    }
                },
                new DM.Pizza
                {
                    Name = "Alfredo Chicken",
                    Sauce = alfredoSauce,
                    Toppings = new List<Topping>
                    {
                        chickenTopping
                    }
                }
            };

            context.Pizza.AddRange(pizzas);
        }

        if (!context.OtherFoods.Any())
        {
            var otherFoods = new OtherFood[]
            {
                new OtherFood { Name = "Nuggets de pollo", Description = "Crujientes bocaditos de pollo." },
                new OtherFood { Name = "Patatas bravas", Description = "Patatas fritas con salsa brava picante." },
                new OtherFood { Name = "Flamenquín", Description = "Rollo de cerdo con jamón, empanado." },
                new OtherFood { Name = "Croquetas", Description = "Croquetas caseras de jamón o pollo." }
            };

            context.OtherFoods.AddRange(otherFoods);
        }

        context.SaveChanges();
    }
}
