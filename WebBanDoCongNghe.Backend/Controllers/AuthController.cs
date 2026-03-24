using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebBanDoCongNghe.Data;
using WebBanDoCongNghe.Models;
using WebBanDoCongNghe.DTOs;

namespace WebBanDoCongNghe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1. Tìm user trong Database theo Username
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            // 2. Kiểm tra user có tồn tại và mật khẩu có khớp không
            // Lưu ý: Trong thực tế nên dùng BCrypt để Hash mật khẩu, ở đây ta so sánh chuỗi đơn giản trước
            if (user == null || user.PasswordHash != request.Password)
            {
                return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu!" });
            }

            // 3. Đăng nhập thành công, trả về thông tin user (không trả về Password)
            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                fullName = user.FullName,
                role = user.Role
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // 1. Kiểm tra xem username đã tồn tại chưa
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { message = "Tên tài khoản đã tồn tại!" });
            }

            // 2. Tạo đối tượng User mới
            var user = new User
            {
                Username = request.Username,
                PasswordHash = request.Password, // Lưu ý: Thực tế cần Hash mật khẩu
                FullName = request.FullName,
                Email = request.Email,
                Role = "Customer" // Mặc định là khách hàng
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }
    }
}