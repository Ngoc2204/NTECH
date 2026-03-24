import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiEndpoints } from '../../services/api';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiEndpoints.login({ username, password });

            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                if (response.data.role === 'Admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Floating bg labels */}
            <span className="login-float-label">SYS::AUTH</span>
            <span className="login-float-label">SEC.LAYER_01</span>
            <span className="login-float-label">NODE::ACTIVE</span>
            <span className="login-float-label">VER.2025</span>

            <div className="login-card">
                <div className="login-corner-bl" />

                {/* ── Logo Hero ── */}
                <div className="login-logo-hero">
                    <div className="login-logo-circle">
                        <img
                            src="/favicon.png"
                            alt="N-TECH"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="login-logo-fallback" style={{ display: 'none' }}>NT</div>
                    </div>
                    <div className="login-brand-name"><span>N</span>-TECH</div>
                    <div className="login-brand-sub">Technology Store</div>
                </div>

                {/* ── Title ── */}
                <div className="login-title">Đăng Nhập</div>
                <p className="login-subtitle">Truy cập tài khoản của bạn</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Tài khoản</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập..."
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                    </button>
                </form>

                <div className="login-register-prompt">
                    Chưa có tài khoản?{' '}
                    <Link to="/register">Đăng ký ngay</Link>
                </div>

                
            </div>
        </div>
    );
};

export default Login;