using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebBanDoCongNghe.Data;
using WebBanDoCongNghe.Models;

namespace WebBanDoCongNghe.Backend.Controllers
{
    // ── DTO ──────────────────────────────────────────────────
    public class CreateOrderDto
    {
        public int UserId { get; set; }                          // required: user's ID
        public string CustomerName    { get; set; } = "";
        public string CustomerPhone   { get; set; } = "";
        public string CustomerEmail   { get; set; } = "";
        public string ShippingAddress { get; set; } = "";
        public string Note            { get; set; } = "";
        public string PaymentMethod   { get; set; } = "COD";
        public decimal TotalAmount    { get; set; }
        public List<OrderDetailDto> OrderDetails { get; set; } = new();
    }

    public class OrderDetailDto
    {
        public int ProductId { get; set; }
        public int Quantity  { get; set; }
        public decimal Price { get; set; }   // mapped → UnitPrice
    }
    // ─────────────────────────────────────────────────────────

    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders.ToListAsync();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return order;
        }

        // GET: api/Orders/user/5 — orders by userId
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByUser(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders);
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order order)
        {
            if (id != order.Id)
                return BadRequest();

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/Orders  ← accepts DTO, not raw Order
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder([FromBody] CreateOrderDto dto)
        {
            // Validate UserId exists
            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            if (!userExists)
                return BadRequest(new { message = $"UserId {dto.UserId} không tồn tại." });

            var order = new Order
            {
                UserId          = dto.UserId,
                ShippingAddress = dto.ShippingAddress,
                TotalAmount     = dto.TotalAmount,
                Status          = "Pending",
                OrderDate       = DateTime.Now,
                OrderDetails    = dto.OrderDetails.Select(d => new OrderDetail
                {
                    ProductId  = d.ProductId,
                    Quantity   = d.Quantity,
                    UnitPrice  = d.Price,
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.Id }, order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
