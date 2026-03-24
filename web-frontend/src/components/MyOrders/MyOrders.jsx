import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiEndpoints } from '../../services/api';
import './MyOrders.css';

const STATUS_META = {
    Pending:    { label: 'Chờ xử lý',  cls: 'mos-pending',    icon: '🕐' },
    Processing: { label: 'Đang xử lý', cls: 'mos-processing', icon: '⚙️' },
    Shipped:    { label: 'Đang giao',  cls: 'mos-shipped',    icon: '🚚' },
    Delivered:  { label: 'Đã giao',    cls: 'mos-delivered',  icon: '✅' },
    Cancelled:  { label: 'Đã hủy',    cls: 'mos-cancelled',  icon: '❌' },
};

const FILTERS = [
    { key: 'ALL',        label: 'Tất cả' },
    { key: 'Pending',    label: 'Chờ xử lý' },
    { key: 'Processing', label: 'Đang xử lý' },
    { key: 'Shipped',    label: 'Đang giao' },
    { key: 'Delivered',  label: 'Đã giao' },
    { key: 'Cancelled',  label: 'Đã hủy' },
];

const MyOrders = () => {
    const navigate  = useNavigate();
    const userStr   = localStorage.getItem('user');
    const user      = userStr ? JSON.parse(userStr) : null;

    const [orders,    setOrders]    = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState('');
    const [filter,    setFilter]    = useState('ALL');
    const [expanded,  setExpanded]  = useState(null); // expanded order id

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const res  = await apiEndpoints.getOrdersByUser(user.id);
            const data = Array.isArray(res.data)
                ? res.data
                : res.data?.$values || [];
            setOrders(data);
        } catch (err) {
            setError('Không thể tải đơn hàng. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() =>
        filter === 'ALL' ? orders : orders.filter(o => o.status === filter),
    [orders, filter]);

    const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }) : '—';

    const fmtMoney = (n) => (n || 0).toLocaleString('vi-VN') + ' VNĐ';

    const getItems = (order) =>
        order.orderDetails?.$values || order.orderDetails || [];

    const getImgSrc = (item) => {
        const url = item.product?.imageUrl;
        if (!url) return `https://placehold.co/50x50/0d1829/1e78ff?text=${encodeURIComponent((item.product?.name || 'P')[0])}`;
        return url.startsWith('http') ? url : `http://localhost:5263${url}`;
    };

    if (!user) return null;

    return (
        <div className="mo-page">
            {/* ── Page header ── */}
            <div className="mo-header">
                <div>
                    <h1 className="mo-title">Đơn hàng của tôi</h1>
                    <p className="mo-sub">Xin chào, <strong>{user.fullName || user.username}</strong></p>
                </div>
                <Link to="/products" className="mo-shop-btn">
                    🛍️ Tiếp tục mua sắm
                </Link>
            </div>

            {error && <div className="mo-alert">{error}</div>}

            {/* ── Filter tabs ── */}
            <div className="mo-tabs">
                {FILTERS.map(f => (
                    <button
                        key={f.key}
                        className={`mo-tab${filter === f.key ? ' active' : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                        <span className="mo-tab-count">
                            {f.key === 'ALL' ? orders.length : orders.filter(o => o.status === f.key).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className="mo-loading">
                    <div className="mo-spinner" />
                    <span>Đang tải đơn hàng...</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="mo-empty">
                    <div className="mo-empty-icon">📭</div>
                    <div className="mo-empty-text">
                        {filter === 'ALL' ? 'Bạn chưa có đơn hàng nào' : 'Không có đơn hàng nào ở trạng thái này'}
                    </div>
                    {filter === 'ALL' && (
                        <Link to="/products" className="mo-shop-btn">Mua sắm ngay →</Link>
                    )}
                </div>
            ) : (
                <div className="mo-list">
                    {filtered.map(order => {
                        const meta  = STATUS_META[order.status] || STATUS_META.Pending;
                        const items = getItems(order);
                        const open  = expanded === order.id;

                        return (
                            <div key={order.id} className={`mo-card${open ? ' open' : ''}`}>
                                {/* Card header */}
                                <div
                                    className="mo-card-header"
                                    onClick={() => setExpanded(open ? null : order.id)}
                                >
                                    <div className="mo-card-left">
                                        <span className="mo-order-id">#{order.id}</span>
                                        <span className="mo-order-date">{fmtDate(order.orderDate)}</span>
                                    </div>

                                    <div className="mo-card-middle">
                                        {/* Preview images */}
                                        <div className="mo-preview-imgs">
                                            {items.slice(0, 3).map((it, i) => (
                                                <img
                                                    key={i}
                                                    src={getImgSrc(it)}
                                                    alt={it.product?.name}
                                                    className="mo-preview-img"
                                                    style={{ zIndex: 3 - i }}
                                                />
                                            ))}
                                            {items.length > 3 && (
                                                <div className="mo-preview-more">+{items.length - 3}</div>
                                            )}
                                        </div>
                                        <span className="mo-item-count">{items.length} sản phẩm</span>
                                    </div>

                                    <div className="mo-card-right">
                                        <span className={`mo-status ${meta.cls}`}>
                                            {meta.icon} {meta.label}
                                        </span>
                                        <span className="mo-total">{fmtMoney(order.totalAmount)}</span>
                                        <span className="mo-chevron">{open ? '▲' : '▼'}</span>
                                    </div>
                                </div>

                                {/* Card body (expanded) */}
                                {open && (
                                    <div className="mo-card-body">
                                        {/* Shipping info */}
                                        <div className="mo-info-bar">
                                            <div>
                                                <span className="mo-info-label">📍 Địa chỉ giao hàng</span>
                                                <span className="mo-info-val">{order.shippingAddress || '—'}</span>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="mo-items">
                                            {items.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="mo-item"
                                                    onClick={() => item.productId && navigate(`/product/${item.productId}`)}
                                                    style={{ cursor: item.productId ? 'pointer' : 'default' }}
                                                >
                                                    <img src={getImgSrc(item)} alt={item.product?.name} className="mo-item-img" />
                                                    <div className="mo-item-info">
                                                        <div className="mo-item-name">
                                                            {item.product?.name || `Sản phẩm #${item.productId}`}
                                                        </div>
                                                        {item.product?.brand && (
                                                            <div className="mo-item-brand">{item.product.brand}</div>
                                                        )}
                                                    </div>
                                                    <div className="mo-item-meta">
                                                        <div className="mo-item-qty">x{item.quantity}</div>
                                                        <div className="mo-item-price">{fmtMoney(item.unitPrice)}</div>
                                                    </div>
                                                    <div className="mo-item-subtotal">
                                                        {fmtMoney((item.unitPrice || 0) * item.quantity)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="mo-card-footer">
                                            <div className="mo-footer-total">
                                                <span>Tổng cộng:</span>
                                                <span className="mo-footer-total-val">{fmtMoney(order.totalAmount)}</span>
                                            </div>

                                            {/* Status timeline */}
                                            <div className="mo-timeline">
                                                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((s, i) => {
                                                    const steps   = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                                                    const curIdx  = steps.indexOf(order.status);
                                                    const done    = curIdx >= i;
                                                    const current = curIdx === i;
                                                    return (
                                                        <React.Fragment key={s}>
                                                            <div className={`mo-tl-step${done ? ' done' : ''}${current ? ' current' : ''}`}>
                                                                <div className="mo-tl-dot" />
                                                                <div className="mo-tl-label">{STATUS_META[s]?.label}</div>
                                                            </div>
                                                            {i < 3 && <div className={`mo-tl-line${done && curIdx > i ? ' done' : ''}`} />}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>

                                            {order.status === 'Delivered' && (
                                                <button
                                                    className="mo-rebuy-btn"
                                                    onClick={() => navigate('/products')}
                                                >
                                                    🔄 Mua lại
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
