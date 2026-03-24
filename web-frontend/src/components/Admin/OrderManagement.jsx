import React, { useState, useEffect, useMemo } from 'react';
import { apiEndpoints } from '../../services/api';
import AdminLayout from './AdminLayout';
import './ProductManagement.css';
import './OrderManagement.css';

const STATUS_OPTIONS = [
    { key: 'ALL',        label: 'Tất cả' },
    { key: 'Pending',    label: 'Chờ xử lý' },
    { key: 'Processing', label: 'Đang xử lý' },
    { key: 'Shipped',    label: 'Đã gửi' },
    { key: 'Delivered',  label: 'Đã giao' },
    { key: 'Cancelled',  label: 'Đã hủy' },
];

const STATUS_META = {
    Pending:    { label: 'Chờ xử lý',  color: 'status-pending'    },
    Processing: { label: 'Đang xử lý', color: 'status-processing' },
    Shipped:    { label: 'Đã gửi',     color: 'status-shipped'    },
    Delivered:  { label: 'Đã giao',    color: 'status-delivered'  },
    Cancelled:  { label: 'Đã hủy',     color: 'status-cancelled'  },
};

const OrderManagement = () => {
    const [orders,  setOrders]  = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');
    const [success, setSuccess] = useState('');

    // Filters
    const [search,        setSearch]        = useState('');
    const [statusFilter,  setStatusFilter]  = useState('ALL');
    const [sortBy,        setSortBy]        = useState('newest');

    // Detail modal
    const [detailOrder,   setDetailOrder]   = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Inline status update loading
    const [updatingId,    setUpdatingId]    = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await apiEndpoints.admin.getOrders();
            const data = Array.isArray(res.data)
                ? res.data
                : res.data?.$values || [];
            setOrders(data);
        } catch (err) {
            setError('Lỗi tải dữ liệu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            setUpdatingId(id);
            await apiEndpoints.admin.updateOrderStatus(id, { status: newStatus });
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            // Also update modal if open
            if (detailOrder?.id === id) setDetailOrder(d => ({ ...d, status: newStatus }));
            showSuccess('Cập nhật trạng thái thành công!');
        } catch (err) {
            setError('Lỗi: ' + (err.response?.data?.message || err.message));
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa đơn hàng này?')) return;
        try {
            await apiEndpoints.admin.deleteOrder(id);
            setOrders(prev => prev.filter(o => o.id !== id));
            if (detailOrder?.id === id) setDetailOrder(null);
            showSuccess('Xóa đơn hàng thành công!');
        } catch (err) {
            setError('Lỗi xóa: ' + (err.response?.data?.message || err.message));
        }
    };

    const showSuccess = (msg) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(''), 3000);
    };

    const openDetail = async (order) => {
        setDetailOrder(order);
        if (!order.orderDetails || order.orderDetails.length === 0) {
            try {
                setDetailLoading(true);
                const res = await apiEndpoints.admin.getOrder(order.id);
                setDetailOrder(res.data);
            } catch (_) {}
            finally { setDetailLoading(false); }
        }
    };

    // ── Stats ──
    const stats = useMemo(() => {
        const total    = orders.length;
        const pending  = orders.filter(o => o.status === 'Pending').length;
        const shipping = orders.filter(o => o.status === 'Shipped' || o.status === 'Processing').length;
        const done     = orders.filter(o => o.status === 'Delivered').length;
        const revenue  = orders
            .filter(o => o.status !== 'Cancelled')
            .reduce((s, o) => s + (o.totalAmount || 0), 0);
        return { total, pending, shipping, done, revenue };
    }, [orders]);

    // ── Filtered list ──
    const filtered = useMemo(() => {
        let list = orders.filter(o => {
            if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
            if (search.trim()) {
                const q = search.toLowerCase();
                return (
                    String(o.id).includes(q) ||
                    (o.user?.fullName || '').toLowerCase().includes(q) ||
                    (o.shippingAddress || '').toLowerCase().includes(q)
                );
            }
            return true;
        });

        switch (sortBy) {
            case 'newest':   list = [...list].sort((a,b) => new Date(b.orderDate) - new Date(a.orderDate)); break;
            case 'oldest':   list = [...list].sort((a,b) => new Date(a.orderDate) - new Date(b.orderDate)); break;
            case 'amount_h': list = [...list].sort((a,b) => (b.totalAmount||0) - (a.totalAmount||0)); break;
            case 'amount_l': list = [...list].sort((a,b) => (a.totalAmount||0) - (b.totalAmount||0)); break;
            default: break;
        }
        return list;
    }, [orders, statusFilter, search, sortBy]);

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
    const fmtMoney = (n) => (n || 0).toLocaleString('vi-VN') + ' VNĐ';

    return (
        <AdminLayout>
            <div className="om-page">

                {/* ── Header ── */}
                <div className="om-header">
                    <div>
                        <h1 className="om-title">Quản lý Đơn hàng</h1>
                        <p className="om-subtitle">{orders.length} đơn hàng trong hệ thống</p>
                    </div>
                    <button className="om-refresh-btn" onClick={fetchOrders} disabled={loading}>
                        {loading ? '...' : '↻ Làm mới'}
                    </button>
                </div>

                {/* ── Alerts ── */}
                {error   && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* ── Stats ── */}
                <div className="om-stats">
                    <div className="om-stat-card">
                        <div className="om-stat-num">{stats.total}</div>
                        <div className="om-stat-label">Tổng đơn</div>
                    </div>
                    <div className="om-stat-card pending">
                        <div className="om-stat-num">{stats.pending}</div>
                        <div className="om-stat-label">Chờ xử lý</div>
                    </div>
                    <div className="om-stat-card shipping">
                        <div className="om-stat-num">{stats.shipping}</div>
                        <div className="om-stat-label">Đang vận chuyển</div>
                    </div>
                    <div className="om-stat-card done">
                        <div className="om-stat-num">{stats.done}</div>
                        <div className="om-stat-label">Đã giao</div>
                    </div>
                    <div className="om-stat-card revenue">
                        <div className="om-stat-num">{(stats.revenue/1_000_000).toFixed(1)}M</div>
                        <div className="om-stat-label">Doanh thu (VNĐ)</div>
                    </div>
                </div>

                {/* ── Toolbar ── */}
                <div className="om-toolbar">
                    {/* Search */}
                    <div className="om-search-wrap">
                        <svg className="om-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            type="text"
                            className="om-search"
                            placeholder="Tìm theo mã, tên khách, địa chỉ..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && <button className="om-search-clear" onClick={() => setSearch('')}>✕</button>}
                    </div>

                    {/* Status filter tabs */}
                    <div className="om-status-tabs">
                        {STATUS_OPTIONS.map(s => (
                            <button
                                key={s.key}
                                className={`om-tab${statusFilter === s.key ? ' active' : ''}`}
                                onClick={() => setStatusFilter(s.key)}
                            >
                                {s.label}
                                <span className="om-tab-count">
                                    {s.key === 'ALL' ? orders.length : orders.filter(o => o.status === s.key).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select className="om-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="amount_h">Giá cao nhất</option>
                        <option value="amount_l">Giá thấp nhất</option>
                    </select>
                </div>

                {/* ── Table ── */}
                {loading ? (
                    <div className="om-loading"><div className="om-spinner" /><span>Đang tải đơn hàng...</span></div>
                ) : filtered.length === 0 ? (
                    <div className="om-empty">
                        <div className="om-empty-icon">📭</div>
                        <div>Không có đơn hàng nào phù hợp</div>
                    </div>
                ) : (
                    <div className="admin-table om-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Địa chỉ</th>
                                    <th>Ngày đặt</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => {
                                    const meta = STATUS_META[order.status] || STATUS_META.Pending;
                                    return (
                                        <tr key={order.id}>
                                            <td>
                                                <span className="om-order-id">#{order.id}</span>
                                            </td>
                                            <td>
                                                <div className="om-customer-name">
                                                    {order.user?.fullName || '—'}
                                                </div>
                                                <div className="om-customer-meta">
                                                    ID: {order.userId}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="om-address" title={order.shippingAddress}>
                                                    {order.shippingAddress || '—'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="om-date">{fmtDate(order.orderDate)}</div>
                                            </td>
                                            <td>
                                                <div className="om-amount">{fmtMoney(order.totalAmount)}</div>
                                            </td>
                                            <td>
                                                <select
                                                    className={`om-status-select ${meta.color}`}
                                                    value={order.status || 'Pending'}
                                                    onChange={e => handleStatusChange(order.id, e.target.value)}
                                                    disabled={updatingId === order.id}
                                                >
                                                    {STATUS_OPTIONS.filter(s => s.key !== 'ALL').map(s => (
                                                        <option key={s.key} value={s.key}>{s.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <div className="actions">
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => openDetail(order)}
                                                    >
                                                        Chi tiết
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDelete(order.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Detail Modal ── */}
                {detailOrder && (
                    <div className="om-modal-backdrop" onClick={() => setDetailOrder(null)}>
                        <div className="om-modal" onClick={e => e.stopPropagation()}>
                            <div className="om-modal-header">
                                <div>
                                    <h2 className="om-modal-title">Chi tiết đơn #{detailOrder.id}</h2>
                                    <span className={`om-status-badge ${STATUS_META[detailOrder.status]?.color || 'status-pending'}`}>
                                        {STATUS_META[detailOrder.status]?.label || detailOrder.status}
                                    </span>
                                </div>
                                <button className="om-modal-close" onClick={() => setDetailOrder(null)}>✕</button>
                            </div>

                            <div className="om-modal-body">
                                {/* Info grid */}
                                <div className="om-modal-info">
                                    <div className="om-info-block">
                                        <div className="om-info-label">Khách hàng</div>
                                        <div className="om-info-value">{detailOrder.user?.fullName || `User #${detailOrder.userId}`}</div>
                                    </div>
                                    <div className="om-info-block">
                                        <div className="om-info-label">Ngày đặt</div>
                                        <div className="om-info-value">{fmtDate(detailOrder.orderDate)}</div>
                                    </div>
                                    <div className="om-info-block om-info-block--full">
                                        <div className="om-info-label">Địa chỉ giao hàng</div>
                                        <div className="om-info-value">{detailOrder.shippingAddress || '—'}</div>
                                    </div>
                                </div>

                                {/* Order items */}
                                <div className="om-modal-section-title">Sản phẩm trong đơn</div>
                                {detailLoading ? (
                                    <div className="om-loading-small"><div className="om-spinner small" /> Đang tải...</div>
                                ) : (
                                    <div className="om-items">
                                        {(detailOrder.orderDetails?.$values || detailOrder.orderDetails || []).length === 0 ? (
                                            <div className="om-no-items">Không có chi tiết sản phẩm</div>
                                        ) : (
                                            (detailOrder.orderDetails?.$values || detailOrder.orderDetails || []).map((item, i) => (
                                                <div key={i} className="om-item-row">
                                                    <div className="om-item-img">
                                                        <img
                                                            src={item.product?.imageUrl
                                                                ? (item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:5263${item.product.imageUrl}`)
                                                                : `https://placehold.co/48x48/0d1829/1e78ff?text=${encodeURIComponent((item.product?.name || 'P')[0])}`}
                                                            alt={item.product?.name}
                                                        />
                                                    </div>
                                                    <div className="om-item-info">
                                                        <div className="om-item-name">{item.product?.name || `Product #${item.productId}`}</div>
                                                        <div className="om-item-meta">SL: {item.quantity} × {fmtMoney(item.unitPrice)}</div>
                                                    </div>
                                                    <div className="om-item-total">
                                                        {fmtMoney((item.unitPrice || 0) * item.quantity)}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Total */}
                                <div className="om-modal-total">
                                    <span>Tổng cộng</span>
                                    <span className="om-modal-total-val">{fmtMoney(detailOrder.totalAmount)}</span>
                                </div>

                                {/* Quick status update */}
                                <div className="om-modal-status-section">
                                    <label className="om-info-label">Cập nhật trạng thái</label>
                                    <div className="om-modal-status-row">
                                        {STATUS_OPTIONS.filter(s => s.key !== 'ALL').map(s => (
                                            <button
                                                key={s.key}
                                                className={`om-status-tag${detailOrder.status === s.key ? ' current' : ''}`}
                                                onClick={() => handleStatusChange(detailOrder.id, s.key)}
                                                disabled={updatingId === detailOrder.id || detailOrder.status === s.key}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
};

export default OrderManagement;
