using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyEcommerce.API.Data;
using MyEcommerce.API.Services;
using System.Security.Claims;

namespace MyEcommerce.API.Controllers
{
    public class CartItemDto
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class AddToCartDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;
        private readonly ApplicationDbContext _context;

        public CartController(CartService cartService, ApplicationDbContext context)
        {
            _cartService = cartService;
            _context = context;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        // GET: api/Cart
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCart()
        {
            var userId = GetUserId();
            var cartItems = await _cartService.GetCartAsync(userId);

            if (cartItems.Count == 0)
            {
                return new List<CartItemDto>();
            }

            var productIds = cartItems.Keys.ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id, p => p);

            var result = new List<CartItemDto>();
            foreach (var item in cartItems)
            {
                if (products.TryGetValue(item.Key, out var product))
                {
                    result.Add(new CartItemDto
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        Price = product.Price,
                        Quantity = item.Value,
                        ImageUrl = product.ImageUrl
                    });
                }
            }

            return result;
        }

        // POST: api/Cart
        [HttpPost]
        public async Task<ActionResult> AddToCart(AddToCartDto dto)
        {
            if (dto.Quantity <= 0)
            {
                return BadRequest("数量必须大于0");
            }

            var userId = GetUserId();
            var product = await _context.Products.FindAsync(dto.ProductId);

            if (product == null)
            {
                return NotFound("商品不存在");
            }

            if (product.Stock < dto.Quantity)
            {
                return BadRequest("库存不足");
            }

            await _cartService.AddItemAsync(userId, dto.ProductId, dto.Quantity);
            return Ok();
        }

        // PUT: api/Cart/5
        [HttpPut("{productId}")]
        public async Task<ActionResult> UpdateCartItem(int productId, [FromBody] int quantity)
        {
            if (quantity < 0)
            {
                return BadRequest("数量不能为负数");
            }

            var userId = GetUserId();
            var product = await _context.Products.FindAsync(productId);

            if (product == null)
            {
                return NotFound("商品不存在");
            }

            if (quantity > 0 && product.Stock < quantity)
            {
                return BadRequest("库存不足");
            }

            await _cartService.UpdateItemQuantityAsync(userId, productId, quantity);
            return Ok();
        }

        // DELETE: api/Cart/5
        [HttpDelete("{productId}")]
        public async Task<ActionResult> RemoveFromCart(int productId)
        {
            var userId = GetUserId();
            await _cartService.RemoveItemAsync(userId, productId);
            return Ok();
        }

        // DELETE: api/Cart
        [HttpDelete]
        public async Task<ActionResult> ClearCart()
        {
            var userId = GetUserId();
            await _cartService.ClearCartAsync(userId);
            return Ok();
        }
    }
}