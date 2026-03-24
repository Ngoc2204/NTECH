using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebBanDoCongNghe.Backend.Migrations
{
    /// <inheritdoc />
    public partial class Add30ProductsSeeder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "ImageUrl", "Name", "Price", "Specifications", "StockQuantity" },
                values: new object[] { new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3327), null, "MacBook Pro 16\" M3 Max", 59990000m, "M3 Max, 36GB RAM, 1TB SSD, 120Hz", 8 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Brand", "CategoryId", "CreatedDate", "ImageUrl", "Name", "Price", "Specifications", "StockQuantity" },
                values: new object[] { "Dell", 1, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3622), null, "Dell XPS 15 Plus", 45990000m, "Intel Core i9, RTX 4080, 32GB RAM, 1TB SSD", 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Brand", "CategoryId", "CreatedDate", "ImageUrl", "Name", "Price", "Specifications", "StockQuantity" },
                values: new object[] { "ASUS", 1, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3624), null, "ASUS ROG Zephyrus G16", 54990000m, "Intel i9, RTX 4090, 32GB RAM, 2TB SSD", 6 });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Brand", "CategoryId", "CreatedDate", "ImageUrl", "Name", "Price", "Specifications", "StockQuantity" },
                values: new object[,]
                {
                    { 4, "Lenovo", 1, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3625), null, "Lenovo ThinkPad X1 Carbon", 38990000m, "Intel i7, 16GB RAM, 512GB SSD, 14\" OLED", 15 },
                    { 5, "HP", 1, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3627), null, "HP Pavilion 15", 22990000m, "AMD Ryzen 7, RTX 4050, 16GB RAM, 512GB SSD", 20 },
                    { 6, "MSI", 1, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3639), null, "MSI GE66 Raider", 48990000m, "Intel i9, RTX 4080, 32GB RAM, 1TB SSD, 240Hz", 7 },
                    { 7, "Acer", 1, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3641), null, "Acer Swift 3", 24990000m, "AMD Ryzen 5, 16GB RAM, 512GB SSD, 13.3\" FHD", 18 },
                    { 8, "Razer", 1, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3642), null, "Razer Blade 16", 60990000m, "Intel i9, RTX 4090, 32GB RAM, 2TB SSD, 16\" 240Hz", 5 },
                    { 9, "LG", 1, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3644), null, "LG Gram 17Z90", 39990000m, "Intel Core Ultra, 32GB RAM, 1TB SSD, 2.59kg", 11 },
                    { 10, "Samsung", 1, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3646), null, "Samsung Galaxy Book3 Pro", 35990000m, "Intel i7, 16GB RAM, 512GB SSD, 14\" AMOLED", 14 },
                    { 11, "Apple", 2, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3666), null, "iPhone 15 Pro Max", 32990000m, "A17 Pro, 256GB, 6.7\", Titanium", 25 },
                    { 12, "Samsung", 2, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3668), null, "Samsung Galaxy S24 Ultra", 29990000m, "Snapdragon 8 Gen 3, 256GB, 6.8\", 200MP", 22 },
                    { 13, "Google", 2, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3670), null, "Google Pixel 8 Pro", 27990000m, "Tensor G3, 128GB, 6.7\", AI Magic Eraser", 18 },
                    { 14, "OnePlus", 2, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3672), null, "OnePlus 12", 20990000m, "Snapdragon 8 Gen 3, 256GB, 6.7\", 120Hz", 30 },
                    { 15, "Xiaomi", 2, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3673), null, "Xiaomi 14 Ultra", 18990000m, "Snapdragon 8 Gen 3, 512GB, 6.73\", Leica Camera", 35 },
                    { 16, "Oppo", 2, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3675), null, "Oppo Find X7", 19990000m, "Snapdragon 8 Gen 3, 256GB, 6.78\", 50MP", 28 },
                    { 17, "Vivo", 2, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3676), null, "Vivo X100 Pro", 17990000m, "Snapdragon 8 Gen 3, 512GB, 6.78\", Zeiss Camera", 32 },
                    { 18, "Honor", 2, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3680), null, "Honor 200 Pro", 15990000m, "Snapdragon 8 Gen 3, 256GB, 6.78\", 200MP", 40 },
                    { 19, "Nothing", 2, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3682), null, "Nothing Phone 2", 12990000m, "Snapdragon 8+ Gen 1, 256GB, 6.7\", Glyph", 45 },
                    { 20, "Motorola", 2, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3684), null, "Motorola Edge 50 Pro", 16990000m, "Snapdragon 8 Gen 3, 512GB, 6.7\", Hasselblad", 38 },
                    { 21, "Apple", 3, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3704), null, "Apple AirPods Pro Max", 13990000m, "Noise Cancellation, 20h Battery, Spatial Audio", 16 },
                    { 22, "Sony", 3, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3705), null, "Sony WH-1000XM5", 9990000m, "ANC, 30h Battery, Hi-Res Audio", 24 },
                    { 23, "Logitech", 3, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3707), null, "Logitech G502 HERO", 1990000m, "25600 DPI, RGB, Gaming Mouse", 60 },
                    { 24, "Corsair", 3, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3708), null, "Corsair K95 Platinum", 4990000m, "Mechanical, Cherry MX, RGB", 20 },
                    { 25, "Samsung", 3, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3711), null, "Samsung Buds3", 3990000m, "ANC, 360 Audio, 26h with case", 35 },
                    { 26, "JBL", 3, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3713), null, "JBL Flip 6", 2990000m, "Portable Speaker, 12h Battery, IP67", 42 },
                    { 27, "Razer", 3, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3714), null, "Razer DeathAdder V3", 2490000m, "30000 DPI, Wireless, Gaming Mouse", 50 },
                    { 28, "SteelSeries", 3, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3716), null, "SteelSeries Arctis Pro", 5990000m, "Hi-Fi Audio, Wireless, Gaming Headset", 18 },
                    { 29, "Anker", 3, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3718), null, "Anker PowerBank 737", 1990000m, "140W, 41600mAh, Fast Charging", 80 },
                    { 30, "Belkin", 3, new DateTime(2026, 3, 23, 16, 15, 27, 648, DateTimeKind.Local).AddTicks(3720), null, "Belkin Magnetic Wireless Charger", 1290000m, "15W MagSafe, Fast Charging, Foldable", 55 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "ImageUrl", "Name", "Price", "Specifications", "StockQuantity" },
                values: new object[] { new DateTime(2026, 3, 15, 13, 30, 14, 859, DateTimeKind.Local).AddTicks(1300), "macbook.jpg", "MacBook Pro M3", 45000000m, "Chip M3, RAM 16GB, SSD 512GB", 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Brand", "CategoryId", "CreatedDate", "ImageUrl", "Name", "Price", "Specifications", "StockQuantity" },
                values: new object[] { "Apple", 2, new DateTime(2026, 3, 15, 13, 30, 14, 860, DateTimeKind.Local).AddTicks(2144), "iphone15.jpg", "iPhone 15 Pro Max", 32000000m, "Titanium, Chip A17 Pro", 20 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Brand", "CategoryId", "CreatedDate", "ImageUrl", "Name", "Price", "Specifications", "StockQuantity" },
                values: new object[] { "Logitech", 3, new DateTime(2026, 3, 15, 13, 30, 14, 860, DateTimeKind.Local).AddTicks(2157), "g502.jpg", "Logitech G502", 1500000m, "25k DPI, RGB", 50 });
        }
    }
}
