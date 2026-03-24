import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { apiEndpoints } from '../../services/api';
import './Checkout.css';

const PAYMENT_METHODS = [
    { key: 'COD',          icon: '💵', label: 'Thanh toán khi nhận hàng (COD)' },
    { key: 'BANK',         icon: '🏦', label: 'Chuyển khoản ngân hàng' },
    { key: 'VNPAY',        icon: '📱', label: 'VNPay / Ví điện tử' },
];

const SHIPPING_FEE = 30_000;
const FREE_SHIP_THRESHOLD = 500_000;

const Checkout = () => {
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCart();

    // Pre-fill from logged-in user
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const [step, setStep] = useState(1); // 1=info, 2=payment, 3=success

    // Form fields
    const [form, setForm] = useState({
        fullName:    user?.fullName || '',
        phone:       user?.phone    || '',
        email:       user?.email    || '',
        province:    '',
        district:    '',
        address:     '',
        note:        '',
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [errors, setErrors]               = useState({});
    const [submitting, setSubmitting]       = useState(false);
    const [orderId, setOrderId]             = useState(null);

    const subtotal    = getTotalPrice();
    const shippingFee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
    const total       = subtotal + shippingFee;

    // ── Validation ──
    const validate = () => {
        const e = {};
        if (!form.fullName.trim())  e.fullName = 'Vui lòng nhập họ tên';
        if (!form.phone.trim())     e.phone    = 'Vui lòng nhập số điện thoại';
        else if (!/^(0|\+84)[0-9]{8,10}$/.test(form.phone.trim()))
                                    e.phone    = 'Số điện thoại không hợp lệ';
        if (!form.email.trim())     e.email    = 'Vui lòng nhập email';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
        if (!form.province.trim())  e.province = 'Vui lòng nhập tỉnh/thành';
        if (!form.address.trim())   e.address  = 'Vui lòng nhập địa chỉ';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleNextStep = () => {
        if (step === 1 && !validate()) return;
        setStep(s => s + 1);
    };

    // ── Submit order ──
    const handleSubmitOrder = async () => {
        if (submitting) return;

        // Re-check auth before submit
        const userStr = localStorage.getItem('user');
        if (!userStr) { navigate('/login'); return; }
        const currentUser = JSON.parse(userStr);

        setSubmitting(true);
        try {
            const orderData = {
                userId:          currentUser.id,
                customerName:    form.fullName,
                customerPhone:   form.phone,
                customerEmail:   form.email,
                shippingAddress: `${form.address}${form.district ? ', ' + form.district : ''}, ${form.province}`,
                note:            form.note,
                paymentMethod,
                totalAmount:     total,
                orderDetails: items.map(item => ({
                    productId: item.id,
                    quantity:  item.quantity,
                    price:     item.price,
                })),
            };

            const response = await apiEndpoints.createOrder(orderData);
            const newOrderId = response.data?.id || response.data?.orderId || `#${Date.now().toString().slice(-6)}`;
            setOrderId(newOrderId);
            clearCart();
            setStep(3);
        } catch (err) {
            console.error('Lỗi tạo đơn hàng:', err);
            const msg = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Guard: redirect if cart empty ──
    if (items.length === 0 && step !== 3) {
        return (
            <div className="ck-empty">
                <div className="ck-empty-icon">🛒</div>
                <h2>Giỏ hàng trống</h2>
                <p>Vui lòng thêm sản phẩm trước khi thanh toán</p>
                <button className="ck-btn-primary" onClick={() => navigate('/products')}>
                    Mua sắm ngay →
                </button>
            </div>
        );
    }

    return (
        <div className="ck-page">
            {/* ── Stepper ── */}
            {step < 3 && (
                <div className="ck-stepper">
                    {[
                        { n: 1, label: 'Thông tin giao hàng' },
                        { n: 2, label: 'Thanh toán' },
                        { n: 3, label: 'Xác nhận' },
                    ].map(s => (
                        <React.Fragment key={s.n}>
                            <div className={`ck-step${step === s.n ? ' active' : step > s.n ? ' done' : ''}`}>
                                <div className="ck-step-circle">
                                    {step > s.n ? '✓' : s.n}
                                </div>
                                <span className="ck-step-label">{s.label}</span>
                            </div>
                            {s.n < 3 && <div className={`ck-step-line${step > s.n ? ' done' : ''}`} />}
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* ─────────── STEP 1: Shipping Info ─────────── */}
            {step === 1 && (
                <div className="ck-body">
                    <div className="ck-form-section">
                        <h2 className="ck-section-title">📦 Thông tin giao hàng</h2>

                        <div className="ck-form-grid">
                            <div className="ck-field">
                                <label className="ck-label">Họ và tên *</label>
                                <input
                                    className={`ck-input${errors.fullName ? ' error' : ''}`}
                                    value={form.fullName}
                                    onChange={e => handleChange('fullName', e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                />
                                {errors.fullName && <span className="ck-error">{errors.fullName}</span>}
                            </div>

                            <div className="ck-field">
                                <label className="ck-label">Số điện thoại *</label>
                                <input
                                    className={`ck-input${errors.phone ? ' error' : ''}`}
                                    value={form.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                    placeholder="0901234567"
                                />
                                {errors.phone && <span className="ck-error">{errors.phone}</span>}
                            </div>

                            <div className="ck-field ck-field--full">
                                <label className="ck-label">Email *</label>
                                <input
                                    className={`ck-input${errors.email ? ' error' : ''}`}
                                    type="email"
                                    value={form.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    placeholder="email@example.com"
                                />
                                {errors.email && <span className="ck-error">{errors.email}</span>}
                            </div>

                            <div className="ck-field">
                                <label className="ck-label">Tỉnh / Thành phố *</label>
                                <input
                                    className={`ck-input${errors.province ? ' error' : ''}`}
                                    value={form.province}
                                    onChange={e => handleChange('province', e.target.value)}
                                    placeholder="TP. Hồ Chí Minh"
                                />
                                {errors.province && <span className="ck-error">{errors.province}</span>}
                            </div>

                            <div className="ck-field">
                                <label className="ck-label">Quận / Huyện</label>
                                <input
                                    className="ck-input"
                                    value={form.district}
                                    onChange={e => handleChange('district', e.target.value)}
                                    placeholder="Quận 1"
                                />
                            </div>

                            <div className="ck-field ck-field--full">
                                <label className="ck-label">Địa chỉ cụ thể *</label>
                                <input
                                    className={`ck-input${errors.address ? ' error' : ''}`}
                                    value={form.address}
                                    onChange={e => handleChange('address', e.target.value)}
                                    placeholder="Số nhà, tên đường, phường/xã..."
                                />
                                {errors.address && <span className="ck-error">{errors.address}</span>}
                            </div>

                            <div className="ck-field ck-field--full">
                                <label className="ck-label">Ghi chú</label>
                                <textarea
                                    className="ck-input ck-textarea"
                                    value={form.note}
                                    onChange={e => handleChange('note', e.target.value)}
                                    placeholder="Ghi chú cho người giao hàng (tuỳ chọn)..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order summary sidebar */}
                    <div className="ck-sidebar">
                        <OrderSummary items={items} subtotal={subtotal} shippingFee={shippingFee} total={total} />
                        <div className="ck-actions">
                            <button className="ck-btn-ghost" onClick={() => navigate('/cart')}>
                                ← Quay lại giỏ
                            </button>
                            <button className="ck-btn-primary" onClick={handleNextStep}>
                                Tiếp theo →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─────────── STEP 2: Payment ─────────── */}
            {step === 2 && (
                <div className="ck-body">
                    <div className="ck-form-section">
                        <h2 className="ck-section-title">💳 Phương thức thanh toán</h2>

                        <div className="ck-payment-list">
                            {PAYMENT_METHODS.map(m => (
                                <label
                                    key={m.key}
                                    className={`ck-payment-item${paymentMethod === m.key ? ' selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={m.key}
                                        checked={paymentMethod === m.key}
                                        onChange={() => setPaymentMethod(m.key)}
                                        className="ck-radio"
                                    />
                                    <span className="ck-payment-icon">{m.icon}</span>
                                    <span className="ck-payment-label">{m.label}</span>
                                    {paymentMethod === m.key && <span className="ck-radio-check">✓</span>}
                                </label>
                            ))}
                        </div>

                        {paymentMethod === 'BANK' && (
                            <div className="ck-bank-info">
                                <div className="ck-bank-title">Thông tin chuyển khoản</div>
                                <div className="ck-bank-row"><span>Ngân hàng:</span><strong>Vietcombank</strong></div>
                                <div className="ck-bank-row"><span>Số TK:</span><strong>1234 5678 9012</strong></div>
                                <div className="ck-bank-row"><span>Chủ TK:</span><strong>CÔNG TY N-TECH</strong></div>
                                <div className="ck-bank-row"><span>Nội dung:</span><strong>NTECH {user?.fullName?.toUpperCase() || 'PAYMENT'}</strong></div>
                                <div className="ck-bank-note">⚠️ Đơn hàng sẽ được xử lý sau khi xác nhận thanh toán</div>
                            </div>
                        )}

                        {paymentMethod === 'VNPAY' && (
                            <div className="ck-vnpay-info">
                                <div className="ck-bank-title">Thanh toán qua VNPay</div>
                                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
                                    Bạn sẽ được chuyển đến cổng thanh toán VNPay sau khi xác nhận đơn hàng.
                                </p>
                            </div>
                        )}

                        {/* Shipping address recap */}
                        <div className="ck-recap">
                            <div className="ck-recap-title">📍 Địa chỉ nhận hàng</div>
                            <div className="ck-recap-value">
                                {form.fullName} · {form.phone}<br />
                                {form.address}{form.district ? `, ${form.district}` : ''}, {form.province}
                            </div>
                            <button className="ck-recap-edit" onClick={() => setStep(1)}>Sửa</button>
                        </div>
                    </div>

                    <div className="ck-sidebar">
                        <OrderSummary items={items} subtotal={subtotal} shippingFee={shippingFee} total={total} />
                        <div className="ck-actions">
                            <button className="ck-btn-ghost" onClick={() => setStep(1)}>
                                ← Quay lại
                            </button>
                            <button
                                className="ck-btn-primary"
                                onClick={handleSubmitOrder}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <span className="ck-spinner" />
                                ) : '🎉 Đặt hàng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─────────── STEP 3: Success ─────────── */}
            {step === 3 && (
                <div className="ck-success">
                    <div className="ck-success-icon-wrap">
                        <div className="ck-success-icon">✓</div>
                    </div>
                    <h2 className="ck-success-title">Đặt hàng thành công!</h2>
                    <p className="ck-success-sub">
                        Cảm ơn bạn đã mua hàng. Đơn hàng <strong>#{orderId}</strong> đã được ghi nhận.
                    </p>
                    <div className="ck-success-info">
                        <div className="ck-success-row">
                            <span>Địa chỉ giao</span>
                            <span>{form.address}{form.district ? `, ${form.district}` : ''}, {form.province}</span>
                        </div>
                        <div className="ck-success-row">
                            <span>Thanh toán</span>
                            <span>{PAYMENT_METHODS.find(m => m.key === paymentMethod)?.label}</span>
                        </div>
                        <div className="ck-success-row">
                            <span>Tổng cộng</span>
                            <span className="ck-success-total">{total.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                    </div>
                    <p className="ck-success-email">
                        📧 Chúng tôi sẽ gửi xác nhận qua email <strong>{form.email}</strong>
                    </p>
                    <div className="ck-success-actions">
                        <button className="ck-btn-ghost" onClick={() => navigate('/')}>
                            Về trang chủ
                        </button>
                        <button className="ck-btn-primary" onClick={() => navigate('/products')}>
                            Tiếp tục mua sắm →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Mini component: Order Summary ──
const OrderSummary = ({ items, subtotal, shippingFee, total }) => (
    <div className="ck-summary">
        <div className="ck-summary-title">Đơn hàng ({items.length} sản phẩm)</div>
        <div className="ck-summary-items">
            {items.map(item => (
                <div key={item.id} className="ck-summary-item">
                    <div className="ck-summary-item-img">
                        <img
                            src={item.imageUrl
                                ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5263${item.imageUrl}`)
                                : `https://placehold.co/50x50/0d1829/1e78ff?text=${encodeURIComponent(item.name[0])}`}
                            alt={item.name}
                        />
                        <span className="ck-qty-badge">{item.quantity}</span>
                    </div>
                    <div className="ck-summary-item-info">
                        <div className="ck-summary-item-name">{item.name}</div>
                        {item.brand && <div className="ck-summary-item-brand">{item.brand}</div>}
                    </div>
                    <div className="ck-summary-item-price">
                        {((item.price || 0) * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </div>
                </div>
            ))}
        </div>
        <div className="ck-summary-divider" />
        <div className="ck-summary-row">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString('vi-VN')} VNĐ</span>
        </div>
        <div className="ck-summary-row">
            <span>Phí vận chuyển</span>
            <span className={shippingFee === 0 ? 'ck-free-ship' : ''}>
                {shippingFee === 0 ? 'Miễn phí 🎉' : `${shippingFee.toLocaleString('vi-VN')} VNĐ`}
            </span>
        </div>
        {shippingFee > 0 && (
            <div className="ck-free-ship-hint">
                Mua thêm {(FREE_SHIP_THRESHOLD - subtotal).toLocaleString('vi-VN')} VNĐ để được miễn phí ship
            </div>
        )}
        <div className="ck-summary-divider" />
        <div className="ck-summary-total-row">
            <span>Tổng cộng</span>
            <span className="ck-summary-total-val">{total.toLocaleString('vi-VN')} VNĐ</span>
        </div>
    </div>
);

export default Checkout;
