import axios from 'axios';

const API_BASE_URL = 'http://localhost:5263/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// API endpoints
export const apiEndpoints = {
    // Categories
    getCategories: () => api.get('/Categories'),
    
    // Products
    getProducts: () => api.get('/Products'),
    getProductById: (id) => api.get(`/Products/${id}`),
    
    // Auth
    login: (credentials) => api.post('/Auth/login', credentials),
    register: (userData) => api.post('/Auth/register', userData),
    
    // Orders
    getOrders: () => api.get('/Orders'),
    getOrderById: (id) => api.get(`/Orders/${id}`),
    getOrdersByUser: (userId) => api.get(`/Orders/user/${userId}`),
    createOrder: (orderData) => api.post('/Orders', orderData),
    
    // Order Details
    getOrderDetails: () => api.get('/OrderDetails'),

    // Admin endpoints
    admin: {
        // Products
        getProducts: () => api.get('/admin/products'),
        createProduct: (data) => api.post('/admin/products', data),
        updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
        deleteProduct: (id) => api.delete(`/admin/products/${id}`),

        // Categories
        getCategories: () => api.get('/admin/categories'),
        createCategory: (data) => api.post('/admin/categories', data),
        updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
        deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

        // Orders
        getOrders: () => api.get('/admin/orders'),
        getOrder: (id) => api.get(`/admin/orders/${id}`),
        updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
        deleteOrder: (id) => api.delete(`/admin/orders/${id}`),

        // Users
        getUsers: () => api.get('/admin/users'),
        getUser: (id) => api.get(`/admin/users/${id}`),
        updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
        deleteUser: (id) => api.delete(`/admin/users/${id}`),
    }
};

export default api;
