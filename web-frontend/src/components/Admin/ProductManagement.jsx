import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../../services/api';
import AdminLayout from './AdminLayout';
import './ProductManagement.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: 0,
        stockQuantity: 0,
        categoryId: 1,
        specifications: '',
        imageUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                apiEndpoints.admin.getProducts(),
                apiEndpoints.admin.getCategories()
            ]);
            
            const productsData = Array.isArray(productsRes.data) 
                ? productsRes.data 
                : productsRes.data?.$values || [];
            const categoriesData = Array.isArray(categoriesRes.data) 
                ? categoriesRes.data 
                : categoriesRes.data?.$values || [];

            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err) {
            setError('Lỗi tải dữ liệu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stockQuantity' || name === 'categoryId' 
                ? Number(value) 
                : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file) => {
        if (!file) return null;
        
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        
        try {
            const response = await fetch('http://localhost:5263/api/upload', {
                method: 'POST',
                body: formDataFile
            });
            if (response.ok) {
                const data = await response.json();
                return data.imageUrl; // Return the URL from the server
            }
        } catch (err) {
            console.error('Upload error:', err);
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            let imageUrl = formData.imageUrl;
            
            // Upload image if a new file was selected
            if (imageFile) {
                const uploadedImageUrl = await uploadImage(imageFile);
                if (uploadedImageUrl) {
                    imageUrl = uploadedImageUrl;
                } else {
                    setError('Lỗi tải ảnh lên máy chủ');
                    return;
                }
            }
            
            const productData = { ...formData, imageUrl };
            
            if (editingId) {
                await apiEndpoints.admin.updateProduct(editingId, { id: editingId, ...productData });
                setSuccess('Cập nhật sản phẩm thành công!');
            } else {
                await apiEndpoints.admin.createProduct(productData);
                setSuccess('Thêm sản phẩm thành công!');
            }
            resetForm();
            fetchData();
        } catch (err) {
            setError('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            brand: product.brand || '',
            price: product.price,
            stockQuantity: product.stockQuantity,
            categoryId: product.categoryId,
            specifications: product.specifications || '',
            imageUrl: product.imageUrl || ''
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingId(product.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await apiEndpoints.admin.deleteProduct(id);
                setSuccess('Xóa sản phẩm thành công!');
                fetchData();
            } catch (err) {
                setError('Lỗi xóa: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            brand: '',
            price: 0,
            stockQuantity: 0,
            categoryId: 1,
            specifications: '',
            imageUrl: ''
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-header">
                    <h1>Quản lý Sản phẩm</h1>
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        + Thêm sản phẩm
                    </button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {showForm && (
                    <div className="admin-form-container">
                        <h2>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tên sản phẩm *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nhãn hiệu</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Giá *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số lượng *</label>
                                    <input
                                        type="number"
                                        name="stockQuantity"
                                        value={formData.stockQuantity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Danh mục *</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Thông số kỹ thuật</label>
                                <textarea
                                    name="specifications"
                                    value={formData.specifications}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>Chọn ảnh sản phẩm</label>
                                <input
                                    type="file"
                                    name="imageUrl"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                    </div>
                                )}
                                {formData.imageUrl && !imagePreview && (
                                    <div className="image-preview">
                                        <img 
                                            src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `http://localhost:5263${formData.imageUrl}`} 
                                            alt="Current" 
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingId ? 'Cập nhật' : 'Thêm'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={resetForm}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="loading">Đang tải...</div>
                ) : products.length === 0 ? (
                    <div className="empty">Không có sản phẩm nào</div>
                ) : (
                    <div className="admin-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên</th>
                                    <th>Nhãn hiệu</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Danh mục</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products && products.map(product => (
                                    product && product.id ? (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.brand || '-'}</td>
                                            <td>{(product.price || 0).toLocaleString('vi-VN')} VNĐ</td>
                                            <td>{product.stockQuantity}</td>
                                            <td>{product.category?.name || '-'}</td>
                                            <td className="actions">
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ) : null
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ProductManagement;
