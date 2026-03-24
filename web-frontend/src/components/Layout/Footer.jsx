import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="ntech-footer">
            <div className="ntech-footer-inner">
                {/* Brand */}
                <div className="ntech-footer-brand">
                    <img src="/favicon.png" alt="N-TECH Logo" className="ntech-footer-logo" />
                    <div>
                        <div className="ntech-footer-name"><span>N</span>-TECH Store</div>
                        <div className="ntech-footer-tagline">Technology at its finest</div>
                    </div>
                </div>

                {/* Links */}
                <div className="ntech-footer-links">
                    <Link to="/policy">Chính sách</Link>
                    <Link to="/warranty">Bảo hành</Link>
                    <Link to="/contact">Liên hệ</Link>
                    <Link to="/about">Về chúng tôi</Link>
                </div>

                {/* Copy */}
                <div className="ntech-footer-copy">
                    © 2025 N-TECH // ALL RIGHTS RESERVED
                </div>
            </div>
        </footer>
    );
};

export default Footer;