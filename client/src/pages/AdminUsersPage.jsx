import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminUsersPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('/api/users', config);
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userInfo]);

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete_user', 'Are you sure you want to delete this user?'))) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                await axios.delete(`/api/users/${id}`, config);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className="dashboard-page" dir={currentDir}>
            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="dashboard-title">
                                {t('manage_users', 'Manage Users')}
                            </h1>
                            <p className="dashboard-subtitle">
                                {t('manage_users_subtitle', 'View and manage all registered users')}
                            </p>
                        </div>
                        <div className="col-lg-4 text-end">
                            <Link to="/admin" className="btn btn-outline-light">
                                <i className={`fas fa-arrow-${currentDir === 'rtl' ? 'right' : 'left'} me-2`}></i>
                                {t('back_to_dashboard', 'Back to Dashboard')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container dashboard-content">
                <div className="card-header-custom mb-4">
                    <h2 className="section-title">
                        <i className={`fas fa-users ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                        {t('user_list', 'User List')}
                    </h2>
                </div>

                <div className="transactions-card">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : users.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table transaction-table">
                                <thead>
                                    <tr>
                                        <th>{t('user_name', 'Name')}</th>
                                        <th>{t('user_email', 'Email')}</th>
                                        <th>{t('user_role', 'Role')}</th>
                                        <th>{t('user_joined', 'Joined Date')}</th>
                                        <th>{t('actions', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="user-avatar-placeholder me-2" style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="fw-bold">{user.name}</span>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`badge ${user.isAdmin ? 'bg-danger' : 'bg-secondary'}`}>
                                                    {user.isAdmin ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(user._id)}
                                                        disabled={user.isAdmin} // Prevent deleting admins easily
                                                        title={t('delete', 'Delete')}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-users-slash fa-3x"></i>
                            <h3>{t('no_users_found', 'No users found')}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;
