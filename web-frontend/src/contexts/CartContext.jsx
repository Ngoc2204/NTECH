import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load cart từ localStorage khi component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Lỗi khi load cart:', e);
            }
        }
    }, []);

    // Save cart vào localStorage mỗi khi items thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product, quantity = 1) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
    };

    const removeItem = (productId) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('cart');
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
    };

    const getTotalQuantity = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    // Sync cart với backend khi user login
    const syncCartToBackend = async () => {
        const user = localStorage.getItem('user');
        if (!user || items.length === 0) return;

        try {
            setLoading(true);
            // TODO: Tạo API endpoint tương ứng
            // await apiEndpoints.syncCart({ items });
            console.log('Cart synced to backend');
        } catch (error) {
            console.error('Lỗi khi sync cart:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load cart từ backend khi user login
    const loadCartFromBackend = async () => {
        const user = localStorage.getItem('user');
        if (!user) return;

        try {
            setLoading(true);
            // TODO: Tạo API endpoint tương ứng
            // const response = await apiEndpoints.getCart();
            // setItems(response.data);
            console.log('Cart loaded from backend');
        } catch (error) {
            console.error('Lỗi khi load cart từ backend:', error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalQuantity,
        syncCartToBackend,
        loadCartFromBackend,
        loading
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart phải được dùng trong CartProvider');
    }
    return context;
};
