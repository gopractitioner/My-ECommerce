using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyEcommerce.API.Data;
using MyEcommerce.API.Models;
using MyEcommerce.API.Services;
using System.Security.Claims;

namespace MyEcommerce.API.Controllers
{
    public class CreateOrderDto
    {
        public required string ShippingAddress { get; set; }
    }

    public class OrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public DateTime? ShippedDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly CartService _cartService;

        public OrdersController(ApplicationDbContext context, CartService cartService)
        {
            _context = context;
            _cartService = cartService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var userId = GetUserId();

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                ShippingAddress = o.ShippingAddress,
                ShippedDate = o.ShippedDate,
                DeliveredDate = o.DeliveredDate,
                Items = o.OrderItems.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList()
            }).ToList();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var userId = GetUserId();

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.Id == id && o.UserId == userId)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound();
            }

            return new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status.ToString(),
                ShippingAddress = order.ShippingAddress,
                ShippedDate = order.ShippedDate,
                DeliveredDate = order.DeliveredDate,
                Items = order.OrderItems.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList()
            };
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto createOrderDto)
        {
            var userId = GetUserId();

            // 获取用户的购物车
            var cartItems = await _cartService.GetCartAsync(userId);
            if (cartItems.Count == 0)
            {
                return BadRequest("购物车为空");
            }

            // 检查库存
            var productIds = cartItems.Keys.ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id, p => p);

            foreach (var item in cartItems)
            {
                if (!products.TryGetValue(item.Key, out var product))
                {
                    return BadRequest($"商品 ID {item.Key} 不存在");
                }

                if (product.Stock < item.Value)
                {
                    return BadRequest($"商品 '{product.Name}' 库存不足");
                }
            }

            // 创建订单
            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                ShippingAddress = createOrderDto.ShippingAddress
            };

            var orderItems = new List<OrderItem>();
            decimal totalAmount = 0;

            foreach (var item in cartItems)
            {
                var product = products[item.Key];

                var orderItem = new OrderItem
                {
                    Order = order,
                    ProductId = product.Id,
                    Price = product.Price,
                    Quantity = item.Value
                };

                orderItems.Add(orderItem);
                totalAmount += product.Price * item.Value;

                // 减少库存
                product.Stock -= item.Value;
            }

            order.TotalAmount = totalAmount;
            order.OrderItems = orderItems;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // 清空购物车
            await _cartService.ClearCartAsync(userId);

            // 返回创建的订单
            return await GetOrder(order.Id);
        }

        // PUT: api/Orders/5/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var userId = GetUserId();

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.Id == id && o.UserId == userId)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound();
            }

            if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.Processing)
            {
                return BadRequest("只能取消待处理或处理中的订单");
            }

            order.Status = OrderStatus.Cancelled;

            // 恢复库存
            foreach (var item in order.OrderItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.Stock += item.Quantity;
                }
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}