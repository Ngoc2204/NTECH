using Microsoft.EntityFrameworkCore;
using WebBanDoCongNghe.Models;

namespace WebBanDoCongNghe.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Khai báo các bảng
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Seed Categories (Danh mục)
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Laptop", Description = "Laptop Gaming & Văn phòng" },
                new Category { Id = 2, Name = "SmartPhone", Description = "Điện thoại thông minh" },
                new Category { Id = 3, Name = "Phụ kiện", Description = "Chuột, Bàn phím, Tai nghe" }
            );

            // 2. Seed Products (30 sản phẩm)
            var products = new List<Product>
            {
                // =========================== LAPTOPS (10) ===========================
                new Product { Id = 1, Name = "MacBook Pro 16\" M3 Max", Brand = "Apple", Price = 59990000m, StockQuantity = 8, CategoryId = 1, Specifications = "M3 Max, 36GB RAM, 1TB SSD, 120Hz", CreatedDate = DateTime.Now },
                new Product { Id = 2, Name = "Dell XPS 15 Plus", Brand = "Dell", Price = 45990000m, StockQuantity = 12, CategoryId = 1, Specifications = "Intel Core i9, RTX 4080, 32GB RAM, 1TB SSD", CreatedDate = DateTime.Now },
                new Product { Id = 3, Name = "ASUS ROG Zephyrus G16", Brand = "ASUS", Price = 54990000m, StockQuantity = 6, CategoryId = 1, Specifications = "Intel i9, RTX 4090, 32GB RAM, 2TB SSD", CreatedDate = DateTime.Now },
                new Product { Id = 4, Name = "Lenovo ThinkPad X1 Carbon", Brand = "Lenovo", Price = 38990000m, StockQuantity = 15, CategoryId = 1, Specifications = "Intel i7, 16GB RAM, 512GB SSD, 14\" OLED", CreatedDate = DateTime.Now },
                new Product { Id = 5, Name = "HP Pavilion 15", Brand = "HP", Price = 22990000m, StockQuantity = 20, CategoryId = 1, Specifications = "AMD Ryzen 7, RTX 4050, 16GB RAM, 512GB SSD", CreatedDate = DateTime.Now },
                new Product { Id = 6, Name = "MSI GE66 Raider", Brand = "MSI", Price = 48990000m, StockQuantity = 7, CategoryId = 1, Specifications = "Intel i9, RTX 4080, 32GB RAM, 1TB SSD, 240Hz", CreatedDate = DateTime.Now },
                new Product { Id = 7, Name = "Acer Swift 3", Brand = "Acer", Price = 24990000m, StockQuantity = 18, CategoryId = 1, Specifications = "AMD Ryzen 5, 16GB RAM, 512GB SSD, 13.3\" FHD", CreatedDate = DateTime.Now },
                new Product { Id = 8, Name = "Razer Blade 16", Brand = "Razer", Price = 60990000m, StockQuantity = 5, CategoryId = 1, Specifications = "Intel i9, RTX 4090, 32GB RAM, 2TB SSD, 16\" 240Hz", CreatedDate = DateTime.Now },
                new Product { Id = 9, Name = "LG Gram 17Z90", Brand = "LG", Price = 39990000m, StockQuantity = 11, CategoryId = 1, Specifications = "Intel Core Ultra, 32GB RAM, 1TB SSD, 2.59kg", CreatedDate = DateTime.Now },
                new Product { Id = 10, Name = "Samsung Galaxy Book3 Pro", Brand = "Samsung", Price = 35990000m, StockQuantity = 14, CategoryId = 1, Specifications = "Intel i7, 16GB RAM, 512GB SSD, 14\" AMOLED", CreatedDate = DateTime.Now },

                // =========================== SMARTPHONES (10) ===========================
                new Product { Id = 11, Name = "iPhone 15 Pro Max", Brand = "Apple", Price = 32990000m, StockQuantity = 25, CategoryId = 2, Specifications = "A17 Pro, 256GB, 6.7\", Titanium", CreatedDate = DateTime.Now },
                new Product { Id = 12, Name = "Samsung Galaxy S24 Ultra", Brand = "Samsung", Price = 29990000m, StockQuantity = 22, CategoryId = 2, Specifications = "Snapdragon 8 Gen 3, 256GB, 6.8\", 200MP", CreatedDate = DateTime.Now },
                new Product { Id = 13, Name = "Google Pixel 8 Pro", Brand = "Google", Price = 27990000m, StockQuantity = 18, CategoryId = 2, Specifications = "Tensor G3, 128GB, 6.7\", AI Magic Eraser", CreatedDate = DateTime.Now },
                new Product { Id = 14, Name = "OnePlus 12", Brand = "OnePlus", Price = 20990000m, StockQuantity = 30, CategoryId = 2, Specifications = "Snapdragon 8 Gen 3, 256GB, 6.7\", 120Hz", CreatedDate = DateTime.Now },
                new Product { Id = 15, Name = "Xiaomi 14 Ultra", Brand = "Xiaomi", Price = 18990000m, StockQuantity = 35, CategoryId = 2, Specifications = "Snapdragon 8 Gen 3, 512GB, 6.73\", Leica Camera", CreatedDate = DateTime.Now },
                new Product { Id = 16, Name = "Oppo Find X7", Brand = "Oppo", Price = 19990000m, StockQuantity = 28, CategoryId = 2, Specifications = "Snapdragon 8 Gen 3, 256GB, 6.78\", 50MP", CreatedDate = DateTime.Now },
                new Product { Id = 17, Name = "Vivo X100 Pro", Brand = "Vivo", Price = 17990000m, StockQuantity = 32, CategoryId = 2, Specifications = "Snapdragon 8 Gen 3, 512GB, 6.78\", Zeiss Camera", CreatedDate = DateTime.Now },
                new Product { Id = 18, Name = "Honor 200 Pro", Brand = "Honor", Price = 15990000m, StockQuantity = 40, CategoryId = 2, Specifications = "Snapdragon 8 Gen 3, 256GB, 6.78\", 200MP", CreatedDate = DateTime.Now },
                new Product { Id = 19, Name = "Nothing Phone 2", Brand = "Nothing", Price = 12990000m, StockQuantity = 45, CategoryId = 2, Specifications = "Snapdragon 8+ Gen 1, 256GB, 6.7\", Glyph", CreatedDate = DateTime.Now },
                new Product { Id = 20, Name = "Motorola Edge 50 Pro", Brand = "Motorola", Price = 16990000m, StockQuantity = 38, CategoryId = 2, Specifications = "Snapdragon 8 Gen 3, 512GB, 6.7\", Hasselblad", CreatedDate = DateTime.Now },

                // =========================== ACCESSORIES (10) ===========================
                new Product { Id = 21, Name = "Apple AirPods Pro Max", Brand = "Apple", Price = 13990000m, StockQuantity = 16, CategoryId = 3, Specifications = "Noise Cancellation, 20h Battery, Spatial Audio", CreatedDate = DateTime.Now },
                new Product { Id = 22, Name = "Sony WH-1000XM5", Brand = "Sony", Price = 9990000m, StockQuantity = 24, CategoryId = 3, Specifications = "ANC, 30h Battery, Hi-Res Audio", CreatedDate = DateTime.Now },
                new Product { Id = 23, Name = "Logitech G502 HERO", Brand = "Logitech", Price = 1990000m, StockQuantity = 60, CategoryId = 3, Specifications = "25600 DPI, RGB, Gaming Mouse", CreatedDate = DateTime.Now },
                new Product { Id = 24, Name = "Corsair K95 Platinum", Brand = "Corsair", Price = 4990000m, StockQuantity = 20, CategoryId = 3, Specifications = "Mechanical, Cherry MX, RGB", CreatedDate = DateTime.Now },
                new Product { Id = 25, Name = "Samsung Buds3", Brand = "Samsung", Price = 3990000m, StockQuantity = 35, CategoryId = 3, Specifications = "ANC, 360 Audio, 26h with case", CreatedDate = DateTime.Now },
                new Product { Id = 26, Name = "JBL Flip 6", Brand = "JBL", Price = 2990000m, StockQuantity = 42, CategoryId = 3, Specifications = "Portable Speaker, 12h Battery, IP67", CreatedDate = DateTime.Now },
                new Product { Id = 27, Name = "Razer DeathAdder V3", Brand = "Razer", Price = 2490000m, StockQuantity = 50, CategoryId = 3, Specifications = "30000 DPI, Wireless, Gaming Mouse", CreatedDate = DateTime.Now },
                new Product { Id = 28, Name = "SteelSeries Arctis Pro", Brand = "SteelSeries", Price = 5990000m, StockQuantity = 18, CategoryId = 3, Specifications = "Hi-Fi Audio, Wireless, Gaming Headset", CreatedDate = DateTime.Now },
                new Product { Id = 29, Name = "Anker PowerBank 737", Brand = "Anker", Price = 1990000m, StockQuantity = 80, CategoryId = 3, Specifications = "140W, 41600mAh, Fast Charging", CreatedDate = DateTime.Now },
                new Product { Id = 30, Name = "Belkin Magnetic Wireless Charger", Brand = "Belkin", Price = 1290000m, StockQuantity = 55, CategoryId = 3, Specifications = "15W MagSafe, Fast Charging, Foldable", CreatedDate = DateTime.Now }
            };

            modelBuilder.Entity<Product>().HasData(products);
        }
    }
}