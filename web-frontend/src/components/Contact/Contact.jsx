import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitMessage, setSubmitMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Simulate API call - TODO: Thay bằng backend endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            setSubmitMessage('✓ Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất có thể.');
            
            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            
            // Clear message after 3 seconds
            setTimeout(() => setSubmitMessage(''), 3000);
        } catch (error) {
            setSubmitMessage('✗ Có lỗi xảy ra. Vui lòng thử lại sau.');
            setTimeout(() => setSubmitMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const contactMethods = [
        {
            icon: '📞',
            title: 'Gọi cho chúng tôi',
            content: '0123 456 789',
            description: 'Hỗ trợ 24/7'
        },
        {
            icon: '📧',
            title: 'Email',
            content: 'support@ntech.com',
            description: 'Trả lời trong 24h'
        },
        {
            icon: '📍',
            title: 'Địa chỉ',
            content: '123 Nguyễn Huệ, TPHCM',
            description: 'Văn phòng chính'
        },
        {
            icon: '⏰',
            title: 'Thời gian làm việc',
            content: 'Thứ 2 - CN',
            description: '08:00 - 20:00'
        }
    ];

    const faqs = [
        {
            question: 'Bao lâu tôi sẽ nhận được phản hồi?',
            answer: 'Chúng tôi cam kết phản hồi trong vòng 24 giờ.'
        },
        {
            question: 'Có chính sách đổi trả không?',
            answer: 'Có, sản phẩm có thể đổi trả trong vòng 30 ngày nếu không sử dụng.'
        },
        {
            question: 'Giao hàng miễn phí được không?',
            answer: 'Giao hàng miễn phí cho đơn hàng trên 500.000 VNĐ.'
        },
        {
            question: 'Nhận thanh toán những hình thức nào?',
            answer: 'Chúng tôi nhận thanh toán qua thẻ tín dụng, chuyển khoản và COD.'
        }
    ];

    return (
        <div className="contact-page">
            {/* Back Button */}
            <button 
                className="contact-back-btn"
                onClick={() => navigate('/')}
            >
                ← Quay lại
            </button>

            {/* Hero Section */}
            <div className="contact-hero">
                <h1 className="contact-title">Liên hệ với chúng tôi</h1>
                <p className="contact-subtitle">
                    Chúng tôi luôn sẵn sàng lắng nghe và giúp đỡ. Hãy gửi tin nhắn cho chúng tôi!
                </p>
            </div>

            <div className="contact-container">
                {/* Contact Methods */}
                <section className="contact-methods">
                    <div className="methods-grid">
                        {contactMethods.map((method, idx) => (
                            <div key={idx} className="method-card">
                                <div className="method-icon">{method.icon}</div>
                                <h3 className="method-title">{method.title}</h3>
                                <p className="method-content">{method.content}</p>
                                <p className="method-desc">{method.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Form & Info */}
                <section className="contact-section">
                    <div className="contact-content">
                        {/* Form */}
                        <div className="contact-form-wrapper">
                            <h2>Gửi tin nhắn</h2>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Họ và tên *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="Nhập họ và tên"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="example@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Số điện thoại</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="0123 456 789"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Chủ đề *</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            placeholder="Chủ đề liên hệ"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Nội dung tin nhắn *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Viết tin nhắn của bạn..."
                                        rows="6"
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang gửi...' : '📤 Gửi tin nhắn'}
                                </button>

                                {submitMessage && (
                                    <div className={`form-message ${submitMessage.includes('✗') ? 'error' : 'success'}`}>
                                        {submitMessage}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Info Box */}
                        <div className="contact-info-wrapper">
                            <h2>Thông tin liên hệ</h2>
                            
                            <div className="info-box">
                                <h4>Hỗ trợ khách hàng</h4>
                                <p>
                                    Đội hỗ trợ của chúng tôi sẵn sàng trả lời mọi câu hỏi của bạn,
                                    từ những vấn đề kỹ thuật cho đến hỏi về sản phẩm.
                                </p>
                                <p className="highlight">📞 +84 (0)123 456 789</p>
                            </div>

                            <div className="info-box">
                                <h4>Hợp tác & Quảng cáo</h4>
                                <p>
                                    Nếu bạn quan tâm đến việc hợp tác với N-TECH, vui lòng liên hệ
                                    qua email business của chúng tôi.
                                </p>
                                <p className="highlight">📧 business@ntech.com</p>
                            </div>

                            <div className="info-box">
                                <h4>Mạng xã hội</h4>
                                <p>Theo dõi chúng tôi trên các mạng xã hội:</p>
                                <div className="social-links">
                                    <a href="#" title="Facebook">f</a>
                                    <a href="#" title="Twitter">𝕏</a>
                                    <a href="#" title="Instagram">📷</a>
                                    <a href="#" title="YouTube">▶</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="contact-faq">
                    <h2>Câu hỏi thường gặp</h2>
                    <div className="faq-grid">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="faq-item">
                                <h4>{faq.question}</h4>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Contact;
