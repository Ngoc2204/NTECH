import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiEndpoints } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import './Products.css';

const PRICE_RANGES = [
    { key: 'ALL',    label: 'Tất cả mức giá' },
    { key: 'U5',     label: 'Dưới 5 triệu',    min: 0,          max: 5_000_000 },
    { key: '5TO15',  label: '5 – 15 triệu',    min: 5_000_000,  max: 15_000_000 },
    { key: '15TO30', label: '15 – 30 triệu',   min: 15_000_000, max: 30_000_000 },
    { key: 'O30',    label: 'Trên 30 triệu',   min: 30_000_000, max: Infinity },
];

const SORT_OPTIONS = [
    { key: 'default', label: 'Mặc định' },
    { key: 'price_asc',  label: 'Giá tăng dần' },
    { key: 'price_desc', label: 'Giá giảm dần' },
    { key: 'name_asc',   label: 'Tên A → Z' },
    { key: 'name_desc',  label: 'Tên Z → A' },
];

const Products = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addItem } = useCart();

    const [products,   setProducts]   = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading,    setLoading]    = useState(true);

    // Filters
    const [search,      setSearch]      = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [activeBrands, setActiveBrands]     = useState([]);
    const [priceRange,  setPriceRange]  = useState('ALL');
    const [customMin,   setCustomMin]   = useState('');
    const [customMax,   setCustomMax]   = useState('');
    const [sortBy,      setSortBy]      = useState('default');

    // UI
    const [addedId,       setAddedId]       = useState(null);
    const [suggestions,   setSuggestions]   = useState([]);
    const [showSuggest,   setShowSuggest]   = useState(false);
    const searchRef = React.useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    apiEndpoints.getCategories(),
                    apiEndpoints.getProducts(),
                ]);
                const cats  = Array.isArray(catRes.data)  ? catRes.data  : catRes.data?.$values  || [];
                const prods = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data?.$values || [];
                setCategories(cats);
                setProducts(prods);
            } catch (err) {
                console.error('Lỗi tải dữ liệu:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Apply URL params ?category=xxx  &  ?search=yyy
    useEffect(() => {
        const cat = searchParams.get('category');
        const q   = searchParams.get('search');
        if (cat) setActiveCategory(decodeURIComponent(cat));
        if (q)   setSearch(decodeURIComponent(q));
    }, [searchParams]);

    // Collect unique brands
    const allBrands = useMemo(() => {
        const set = new Set(products.map(p => p.brand).filter(Boolean));
        return Array.from(set).sort();
    }, [products]);

    const getCategoryName = (p) => {
        if (p.category && typeof p.category === 'object') return p.category.name || '';
        if (typeof p.category === 'string') return p.category;
        if (p.categoryId) {
            const cat = categories.find(c => c.id === p.categoryId);
            return cat?.name || '';
        }
        return '';
    };

    const filtered = useMemo(() => {
        let list = products.filter(p => {
            // Category
            if (activeCategory !== 'ALL') {
                if (getCategoryName(p).toLowerCase() !== activeCategory.toLowerCase()) return false;
            }
            // Brand (multi-select)
            if (activeBrands.length > 0 && !activeBrands.includes(p.brand)) return false;
            // Price
            const price = p.price || 0;
            if (priceRange === 'CUSTOM') {
                const mn = customMin !== '' ? Number(customMin) : 0;
                const mx = customMax !== '' ? Number(customMax) : Infinity;
                if (price < mn || price > mx) return false;
            } else if (priceRange !== 'ALL') {
                const range = PRICE_RANGES.find(r => r.key === priceRange);
                if (range && (price < range.min || price > range.max)) return false;
            }
            // Search
            if (search.trim()) {
                const q = search.toLowerCase();
                return (
                    p.name.toLowerCase().includes(q) ||
                    (p.brand || '').toLowerCase().includes(q) ||
                    (p.specifications || '').toLowerCase().includes(q)
                );
            }
            return true;
        });

        // Sort
        switch (sortBy) {
            case 'price_asc':  list = [...list].sort((a,b) => (a.price||0) - (b.price||0)); break;
            case 'price_desc': list = [...list].sort((a,b) => (b.price||0) - (a.price||0)); break;
            case 'name_asc':   list = [...list].sort((a,b) => a.name.localeCompare(b.name)); break;
            case 'name_desc':  list = [...list].sort((a,b) => b.name.localeCompare(a.name)); break;
            default: break;
        }
        return list;
    }, [products, categories, activeCategory, activeBrands, priceRange, customMin, customMax, search, sortBy]);

    const toggleBrand = (brand) => {
        setActiveBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    // Autocomplete suggestions
    const computeSuggestions = (val) => {
        if (!val.trim() || val.length < 2) { setSuggestions([]); return; }
        const q = val.toLowerCase();
        const hits = [];
        const seen = new Set();
        products.forEach(p => {
            if (p.name.toLowerCase().includes(q) && !seen.has(p.name)) {
                seen.add(p.name); hits.push({ text: p.name, type: 'product' });
            }
            if (p.brand && p.brand.toLowerCase().includes(q) && !seen.has(p.brand)) {
                seen.add(p.brand); hits.push({ text: p.brand, type: 'brand' });
            }
        });
        setSuggestions(hits.slice(0, 6));
    };

    const handleSearchChange = (val) => {
        setSearch(val);
        computeSuggestions(val);
        setShowSuggest(true);
    };

    const applySuggestion = (text) => {
        setSearch(text);
        setSuggestions([]);
        setShowSuggest(false);
    };

    // Highlight matching text
    const highlight = (text, query) => {
        if (!query.trim()) return text;
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <mark className="prods-highlight">{text.slice(idx, idx + query.length)}</mark>
                {text.slice(idx + query.length)}
            </>
        );
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        const user = localStorage.getItem('user');
        if (!user) { navigate('/login'); return; }
        addItem(product, 1);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    const resetFilters = () => {
        setSearch('');
        setActiveCategory('ALL');
        setActiveBrands([]);
        setPriceRange('ALL');
        setCustomMin('');
        setCustomMax('');
        setSortBy('default');
    };

    const hasActiveFilters = activeCategory !== 'ALL' || activeBrands.length > 0
        || priceRange !== 'ALL' || search.trim() !== '';

    const getImgSrc = (p) =>
        p.imageUrl
            ? (p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:5263${p.imageUrl}`)
            : `https://placehold.co/300x200/0d1829/1e78ff?text=${encodeURIComponent(p.name)}`;

    return (
        <div className="prods-page" onClick={() => setShowSuggest(false)}>
            {/* ── Page header ── */}
            <div className="prods-topbar">
                <div className="prods-topbar-inner">
                    <div className="prods-topbar-left">
                        <h1 className="prods-title">Sản Phẩm</h1>
                        {search.trim() && (
                            <span className="prods-search-tag">
                                🔍 &ldquo;{search}&rdquo;
                                <button className="prods-tag-x" onClick={() => setSearch('')}>✕</button>
                            </span>
                        )}
                        <span className="prods-count">
                            {loading ? '...' : `${filtered.length} / ${products.length} sản phẩm`}
                        </span>
                    </div>
                    <div className="prods-topbar-right">
                        {/* Search with autocomplete */}
                        <div
                            className="prods-search-wrap"
                            ref={searchRef}
                            onClick={e => e.stopPropagation()}
                        >
                            <svg className="prods-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                            <input
                                type="text"
                                className="prods-search"
                                placeholder="Tìm theo tên, hãng..."
                                value={search}
                                onChange={e => handleSearchChange(e.target.value)}
                                onFocus={() => search.length >= 2 && setShowSuggest(true)}
                                onKeyDown={e => { if (e.key === 'Escape') setShowSuggest(false); }}
                            />
                            {search && (
                                <button className="prods-search-clear" onClick={() => { setSearch(''); setSuggestions([]); }}>✕</button>
                            )}
                            {/* Suggestions dropdown */}
                            {showSuggest && suggestions.length > 0 && (
                                <div className="prods-suggestions">
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            className="prods-suggestion-item"
                                            onMouseDown={() => applySuggestion(s.text)}
                                        >
                                            <span className="prods-suggest-icon">
                                                {s.type === 'brand' ? '🏷️' : '📦'}
                                            </span>
                                            <span>{highlight(s.text, search)}</span>
                                            <span className="prods-suggest-type">
                                                {s.type === 'brand' ? 'Hãng' : 'Sản phẩm'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Sort */}
                        <select
                            className="prods-sort"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.key} value={o.key}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="prods-body">
                {/* ── Sidebar ── */}
                <aside className="prods-sidebar">

                    {hasActiveFilters && (
                        <button className="prods-reset-btn" onClick={resetFilters}>
                            ✕ Xoá bộ lọc
                        </button>
                    )}

                    {/* Category */}
                    <div className="prods-filter-block">
                        <div className="prods-filter-title">Danh mục</div>
                        <button
                            className={`prods-filter-item${activeCategory === 'ALL' ? ' active' : ''}`}
                            onClick={() => setActiveCategory('ALL')}
                        >
                            Tất cả
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`prods-filter-item${activeCategory === cat.name ? ' active' : ''}`}
                                onClick={() => setActiveCategory(cat.name)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Price */}
                    <div className="prods-filter-block">
                        <div className="prods-filter-title">Khoảng giá</div>
                        {PRICE_RANGES.map(r => (
                            <button
                                key={r.key}
                                className={`prods-filter-item${priceRange === r.key ? ' active' : ''}`}
                                onClick={() => { setPriceRange(r.key); setCustomMin(''); setCustomMax(''); }}
                            >
                                {r.label}
                            </button>
                        ))}
                        <button
                            className={`prods-filter-item${priceRange === 'CUSTOM' ? ' active' : ''}`}
                            onClick={() => setPriceRange('CUSTOM')}
                        >
                            Tuỳ chỉnh
                        </button>
                        {priceRange === 'CUSTOM' && (
                            <div className="prods-custom-price">
                                <input
                                    type="number"
                                    className="prods-price-input"
                                    placeholder="Từ (VNĐ)"
                                    value={customMin}
                                    onChange={e => setCustomMin(e.target.value)}
                                    min="0"
                                />
                                <span className="prods-price-dash">—</span>
                                <input
                                    type="number"
                                    className="prods-price-input"
                                    placeholder="Đến (VNĐ)"
                                    value={customMax}
                                    onChange={e => setCustomMax(e.target.value)}
                                    min="0"
                                />
                            </div>
                        )}
                    </div>

                    {/* Brand */}
                    {allBrands.length > 0 && (
                        <div className="prods-filter-block">
                            <div className="prods-filter-title">Hãng sản xuất</div>
                            {allBrands.map(brand => (
                                <label key={brand} className="prods-brand-item">
                                    <input
                                        type="checkbox"
                                        checked={activeBrands.includes(brand)}
                                        onChange={() => toggleBrand(brand)}
                                        className="prods-brand-checkbox"
                                    />
                                    <span className="prods-brand-label">{brand}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </aside>

                {/* ── Product grid ── */}
                <div className="prods-main">
                    {loading ? (
                        <div className="prods-loading">
                            <div className="prods-spinner" />
                            <span>Đang tải sản phẩm...</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="prods-empty">
                            <div className="prods-empty-icon">🔍</div>
                            <div className="prods-empty-text">Không tìm thấy sản phẩm phù hợp</div>
                            <button className="prods-reset-btn" onClick={resetFilters}>Xoá bộ lọc</button>
                        </div>
                    ) : (
                        <div className="prods-grid">
                            {filtered.map((product, idx) => (
                                <div
                                    key={product.id || `p-${idx}`}
                                    className="prods-card"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <div className="prods-card-img">
                                        <img src={getImgSrc(product)} alt={product.name} />
                                        {product.isNew && <span className="prods-badge badge-new">NEW</span>}
                                        {product.isHot && <span className="prods-badge badge-hot">HOT</span>}
                                    </div>
                                    <div className="prods-card-body">
                                        <div className="prods-card-cat">
                                            {getCategoryName(product) || 'Công nghệ'}
                                        </div>
                                        {product.brand && (
                                            <div className="prods-card-brand">{product.brand}</div>
                                        )}
                                    <div className="prods-card-name" title={product.name}>
                                        {search.trim() ? highlight(product.name, search) : product.name}
                                    </div>
                                        <div className="prods-card-spec">{product.specifications}</div>
                                        <div className="prods-card-price">
                                            {(product.price || 0).toLocaleString('vi-VN')} VNĐ
                                        </div>
                                        <button
                                            className={`prods-add-btn${addedId === product.id ? ' added' : ''}`}
                                            onClick={e => handleAddToCart(e, product)}
                                        >
                                            {addedId === product.id ? '✓ Đã thêm!' : '+ Thêm vào giỏ'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
