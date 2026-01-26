import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminUserInfoPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const [selectedUserProjects, setSelectedUserProjects] = useState(null);

    const handleViewProjects = (projects, userName) => {
        setSelectedUserProjects({ projects, userName });
    };

    const closeProjectsModal = () => {
        setSelectedUserProjects(null);
    };

    return (
        <div className="dashboard-page" dir={currentDir}>
            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="dashboard-title">
                                {t('user_information', 'User Information')}
                            </h1>
                            <p className="dashboard-subtitle">
                                {t('user_info_subtitle', 'Detailed insights into user activity and location')}
                            </p>
                        </div>
                        <div className="col-lg-4 text-end">
                            <Link
                                to="/admin"
                                className="btn btn-outline-light"
                                style={{ position: 'relative', zIndex: 10 }}
                            >
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
                        <i className={`fas fa-info-circle ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                        {t('detailed_user_list', 'Detailed User List')}
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
                                        <th>{t('user', 'User')}</th>
                                        <th>{t('contact_info', 'Contact Info')}</th>
                                        <th>{t('profile', 'Profile')}</th>
                                        <th>{t('activity', 'Activity')}</th>
                                        <th>{t('last_login', 'Last Login')}</th>
                                        <th>{t('other_info', 'Other Info')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <Link to={`/admin/user/${user._id}`} className="text-decoration-none text-dark">
                                                    <div className="d-flex align-items-center user-row-clickable">
                                                        <div className="user-avatar-placeholder me-2" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '16px', fontWeight: 'bold' }}>
                                                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                        <div className="fw-bold">{user.name}</div>
                                                    </div>
                                                </Link>
                                                <div className="mt-1">
                                                    <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <i className="fas fa-envelope me-2 text-muted"></i>
                                                    {user.email}
                                                </div>
                                                <div className="mt-1">
                                                    <i className="fas fa-phone me-2 text-muted"></i>
                                                    {user.phone ? user.phone : <span className="text-muted">N/A</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{t('city', 'City')}: </strong>
                                                    {user.city ? user.city : <span className="text-muted">N/A</span>}
                                                </div>
                                                <div className="mt-1">
                                                    <strong>{t('profession', 'Profession')}: </strong>
                                                    {user.profession ? user.profession : <span className="text-muted">N/A</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{t('projects', 'Projects')}: </strong>
                                                    {user.projectsSupportedCount || 0}
                                                    {user.projectsSupportedCount > 0 && (
                                                        <button
                                                            className="btn btn-sm btn-link p-0 ms-2"
                                                            onClick={() => handleViewProjects(user.projectsSupported, user.name)}
                                                        >
                                                            ({t('view', 'View')})
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="mt-1">
                                                    <strong>{t('products', 'Products')}: </strong>
                                                    {user.productsBoughtCount || 0}
                                                </div>
                                            </td>
                                            <td>
                                                {user.lastLogin ? (
                                                    <div>
                                                        <div>{new Date(user.lastLogin.time).toLocaleDateString()}</div>
                                                        <small className="text-muted">
                                                            {user.lastLogin.city ? `${user.lastLogin.city}, ${user.lastLogin.country}` : 'Unknown Location'}
                                                        </small>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">{t('never', 'Never')}</span>
                                                )}
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{t('wallet', 'Wallet')}: </strong>
                                                    ${user.walletBalance?.toLocaleString() || '0'}
                                                </div>
                                                <div className="mt-1">
                                                    <strong>{t('logins', 'Logins')}: </strong>
                                                    {user.loginCount || 0}
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

            {/* Projects Modal */}
            {selectedUserProjects && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {t('projects_supported_by', 'Projects supported by')} {selectedUserProjects.userName}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeProjectsModal}></button>
                            </div>
                            <div className="modal-body">
                                {selectedUserProjects.projects && selectedUserProjects.projects.length > 0 ? (
                                    <ul className="list-group">
                                        {selectedUserProjects.projects.map((project) => (
                                            <li key={project._id} className="list-group-item d-flex align-items-center">
                                                <img
                                                    src={project.image || '/img/placeholder.png'}
                                                    alt={project.title}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                                    className="me-3"
                                                />
                                                <div>
                                                    <h6 className="mb-0">{project.title}</h6>
                                                    <small className="text-muted">{project.category}</small>
                                                </div>
                                                <Link to={`/projects/${project._id}`} className="btn btn-sm btn-outline-primary ms-auto">
                                                    {t('view', 'View')}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-muted">{t('no_projects_found', 'No projects found')}</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeProjectsModal}>
                                    {t('close', 'Close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserInfoPage;
