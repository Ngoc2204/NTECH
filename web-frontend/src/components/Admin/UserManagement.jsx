import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../../services/api';
import AdminLayout from './AdminLayout';
import './ProductManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await apiEndpoints.admin.getUsers();
            const data = Array.isArray(res.data) ? res.data : res.data?.$values || [];
            setUsers(data);
        } catch (err) {
            setError('Lỗi tải dữ liệu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await apiEndpoints.admin.updateUserRole(id, { role: newRole });
            setSuccess('Cập nhật vai trò thành công!');
            fetchUsers();
        } catch (err) {
            setError('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa người dùng này?')) {
            try {
                await apiEndpoints.admin.deleteUser(id);
                setSuccess('Xóa người dùng thành công!');
                fetchUsers();
            } catch (err) {
                setError('Lỗi xóa: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-header">
                    <h1>Quản lý Người dùng</h1>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {loading ? (
                    <div className="loading">Đang tải...</div>
                ) : users.length === 0 ? (
                    <div className="empty">Không có người dùng nào</div>
                ) : (
                    <div className="admin-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên đăng nhập</th>
                                    <th>Email</th>
                                    <th>Tên đầy đủ</th>
                                    <th>Vai trò</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email || '-'}</td>
                                        <td>{user.fullName || '-'}</td>
                                        <td>
                                            <select 
                                                value={user.role || 'Customer'}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Customer">Khách hàng</option>
                                            </select>
                                        </td>
                                        <td className="actions">
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Xóa
                                            </button>
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

export default UserManagement;
