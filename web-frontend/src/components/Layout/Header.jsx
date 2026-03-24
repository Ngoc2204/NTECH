import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiEndpoints } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import './Header.css';

const Header = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const navigate = useNavigate();
    const location = useLocation();
    const { getTotalQuantity } = useCart();
    const [categories, setCategories] = useState([]);
    const [hoveredNav, setHoveredNav] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiEndpoints.getCategories();
                const categoriesData = Array.isArray(res.data)
                    ? res.data
                    : res.data?.$values || [];
                setCategories(categoriesData);
            } catch (error) {
                console.error('Lỗi tải categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const initials = (user?.fullName || 'U')
        .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { to: '/',         label: 'Trang chủ' },
        { to: '/products', label: 'Sản phẩm'  },
        { to: '/promotions', label: 'Khuyến mãi' },
        { to: '/contact',  label: 'Liên hệ'   },
    ];

    return (
        <header className="ntech-header">
            <div className="ntech-header-inner">
                {/* Brand + Nav */}
                <div className="ntech-header-left">
                    <Link to="/" className="ntech-brand">
                        <img
                            src="/favicon.png"
                            alt="N-TECH Logo"
                            className="ntech-brand-logo"
                        />
                        <span className="ntech-brand-name"><span>N</span>-TECH</span>
                    </Link>

                    <nav className="ntech-nav">
                        {navLinks.map(({ to, label }) => (
                            <div
                                key={to}
                                className="ntech-nav-item"
                                onMouseEnter={() => to === '/products' && setHoveredNav(to)}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <Link
                                    to={to}
                                    className={`ntech-nav-link${location.pathname === to ? ' active' : ''}`}
                                >
                                    {label}
                                    {to === '/products' && categories.length > 0 && (
                                        <span className="ntech-nav-arrow">▼</span>
                                    )}
                                </Link>

                                {hoveredNav === to && categories.length > 0 && (
                                    <div className="ntech-category-dropdown">
                                        <Link
                                            to="/products"
                                            className="ntech-dropdown-item"
                                            onClick={() => setHoveredNav(null)}
                                        >
                                            Tất cả sản phẩm
                                        </Link>
                                        {categories.map(cat => (
                                            <Link
                                                key={cat.id}
                                                to={`/products?category=${encodeURIComponent(cat.name)}`}
                                                onClick={() => setHoveredNav(null)}
                                                className="ntech-dropdown-item"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Search */}
                    <form className="ntech-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="ntech-search-input"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="ntech-search-btn">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Right */}
                <div className="ntech-header-right">
                    <button className="ntech-cart-btn" onClick={() => navigate('/cart')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        Giỏ hàng ({getTotalQuantity()})
                    </button>

                    {user ? (
                        <>
                            <div
                                className="ntech-user-badge ntech-user-badge--clickable"
                                onClick={() => navigate('/my-orders')}
                                title="Xem đơn hàng của tôi"
                            >
                                <div className="ntech-avatar">{initials}</div>
                                <span className="ntech-username">{user.fullName}</span>
                            </div>
                            {user.role === 'Admin' && (
                                <button className="ntech-admin-btn" onClick={() => navigate('/admin')}>
                                    Admin Panel
                                </button>
                            )}
                            <button className="ntech-logout-btn" onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="ntech-login-btn" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </button>
                            <button className="ntech-register-btn" onClick={() => navigate('/register')}>
                                Đăng ký
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;