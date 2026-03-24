import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiEndpoints } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('TẤT CẢ');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [progressKey, setProgressKey] = useState(0);

    const promoSlides = [
        {
            tag: '🔥 FLASH SALE',
            title: <>Giảm giá tới <span>50%</span> hôm nay</>,
            titleText: 'Giảm giá tới 50% hôm nay',
            desc: 'Những sản phẩm công nghệ tuyệt nhất với giá không thể cạnh tranh. Số lượng có hạn!',
            discNum: '50%',
            discLabel: 'GIẢM GIÁ',
            color: 'orange',
            timer: '⏱ Còn 05:42:18',
        },
        {
            tag: '🎁 MEGA DEAL',
            title: <>Mua 1 <span>tặng 1</span> toàn bộ Tai nghe</>,
            titleText: 'Mua 1 tặng 1 toàn bộ Tai nghe',
            desc: 'Chương trình khuyến mãi kép dành riêng cho khách hàng thân thiết trong tháng này.',
            discNum: '2×1',
            discLabel: 'MUA TẶNG',
            color: 'blue',
            timer: '⏱ Đến 31/12/2026',
        },
        {
            tag: '⭐ TOP DEALS',
            title: <>Laptop gaming <span>giá rẻ</span> nhất năm</>,
            titleText: 'Laptop gaming giá rẻ nhất năm',
            desc: 'Cơ hội vàng sở hữu gaming laptop với cấu hình mạnh mẽ, hiệu năng đỉnh cao.',
            discNum: '↓30%',
            discLabel: 'LAPTOP',
            color: 'purple',
            timer: '⏱ Chỉ còn 12 suất',
        },
    ];

    const goToSlide = useCallback((idx) => {
        setCurrentSlide(idx);
        setProgressKey(k => k + 1);
    }, []);

    const prevSlide = () => goToSlide((currentSlide - 1 + promoSlides.length) % promoSlides.length);
    const nextSlide = () => goToSlide((currentSlide + 1) % promoSlides.length);

    // Auto-slide every 5 seconds
    useEffect(() => {
        const slideTimer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % promoSlides.length);
            setProgressKey(k => k + 1);
        }, 5000);
        return () => clearInterval(slideTimer);
    }, [promoSlides.length]);

    // Check for search query from Header
    useEffect(() => {
        const query = sessionStorage.getItem('searchQuery');
        if (query) {
            setSearchQuery(query);
            sessionStorage.removeItem('searchQuery');
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, productsRes] = await Promise.all([
                    apiEndpoints.getCategories(),
                    apiEndpoints.getProducts()
                ]);
                const categoriesData = Array.isArray(categoriesRes.data)
                    ? categoriesRes.data
                    : categoriesRes.data?.$values || [];
                const productsData = Array.isArray(productsRes.data)
                    ? productsRes.data
                    : productsRes.data?.$values || [];

                console.log('API Response:', {
                    products: productsData.length,
                    categories: categoriesData.length,
                    productsList: productsData.map(p => ({ id: p.id, name: p.name }))
                });

                setCategories(categoriesData);
                setProducts(productsData);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(p => {
        if (activeCategory !== 'TẤT CẢ') {
            let categoryName = '';
            if (p.category && typeof p.category === 'object') {
                categoryName = p.category.name || '';
            } else if (typeof p.category === 'string') {
                categoryName = p.category;
            } else if (p.categoryId) {
                const cat = categories.find(c => c.id === p.categoryId);
                categoryName = cat?.name || '';
            }
            if (categoryName.toLowerCase() !== activeCategory.toLowerCase()) return false;
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return p.name.toLowerCase().includes(query) ||
                p.brand?.toLowerCase().includes(query) ||
                p.specifications?.toLowerCase().includes(query);
        }
        return true;
    });

    const handleAddToCart = (product) => {
        const user = localStorage.getItem('user');
        if (!user) { navigate('/login'); return; }
        addItem(product, 1);
    };

    return (
        <div className="ntech-page">
            <main className="ntech-main">
                <div className="ntech-container">

                    {/* ── Hero strip ── */}
                    <div className="ntech-hero">
                        <div className="ntech-hero-orb" />
                        <div className="ntech-hero-orb2" />

                        <div className="ntech-hero-left">
                            <div className="ntech-hero-eyebrow">NTECH STORE</div>
                            <h2 className="ntech-hero-title">
                                Công nghệ <span>đỉnh cao</span><br />Giá tốt nhất
                            </h2>
                            <p className="ntech-hero-sub">
                                Smartphone · Laptop · PC · Tai nghe · Tablet · Phụ kiện
                            </p>
                        </div>

                        <div className="ntech-hero-right">
                            <div className="ntech-hero-tag">NEW ARRIVALS 2026</div>
                            <div className="ntech-hero-stats">
                                <div className="ntech-hero-stat">
                                    <div className="ntech-hero-stat-num">500+</div>
                                    <div className="ntech-hero-stat-label">SẢN PHẨM</div>
                                </div>
                                <div className="ntech-hero-stat">
                                    <div className="ntech-hero-stat-num">50K+</div>
                                    <div className="ntech-hero-stat-label">KHÁCH HÀNG</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Promo Banner Slides ── */}
                    <div className="ntech-slides-container">
                        <div className="ntech-slides">
                            {promoSlides.map((slide, idx) => (
                                <div
                                    key={idx}
                                    className={`ntech-promo-banner ntech-promo-${slide.color}${idx === currentSlide ? ' active' : ''}`}
                                >
                                    {/* Background orbs */}
                                    <div className="ntech-promo-orb-main" />
                                    <div className="ntech-promo-orb-secondary" />

                                    {/* Content */}
                                    <div className="ntech-promo-content">
                                        <div className="ntech-promo-tag">{slide.tag}</div>
                                        <h3 className="ntech-promo-title">{slide.title}</h3>
                                        <p className="ntech-promo-desc">{slide.desc}</p>
                                        <div className="ntech-promo-actions">
                                            <button
                                                className="ntech-promo-btn"
                                                onClick={() => setActiveCategory('TẤT CẢ')}
                                            >
                                                KHÁM PHÁ NGAY →
                                            </button>
                                            <span className="ntech-promo-timer">{slide.timer}</span>
                                        </div>
                                    </div>

                                    {/* Right visual disc */}
                                    <div className="ntech-promo-visual">
                                        <div className="ntech-promo-disc">
                                            <div>
                                                <div className="ntech-promo-disc-inner">{slide.discNum}</div>
                                            </div>
                                        </div>
                                        <span className="ntech-promo-disc-label">{slide.discLabel}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Progress bar */}
                            <div className="ntech-slide-progress">
                                <div key={progressKey} className="ntech-slide-progress-bar" />
                            </div>
                        </div>

                        {/* Slide navigation */}
                        <div className="ntech-slides-nav">
                            <button className="ntech-slide-arrow" onClick={prevSlide}>‹</button>
                            <div className="ntech-slides-dots">
                                {promoSlides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`ntech-dot${idx === currentSlide ? ' active' : ''}`}
                                        onClick={() => goToSlide(idx)}
                                    />
                                ))}
                            </div>
                            <button className="ntech-slide-arrow" onClick={nextSlide}>›</button>
                        </div>
                    </div>

                    {/* ── Category filter ── */}
                    <div className="ntech-categories">
                        <button
                            className={`ntech-cat${activeCategory === 'TẤT CẢ' ? ' active' : ''}`}
                            onClick={() => setActiveCategory('TẤT CẢ')}
                        >
                            TẤT CẢ
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`ntech-cat${activeCategory === cat.name ? ' active' : ''}`}
                                onClick={() => setActiveCategory(cat.name)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* ── Section heading ── */}
                    <div className="ntech-section-hd">
                        <h4>SẢN PHẨM MỚI NHẤT</h4>
                    </div>

                    {/* ── Product grid ── */}
                    {loading ? (
                        <div className="ntech-loading">
                            <div className="ntech-spinner" />
                            <span>Đang tải sản phẩm...</span>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="ntech-empty">Không có sản phẩm trong danh mục này.</div>
                    ) : (
                        <div className="ntech-grid">
                            {filteredProducts.map((product, index) => (
                                <div
                                    className="ntech-product-card"
                                    key={product.id || `product-${index}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <div className="ntech-product-img">
                                        <img
                                            src={product.imageUrl
                                                ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5263${product.imageUrl}`)
                                                : `https://placehold.co/300x200/0d1829/1e78ff?text=${encodeURIComponent(product.name)}`}
                                            alt={product.name}
                                        />
                                        {product.isNew && <span className="ntech-badge badge-new">NEW</span>}
                                        {product.isHot && <span className="ntech-badge badge-hot">HOT</span>}
                                    </div>
                                    <div className="ntech-product-body">
                                        <div className="ntech-product-cat">
                                            {typeof product.category === 'string'
                                                ? product.category
                                                : product.category?.name || 'CÔNG NGHỆ'}
                                        </div>
                                        <div className="ntech-product-name" title={product.name}>{product.name}</div>
                                        <div className="ntech-product-spec">{product.specifications}</div>
                                        <div className="ntech-product-price">
                                            {(product.price || 0).toLocaleString('vi-VN')} VNĐ
                                        </div>
                                        <button
                                            className="ntech-add-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                        >
                                            + Thêm vào giỏ
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default Home;