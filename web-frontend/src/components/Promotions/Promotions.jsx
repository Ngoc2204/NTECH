import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Promotions.css';

const Promotions = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('flash'); // flash, seasonal, coupon
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Update countdown timer every second
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTimeLeft = { ...prev };
        Object.keys(newTimeLeft).forEach(key => {
          newTimeLeft[key]--;
          if (newTimeLeft[key] < 0) {
            newTimeLeft[key] = 0;
          }
        });
        return newTimeLeft;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5263/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        // Initialize countdown timers (8 hours for flash sale)
        const timers = {};
        data.forEach((p, idx) => {
          timers[p.id] = 8 * 3600; // 8 hours in seconds
        });
        setTimeLeft(timers);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Flash sale products (30% discount)
  const flashSaleProducts = products.slice(0, 6);

  // Seasonal sale products (20% discount)
  const seasonalSaleProducts = products.slice(6, 12);

  // Promotional coupons
  const coupons = [
    { code: 'WELCOME20', discount: 20, description: 'Giảm 20% cho khách hàng mới', minOrder: 'Không giới hạn' },
    { code: 'SUMMER30', discount: 30, description: 'Giảm 30% cho đơn hàng trên 5 triệu', minOrder: '5.000.000 VNĐ' },
    { code: 'VIP50', discount: 50, description: 'Giảm 50% cho khách hàng VIP', minOrder: '10.000.000 VNĐ' },
    { code: 'TECH15', discount: 15, description: 'Giảm 15% cho các sản phẩm công nghệ', minOrder: '2.000.000 VNĐ' },
  ];

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}`);
  };

  if (loading) {
    return (
      <div className="promotions-page">
        <div className="promotions-loading">
          <div className="ntech-spinner"></div>
          <p>Đang tải khuyến mãi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="promotions-page">
      {/* Hero Section */}
      <div className="promotions-hero">
        <button className="promotions-back-btn" onClick={() => navigate('/')}>
          ← Quay lại
        </button>
        <div className="hero-content">
          <h1>🎉 KHUYẾN MÃI HẤP DẪN</h1>
          <p>Khám phá các ưu đãi độc quyền và tiết kiệm tối đa</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="promotions-tabs">
        <button
          className={`tab-btn ${activeTab === 'flash' ? 'active' : ''}`}
          onClick={() => setActiveTab('flash')}
        >
          ⚡ Flash Sale
        </button>
        <button
          className={`tab-btn ${activeTab === 'seasonal' ? 'active' : ''}`}
          onClick={() => setActiveTab('seasonal')}
        >
          🌞 Khuyến Mãi Mùa
        </button>
        <button
          className={`tab-btn ${activeTab === 'coupon' ? 'active' : ''}`}
          onClick={() => setActiveTab('coupon')}
        >
          🎟️ Mã Giảm Giá
        </button>
      </div>

      {/* Content Sections */}
      <div className="promotions-container">
        {/* Flash Sale Section */}
        {activeTab === 'flash' && (
          <div className="promotion-section active">
            <div className="section-header">
              <h2>⚡ FLASH SALE - Giảm Tới 30%</h2>
              <p className="section-subtitle">Chỉ khách hàng may mắn mới có các giá này!</p>
            </div>

            <div className="timer-banner">
              <span className="timer-label">Kết thúc trong:</span>
              <span className="timer-value">
                {timeLeft[flashSaleProducts[0]?.id] !== undefined
                  ? formatTime(timeLeft[flashSaleProducts[0]?.id])
                  : '8h 0m 0s'}
              </span>
            </div>

            <div className="products-grid">
              {flashSaleProducts.map((product) => (
                <div key={product.id} className="promo-product-card">
                  <div className="product-image-wrapper">
                    <img
                      src={
                        product.imageUrl?.startsWith('http')
                          ? product.imageUrl
                          : `http://localhost:5263${product.imageUrl}`
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/280x280?text=${encodeURIComponent(
                          product.name
                        )}`;
                      }}
                    />
                    <div className="discount-badge">-30%</div>
                  </div>

                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="price-section">
                      <span className="old-price">
                        {(product.price).toLocaleString('vi-VN')} VNĐ
                      </span>
                      <span className="new-price">
                        {Math.round(product.price * 0.7).toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>

                    <div className="save-badge">
                      Tiết kiệm:{' '}
                      {Math.round(product.price * 0.3).toLocaleString('vi-VN')} VNĐ
                    </div>

                    <Link
                      to={`/product/${product.id}`}
                      className="product-view-btn"
                    >
                      Xem Chi Tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Sale Section */}
        {activeTab === 'seasonal' && (
          <div className="promotion-section active">
            <div className="section-header">
              <h2>🌞 KHUYẾN MÃI MÙA - Giảm Tới 20%</h2>
              <p className="section-subtitle">Ưu đãi đặc biệt cho mô hình hè</p>
            </div>

            <div className="info-banner">
              <span>Áp dụng cho tất cả khách hàng</span>
            </div>

            <div className="products-grid">
              {seasonalSaleProducts.map((product) => (
                <div key={product.id} className="promo-product-card seasonal">
                  <div className="product-image-wrapper">
                    <img
                      src={
                        product.imageUrl?.startsWith('http')
                          ? product.imageUrl
                          : `http://localhost:5263${product.imageUrl}`
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/280x280?text=${encodeURIComponent(
                          product.name
                        )}`;
                      }}
                    />
                    <div className="discount-badge seasonal">-20%</div>
                  </div>

                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="price-section">
                      <span className="old-price">
                        {(product.price).toLocaleString('vi-VN')} VNĐ
                      </span>
                      <span className="new-price">
                        {Math.round(product.price * 0.8).toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>

                    <div className="save-badge seasonal">
                      Tiết kiệm:{' '}
                      {Math.round(product.price * 0.2).toLocaleString('vi-VN')} VNĐ
                    </div>

                    <Link
                      to={`/product/${product.id}`}
                      className="product-view-btn seasonal"
                    >
                      Xem Chi Tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coupon Section */}
        {activeTab === 'coupon' && (
          <div className="promotion-section active">
            <div className="section-header">
              <h2>🎟️ MÃ GIẢM GIÁ ĐẶC BIỆT</h2>
              <p className="section-subtitle">
                Sao chép mã và áp dụng khi thanh toán
              </p>
            </div>

            <div className="coupons-grid">
              {coupons.map((coupon, index) => (
                <div key={index} className="coupon-card">
                  <div className="coupon-header">
                    <span className="coupon-discount">{coupon.discount}%</span>
                    <span className="coupon-badge">GIẢM</span>
                  </div>

                  <div className="coupon-body">
                    <h3>{coupon.description}</h3>
                    <p className="coupon-min-order">
                      Đơn hàng tối thiểu: <strong>{coupon.minOrder}</strong>
                    </p>
                  </div>

                  <div className="coupon-code">
                    <code>{coupon.code}</code>
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(coupon.code)}
                    >
                      📋 Sao Chép
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="terms-banner">
              <h3>📋 Điều kiện sử dụng:</h3>
              <ul>
                <li>Mỗi mã chỉ sử dụng một lần cho một giao dịch</li>
                <li>
                  Không kết hợp với các khuyến mãi khác (ngoại trừ miễn phí vận
                  chuyển)
                </li>
                <li>Có hiệu lực cho tất cả sản phẩm trong cửa hàng</li>
                <li>Không hoàn tiền nếu tiết kiệm vượt quá giảm giá thực tế</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <h2>📧 Đăng Ký Nhận Ưu Đãi</h2>
          <p>
            Nhận email thông báo về các khuyến mãi và flash sale sắp tới trước
            các khách hàng khác!
          </p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="newsletter-input"
            />
            <button className="newsletter-btn">Đăng Ký</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotions;
