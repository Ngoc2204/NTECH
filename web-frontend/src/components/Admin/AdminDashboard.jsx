import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../../services/api';
import AdminLayout from './AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
                apiEndpoints.admin.getProducts(),
                apiEndpoints.admin.getCategories(),
                apiEndpoints.admin.getOrders(),
                apiEndpoints.admin.getUsers()
            ]);

            const productsData = Array.isArray(productsRes.data) 
                ? productsRes.data 
                : productsRes.data?.$values || [];
            const categoriesData = Array.isArray(categoriesRes.data) 
                ? categoriesRes.data 
                : categoriesRes.data?.$values || [];
            const ordersData = Array.isArray(ordersRes.data) 
                ? ordersRes.data 
                : ordersRes.data?.$values || [];
            const usersData = Array.isArray(usersRes.data) 
                ? usersRes.data 
                : usersRes.data?.$values || [];

            setStats({
                totalProducts: productsData.length,
                totalCategories: categoriesData.length,
                totalOrders: ordersData.length,
                totalUsers: usersData.length
            });
        } catch (error) {
            console.error('Lỗi tải thống kê:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="stat-card" style={{ borderLeftColor: color }}>
            <div className="stat-icon" style={{ backgroundColor: color + '22' }}>
                {icon}
            </div>
            <div className="stat-content">
                <div className="stat-title">{title}</div>
                <div className="stat-value">{value}</div>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p className="subtitle">Chào mừng đến trang quản trị Admin</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Đang tải...</div>
                ) : (
                    <div className="stats-grid">
                        <StatCard
                            title="Sản phẩm"
                            value={stats.totalProducts}
                            icon="📦"
                            color="#1e78ff"
                        />
                        <StatCard
                            title="Danh mục"
                            value={stats.totalCategories}
                            icon="📂"
                            color="#4caf50"
                        />
                        <StatCard
                            title="Đơn hàng"
                            value={stats.totalOrders}
                            icon="🛒"
                            color="#ff9800"
                        />
                        <StatCard
                            title="Người dùng"
                            value={stats.totalUsers}
                            icon="👥"
                            color="#9c27b0"
                        />
                    </div>
                )}

                <div className="dashboard-info">
                    <h2>Thông tin nhanh</h2>
                    <div className="info-card">
                        <h3>Bắt đầu quản lý</h3>
                        <ul>
                            <li>📦 <a href="/admin/products">Quản lý sản phẩm</a></li>
                            <li>📂 <a href="/admin/categories">Quản lý danh mục</a></li>
                            <li>🛒 <a href="/admin/orders">Quản lý đơn hàng</a></li>
                            <li>👥 <a href="/admin/users">Quản lý người dùng</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
