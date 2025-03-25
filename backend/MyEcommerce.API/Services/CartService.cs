using System.Text.Json;
using StackExchange.Redis;

namespace MyEcommerce.API.Services
{
    public class CartService
    {
        private readonly IDatabase _redis;

        public CartService(IConnectionMultiplexer redis)
        {
            _redis = redis.GetDatabase();
        }

        public async Task AddItemAsync(int userId, int productId, int quantity)
        {
            await _redis.HashSetAsync($"cart:{userId}", productId.ToString(), quantity);
        }

        public async Task RemoveItemAsync(int userId, int productId)
        {
            await _redis.HashDeleteAsync($"cart:{userId}", productId.ToString());
        }

        public async Task<Dictionary<int, int>> GetCartAsync(int userId)
        {
            var cart = await _redis.HashGetAllAsync($"cart:{userId}");
            return cart.ToDictionary(
                x => int.Parse(x.Name!),
                x => (int)x.Value
            );
        }

        public async Task ClearCartAsync(int userId)
        {
            await _redis.KeyDeleteAsync($"cart:{userId}");
        }

        public async Task UpdateItemQuantityAsync(int userId, int productId, int quantity)
        {
            if (quantity <= 0)
                await RemoveItemAsync(userId, productId);
            else
                await AddItemAsync(userId, productId, quantity);
        }
    }
}