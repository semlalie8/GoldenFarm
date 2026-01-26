import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminLoginHistoryPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ daily: 0, weekly: 0, monthly: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('/api/analytics/logins', config);
                setLogs(data.logs);
                setStats(data.stats);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching login history:', error);
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userInfo]);

    return (
        <div className="dashboard-page" dir={currentDir}>
            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="dashboard-title">
                                {t('login_history', 'Login History')}
                            </h1>
                            <p className="dashboard-subtitle">
                                {t('login_history_subtitle', 'Monitor user access and security logs')}
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
                {/* Stats Row */}
                <div className="row g-4 mb-5">
                    <div className="col-lg-4 col-md-6">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="stat-details">
                                <h3 className="stat-label">{t('logins_today', 'Logins Today')}</h3>
                                <p className="stat-amount">{stats.daily}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                                <i className="fas fa-calendar-week"></i>
                            </div>
                            <div className="stat-details">
                                <h3 className="stat-label">{t('logins_week', 'Logins This Week')}</h3>
                                <p className="stat-amount">{stats.weekly}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#fff3e0', color: '#f57c00' }}>
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div className="stat-details">
                                <h3 className="stat-label">{t('logins_month', 'Logins This Month')}</h3>
                                <p className="stat-amount">{stats.monthly}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-header-custom mb-4">
                    <h2 className="section-title">
                        <i className={`fas fa-list-alt ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                        {t('recent_logins', 'Recent Logins')}
                    </h2>
                </div>

                <div className="transactions-card">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : logs.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table transaction-table">
                                <thead>
                                    <tr>
                                        <th>{t('user', 'User')}</th>
                                        <th>{t('role', 'Role')}</th>
                                        <th>{t('date', 'Date')}</th>
                                        <th>{t('time', 'Time')}</th>
                                        <th>{t('location', 'Location')}</th>
                                        <th>{t('distance', 'Distance')}</th>
                                        <th>{t('device', 'Device')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="user-avatar-placeholder me-2" style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '12px' }}>
                                                        {log.user?.name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">{log.user?.name || 'Unknown'}</div>
                                                        <small className="text-muted">{log.user?.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${log.user?.role === 'admin' ? 'bg-danger' :
                                                    ['superadmin', 'moderator'].includes(log.user?.role) ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                    {log.user?.role || 'User'}
                                                </span>
                                            </td>
                                            <td>{new Date(log.loginTime || log.createdAt).toLocaleDateString()}</td>
                                            <td>{new Date(log.loginTime || log.createdAt).toLocaleTimeString()}</td>
                                            <td>
                                                {log.city && log.country ? (
                                                    <div className="d-flex flex-column">
                                                        <span>
                                                            <i className="fas fa-map-marker-alt text-danger me-1"></i>
                                                            {log.city}, {log.country}
                                                        </span>
                                                        <small className="text-muted">{log.ipAddress}</small>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">{log.ipAddress || 'N/A'}</span>
                                                )}
                                            </td>
                                            <td>
                                                {typeof log.distanceFromHQ === 'number' ? (
                                                    <span className={`badge ${log.distanceFromHQ < 50 ? 'bg-success' : 'bg-info text-dark'}`}>
                                                        {log.distanceFromHQ} km
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <small className="text-muted" title={log.userAgent}>
                                                    {log.userAgent ? (
                                                        log.userAgent.includes('Mobi') ? (
                                                            <span><i className="fas fa-mobile-alt me-1"></i> Mobile</span>
                                                        ) : (
                                                            <span><i className="fas fa-desktop me-1"></i> Desktop</span>
                                                        )
                                                    ) : '-'}
                                                </small>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-history fa-3x"></i>
                            <h3>{t('no_logs_found', 'No login history found')}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLoginHistoryPage;
