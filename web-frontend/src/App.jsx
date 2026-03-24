import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Products from './components/Products/Products';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import MyOrders from './components/MyOrders/MyOrders';
import Contact from './components/Contact/Contact';
import Promotions from './components/Promotions/Promotions';
import MainLayout from './components/Layout/MainLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProductManagement from './components/Admin/ProductManagement';
import CategoryManagement from './components/Admin/CategoryManagement';
import OrderManagement from './components/Admin/OrderManagement';
import UserManagement from './components/Admin/UserManagement';

function App() {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/"
                        element={
                            <MainLayout>
                                <Home />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/product/:id"
                        element={
                            <MainLayout>
                                <ProductDetail />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/products"
                        element={
                            <MainLayout>
                                <Products />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/cart"
                        element={
                            <MainLayout>
                                <Cart />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/checkout"
                        element={
                            <MainLayout>
                                <Checkout />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/my-orders"
                        element={
                            <MainLayout>
                                <MyOrders />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/contact"
                        element={
                            <MainLayout>
                                <Contact />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/promotions"
                        element={
                            <MainLayout>
                                <Promotions />
                            </MainLayout>
                        }
                    />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<ProductManagement />} />
                    <Route path="/admin/categories" element={<CategoryManagement />} />
                    <Route path="/admin/orders" element={<OrderManagement />} />
                    <Route path="/admin/users" element={<UserManagement />} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;