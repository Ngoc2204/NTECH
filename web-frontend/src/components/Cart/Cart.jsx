import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalQuantity } = useCart();

    const handleQuantityChange = (productId, newQuantity) => {
        const qty = parseInt(newQuantity, 10);
        if (qty > 0) {
            updateQuantity(productId, qty);
        }
    };

    const handleCheckout = () => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="cart-empty-page">
                <div className="cart-empty-container">
                    <div className="cart-empty-icon">🛒</div>
                    <h2>Giỏ hàng của bạn trống</h2>
                    <p>Hãy bắt đầu mua sắm để thêm sản phẩm vào giỏ hàng</p>
                    <Link to="/" className="cart-continue-btn">
                        ← Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                {/* Nút quay lại */}
                <button 
                    className="cart-back-btn"
                    onClick={() => navigate('/')}
                >
                    ← Quay lại
                </button>

                <div className="cart-header">
                    <h1>🛒 Giỏ hàng của bạn</h1>
                    <p className="cart-count">Có {getTotalQuantity()} sản phẩm</p>
                </div>

                <div className="cart-content">
                    {/* Bảng sản phẩm */}
                    <div className="cart-table-wrapper">
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th className="col-image">Ảnh</th>
                                    <th className="col-name">Sản phẩm</th>
                                    <th className="col-price">Giá</th>
                                    <th className="col-qty">Số lượng</th>
                                    <th className="col-total">Tổng cộng</th>
                                    <th className="col-action">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id} className="cart-item-row">
                                        <td className="col-image">
                                            <div className="cart-item-image">
                                                <img 
                                                    src={item.imageUrl
                                                        ? (item.imageUrl.startsWith('http') 
                                                            ? item.imageUrl 
                                                            : `http://localhost:5263${item.imageUrl}`)
                                                        : `https://placehold.co/80x80/0d1829/1e78ff?text=${encodeURIComponent(item.name)}`}
                                                    alt={item.name}
                                                />
                                            </div>
                                        </td>
                                        <td className="col-name">
                                            <Link 
                                                to={`/product/${item.id}`}
                                                className="cart-product-name-link"
                                            >
                                                <div className="cart-product-name">{item.name}</div>
                                                <div className="cart-product-category">{item.brand || 'Công nghệ'}</div>
                                            </Link>
                                        </td>
                                        <td className="col-price">
                                            <div className="cart-price">
                                                {(item.price || 0).toLocaleString('vi-VN')} VNĐ
                                            </div>
                                        </td>
                                        <td className="col-qty">
                                            <div className="cart-qty-control">
                                                <button 
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    −
                                                </button>
                                                <input 
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                    min="1"
                                                    className="qty-input"
                                                />
                                                <button 
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="col-total">
                                            <div className="cart-item-total">
                                                {((item.price || 0) * item.quantity).toLocaleString('vi-VN')} VNĐ
                                            </div>
                                        </td>
                                        <td className="col-action">
                                            <button 
                                                className="cart-remove-btn"
                                                onClick={() => removeItem(item.id)}
                                                title="Xóa khỏi giỏ"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Sidebar tóm tắt */}
                    <div className="cart-summary">
                        <div className="summary-card">
                            <h3>Tóm tắt đơn hàng</h3>
                            
                            <div className="summary-row">
                                <span>Tổng sản phẩm:</span>
                                <span className="summary-value">{getTotalQuantity()} cái</span>
                            </div>
                            
                            <div className="summary-row">
                                <span>Tổng tiền:</span>
                                <span className="summary-value">
                                    {getTotalPrice().toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>

                            <div className="summary-divider" />

                            <div className="summary-row summary-total">
                                <span>Tổng cộng:</span>
                                <span className="summary-total-value">
                                    {getTotalPrice().toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>

                            <button 
                                className="checkout-btn"
                                onClick={handleCheckout}
                            >
                                💳 Thanh toán ngay
                            </button>

                            <button 
                                className="clear-cart-btn"
                                onClick={clearCart}
                            >
                                🗑️ Xóa toàn bộ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
