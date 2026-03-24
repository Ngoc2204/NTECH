using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebBanDoCongNghe.Data;
using WebBanDoCongNghe.DTOs;
using WebBanDoCongNghe.Models;

namespace WebBanDoCongNghe.Backend.Controllers
{
    [Route("api/admin/categories")]
    [ApiController]
    public class AdminCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/admin/categories
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory([FromBody] CreateCategoryRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if category name already exists
            if (await _context.Categories.AnyAsync(c => c.Name == request.Name))
            {
                return BadRequest(new { message = "Danh mục này đã tồn tại!" });
            }

            var category = new Category
            {
                Name = request.Name,
                Description = request.Description
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { controller = "Categories", id = category.Id }, category);
        }

        // PUT: api/admin/categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryRequest request)
        {
            if (id != request.Id)
            {
                return BadRequest(new { message = "ID không khớp!" });
            }

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Danh mục không tồn tại!" });
            }

            // Check if new name already exists (excluding current category)
            if (request.Name != category.Name && 
                await _context.Categories.AnyAsync(c => c.Name == request.Name))
            {
                return BadRequest(new { message = "Danh mục này đã tồn tại!" });
            }

            category.Name = request.Name;
            category.Description = request.Description;

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound(new { message = "Danh mục không tồn tại!" });
                }
                throw;
            }

            return Ok(new { message = "Cập nhật danh mục thành công!", category });
        }

        // DELETE: api/admin/categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Danh mục không tồn tại!" });
            }

            // Check if category has products
            if (category.Products.Count > 0)
            {
                return BadRequest(new { message = "Không thể xóa danh mục có sản phẩm! Vui lòng xóa sản phẩm trước." });
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa danh mục thành công!" });
        }

        // GET: api/admin/categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories()
        {
            return await _context.Categories.Include(c => c.Products).ToListAsync();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
