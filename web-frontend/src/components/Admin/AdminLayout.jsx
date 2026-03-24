import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if user is admin
    if (user.role !== 'Admin') {
        return (
            <div className="admin-access-denied">
                <h1>Quyền truy cập bị từ chối</h1>
                <p>Bạn không có quyền truy cập trang Admin</p>
                <Link to="/">Quay lại trang chủ</Link>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { to: '/admin', label: 'Dashboard', icon: '📊' },
        { to: '/admin/products', label: 'Sản phẩm', icon: '📦' },
        { to: '/admin/categories', label: 'Danh mục', icon: '📂' },
        { to: '/admin/orders', label: 'Đơn hàng', icon: '🛒' },
        { to: '/admin/users', label: 'Người dùng', icon: '👥' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="admin-sidebar-header">
                    <h2>N-TECH Admin</h2>
                    
                </div>

                <nav className="admin-menu">
                    {menuItems.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`admin-menu-item ${location.pathname === item.to ? 'active' : ''}`}
                            title={item.label}
                        >
                            <span className="icon">{item.icon}</span>
                            {!collapsed && <span className="label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="avatar">{user.fullName?.charAt(0) || 'A'}</div>
                        {!collapsed && <div className="name">{user.fullName}</div>}
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        {collapsed ? '🚪' : 'Đăng xuất'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
