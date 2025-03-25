using System.ComponentModel.DataAnnotations.Schema;

namespace MyEcommerce.API.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // Navigation properties
        public virtual Order Order { get; set; } = null!;

        public virtual Product Product { get; set; } = null!;
    }
}