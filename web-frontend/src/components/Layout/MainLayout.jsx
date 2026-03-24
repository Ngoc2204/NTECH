import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Thanh menu luôn ở trên */}
            <Header />
            
            {/* Nội dung thay đổi theo từng trang sẽ nằm ở đây */}
            <main className="flex-grow-1 bg-light py-4">
                {children}
            </main>
            
            {/* Chân trang luôn ở dưới */}
            <Footer />
        </div>
    );
};

export default MainLayout;