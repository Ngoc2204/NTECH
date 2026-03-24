using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebBanDoCongNghe.Backend.Migrations
{
    /// <inheritdoc />
    public partial class FinalVersion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Laptop Gaming & Văn phòng", "Laptop" },
                    { 2, "Điện thoại thông minh", "SmartPhone" },
                    { 3, "Chuột, Bàn phím, Tai nghe", "Phụ kiện" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Brand", "CategoryId", "CreatedDate", "ImageUrl", "Name", "Price", "Specifications", "StockQuantity" },
                values: new object[,]
                {
                    { 1, "Apple", 1, new DateTime(2026, 3, 15, 13, 30, 14, 859, DateTimeKind.Local).AddTicks(1300), "macbook.jpg", "MacBook Pro M3", 45000000m, "Chip M3, RAM 16GB, SSD 512GB", 10 },
                    { 2, "Apple", 2, new DateTime(2026, 3, 15, 13, 30, 14, 860, DateTimeKind.Local).AddTicks(2144), "iphone15.jpg", "iPhone 15 Pro Max", 32000000m, "Titanium, Chip A17 Pro", 20 },
                    { 3, "Logitech", 3, new DateTime(2026, 3, 15, 13, 30, 14, 860, DateTimeKind.Local).AddTicks(2157), "g502.jpg", "Logitech G502", 1500000m, "25k DPI, RGB", 50 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
