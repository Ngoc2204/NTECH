import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../../services/api';
import AdminLayout from './AdminLayout';
import './ProductManagement.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await apiEndpoints.admin.getCategories();
            const data = Array.isArray(res.data) ? res.data : res.data?.$values || [];
            setCategories(data);
        } catch (err) {
            setError('Lỗi tải dữ liệu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingId) {
                await apiEndpoints.admin.updateCategory(editingId, { id: editingId, ...formData });
                setSuccess('Cập nhật danh mục thành công!');
            } else {
                await apiEndpoints.admin.createCategory(formData);
                setSuccess('Thêm danh mục thành công!');
            }
            resetForm();
            fetchCategories();
        } catch (err) {
            setError('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (cat) => {
        setFormData({ name: cat.name, description: cat.description || '' });
        setEditingId(cat.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) {
            try {
                await apiEndpoints.admin.deleteCategory(id);
                setSuccess('Xóa danh mục thành công!');
                fetchCategories();
            } catch (err) {
                setError('Lỗi xóa: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-header">
                    <h1>Quản lý Danh mục</h1>
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        + Thêm danh mục
                    </button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {showForm && (
                    <div className="admin-form-container">
                        <h2>{editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Tên danh mục *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows="3"
                                />
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
                ) : categories.length === 0 ? (
                    <div className="empty">Không có danh mục nào</div>
                ) : (
                    <div className="admin-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên</th>
                                    <th>Mô tả</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td>{cat.id}</td>
                                        <td>{cat.name}</td>
                                        <td>{cat.description || '-'}</td>
                                        <td className="actions">
                                            <button className="btn-edit" onClick={() => handleEdit(cat)}>Sửa</button>
                                            <button className="btn-delete" onClick={() => handleDelete(cat.id)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default CategoryManagement;
