import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiEndpoints } from '../../services/api';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
    });
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await apiEndpoints.register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Floating ambient labels */}
            <span className="register-float-label">SMARTPHONE / LAPTOP</span>
            <span className="register-float-label">PC / TABLET / AUDIO</span>
            <span className="register-float-label">N-TECH // REGISTER</span>
            <span className="register-float-label">SECURE CONNECTION</span>

            <div className="register-card">
                <div className="register-corner-bl" />

                {/* ── Logo Hero ── */}
                <div className="register-logo-hero">
                    <div className="register-logo-circle">
                        <img
                            src="/favicon.png"
                            alt="N-TECH"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="register-logo-fallback" style={{ display: 'none' }}>NT</div>
                    </div>
                    <div className="register-brand-name"><span>N</span>-TECH</div>
                    <div className="register-brand-sub">Technology Store</div>
                </div>

                {/* ── Title ── */}
                <div className="register-title">Tạo Tài Khoản</div>
                <p className="register-subtitle">Đăng ký để mua sắm tại N-TECH</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="register-grid">
                        <div className="form-group form-group-full">
                            <label>Họ &amp; Tên</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Nguyễn Văn A"
                                required
                            />
                        </div>
                        <div className="form-group form-group-full">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tài khoản</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="username..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
                    </button>
                </form>

                <div className="register-footer">
                    Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                </div>

                
            </div>
        </div>
    );
};

export default Register;