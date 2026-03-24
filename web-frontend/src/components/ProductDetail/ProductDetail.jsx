import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiEndpoints } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await apiEndpoints.getProductById(id);
                setProduct(response.data);
            } catch (err) {
                setError('Lỗi tải sản phẩm: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        
        // Thêm vào giỏ
        addItem(product, quantity);
        
        // Hiển thị feedback
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleGoToCart = () => {
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="ntech-spinner" />
                <span>Đang tải chi tiết sản phẩm...</span>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-error">
                <h2>{error || 'Không tìm thấy sản phẩm'}</h2>
                <button 
                    className="product-detail-back-btn"
                    onClick={() => navigate('/')}
                >
                    ← Quay lại trang chủ
                </button>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <button 
                className="product-detail-back-btn"
                onClick={() => navigate('/')}
            >
                ← Quay lại
            </button>

            <div className="product-detail-container">
                {/* Image Section */}
                <div className="product-detail-image-section">
                    <div className="product-detail-image">
                        <img 
                            src={product.imageUrl 
                                ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5263${product.imageUrl}`)
                                : `https://placehold.co/500x500/0d1829/1e78ff?text=${encodeURIComponent(product.name)}`}
                            alt={product.name}
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div className="product-detail-info-section">
                    <div className="product-detail-category">
                        {typeof product.category === 'string'
                            ? product.category
                            : product.category?.name || 'Công nghệ'}
                    </div>

                    <h1 className="product-detail-name">{product.name}</h1>

                    <div className="product-detail-brand">
                        <span className="detail-label">Nhãn hiệu:</span>
                        <span className="detail-value">{product.brand || 'N/A'}</span>
                    </div>

                    <div className="product-detail-price">
                        {(product.price || 0).toLocaleString('vi-VN')} VNĐ
                    </div>

                    <div className="product-detail-stock">
                        <span className={product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}>
                            {product.stockQuantity > 0 
                                ? `Còn ${product.stockQuantity} sản phẩm`
                                : 'Hết hàng'
                            }
                        </span>
                    </div>

                    <div className="product-detail-specs">
                        <h3>Thông số kỹ thuật:</h3>
                        <p>{product.specifications || 'Không có thông tin'}</p>
                    </div>

                    {/* Quantity & Add to Cart */}
                    {product.stockQuantity > 0 && (
                        <div className="product-detail-actions">
                            <div className="quantity-selector">
                                <label>Số lượng:</label>
                                <div className="quantity-input">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="qty-btn"
                                    >
                                        −
                                    </button>
                                    <input 
                                        type="number" 
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                        min="1"
                                        max={product.stockQuantity}
                                    />
                                    <button 
                                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                                        className="qty-btn"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button 
                                className="product-detail-add-cart-btn"
                                onClick={handleAddToCart}
                                disabled={product.stockQuantity <= 0}
                            >
                                🛒 Thêm vào giỏ hàng
                            </button>

                            {addedToCart && (
                                <div className="product-detail-success-message">
                                    ✓ Đã thêm {quantity} sản phẩm vào giỏ hàng!
                                    <button 
                                        className="view-cart-link"
                                        onClick={handleGoToCart}
                                    >
                                        Xem giỏ hàng →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="product-detail-meta">
                        <div className="meta-item">
                            <span className="meta-label">Mã sản phẩm:</span>
                            <span className="meta-value">#{product.id}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Ngày đăng:</span>
                            <span className="meta-value">
                                {new Date(product.createdDate).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
