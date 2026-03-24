# 🛒 N-TECH — Cửa hàng Đồ Công Nghệ

Ứng dụng web thương mại điện tử bán đồ công nghệ, xây dựng với **React** (frontend) + **ASP.NET Core** (backend) + **SQL Server** (database).

## ✨ Tính năng

### Người dùng
- 🔍 **Tìm kiếm** sản phẩm với autocomplete gợi ý
- 🗂️ **Lọc sản phẩm** theo danh mục, khoảng giá, hãng sản xuất
- 🛒 **Giỏ hàng** — thêm/xóa/cập nhật số lượng, lưu localStorage
- 💳 **Thanh toán** 3 bước: thông tin giao hàng → phương thức → xác nhận
- 📦 **Đơn hàng của tôi** — xem lịch sử, trạng thái tracking, chi tiết sản phẩm
- 👤 Đăng ký / Đăng nhập tài khoản

### Admin
- 📊 Dashboard tổng quan
- 🛍️ Quản lý sản phẩm (CRUD)
- 📂 Quản lý danh mục
- 📋 Quản lý đơn hàng — tìm kiếm, lọc trạng thái, cập nhật, xem chi tiết
- 👥 Quản lý người dùng

---

## 🛠️ Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | ASP.NET Core 8, Entity Framework Core |
| Database | SQL Server |
| Styling | Vanilla CSS, Google Fonts |

---

## 🚀 Hướng dẫn chạy

### Yêu cầu
- Node.js ≥ 18
- .NET SDK 8
- SQL Server

### Backend

```bash
cd WebBanDoCongNghe.Backend
# Cập nhật connection string trong appsettings.json
dotnet ef database update
dotnet run
```

API chạy tại: `http://localhost:5263`

### Frontend

```bash
cd web-frontend
npm install
npm run dev
```

App chạy tại: `http://localhost:5173`

---

## 📁 Cấu trúc thư mục

```
NTECH/
├── WebBanDoCongNghe.Backend/   # ASP.NET Core API
│   ├── Controllers/            # API Controllers
│   ├── Models/                 # Entity models
│   └── Data/                   # DbContext
└── web-frontend/               # React App
    └── src/
        ├── components/         # UI Components
        ├── contexts/           # CartContext
        └── services/           # API calls
