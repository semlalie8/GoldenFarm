import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const UserDetailsTabs = ({ user }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
                <ul className="nav nav-tabs card-header-tabs">
                    {['overview', 'activity', 'transactions', 'logins'].map((tab) => (
                        <li className="nav-item" key={tab}>
                            <button
                                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                <i className={`fas ${tab === 'overview' ? 'fa-user' : tab === 'activity' ? 'fa-history' : tab === 'transactions' ? 'fa-exchange-alt' : 'fa-sign-in-alt'} me-2`}></i>
                                {t(tab, tab.charAt(0).toUpperCase() + tab.slice(1))}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="card-body">
                {activeTab === 'overview' && (
                    <div className="row">
                        <div className="col-md-6">
                            <h5 className="mb-3 border-bottom pb-2">{t('contact_info', 'Contact Information')}</h5>
                            <div className="mb-3">
                                <label className="text-muted small d-block">Email</label>
                                <span className="fw-medium">{user.email}</span>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small d-block">Phone</label>
                                <span className="fw-medium">{user.phone || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h5 className="mb-3 border-bottom pb-2">{t('personal_details', 'Personal Details')}</h5>
                            <div className="mb-3">
                                <label className="text-muted small d-block">City</label>
                                <span className="fw-medium">{user.city || 'N/A'}</span>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small d-block">Profession</label>
                                <span className="fw-medium">{user.profession || 'N/A'}</span>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small d-block">Language</label>
                                <span className="fw-medium text-uppercase">{user.language}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="activity-timeline">
                        {user.timeline && user.timeline.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {user.timeline.map((item) => (
                                    <div key={item._id} className="list-group-item">
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className={`me-3 rounded-circle d-flex align-items-center justify-content-center text-white`}
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor:
                                                            item.kind === 'transaction'
                                                                ? (item.type === 'deposit' || item.type === 'payout' ? 'var(--accent-green)' : 'var(--accent-red)')
                                                                : (item.type === 'view_project' ? '#fd7e14' : 'var(--accent-blue)')
                                                    }}>
                                                    <i className={`fas ${item.kind === 'transaction'
                                                        ? 'fa-dollar-sign'
                                                        : (item.type === 'view_article' ? 'fa-newspaper'
                                                            : item.type === 'watch_video' ? 'fa-video'
                                                                : item.type === 'download_book' ? 'fa-book'
                                                                    : 'fa-eye')
                                                        }`}></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 text-capitalize">
                                                        {item.kind === 'transaction' ? (
                                                            <span>
                                                                {item.type} <span className="fw-bold">{item.amount} MAD</span>
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                {item.type.replace('_', ' ')}
                                                                {item.item && <span className="text-primary mx-1">"{item.item.title || item.item.name}"</span>}
                                                            </span>
                                                        )}
                                                    </h6>
                                                    <small className="text-muted">{item.kind === 'transaction' ? `Status: ${item.status}` : (item.details || item.itemModel)}</small>
                                                </div>
                                            </div>
                                            <small className="text-muted">{new Date(item.createdAt).toLocaleString()}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted text-center py-4">{t('no_activity', 'No activity recorded yet.')}</p>
                        )}
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="table-responsive">
                        {user.transactions && user.transactions.length > 0 ? (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Reference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.transactions.map((tx) => (
                                        <tr key={tx._id}>
                                            <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                            <td className="text-capitalize">{tx.type}</td>
                                            <td className={tx.type === 'deposit' || tx.type === 'payout' ? 'text-success' : 'text-danger'}>
                                                {tx.amount} MAD
                                            </td>
                                            <td>
                                                <span className={`badge ${tx.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="small text-muted">{tx.referenceId || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted text-center py-4">{t('no_transactions', 'No transactions found.')}</p>
                        )}
                    </div>
                )}

                {activeTab === 'logins' && (
                    <div className="table-responsive">
                        {user.loginHistory && user.loginHistory.length > 0 ? (
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Location</th>
                                        <th>IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.loginHistory.map((login) => (
                                        <tr key={login._id}>
                                            <td>{new Date(login.loginTime).toLocaleString()}</td>
                                            <td>
                                                {login.city ? (
                                                    <span><i className="fas fa-map-marker-alt text-danger me-1"></i> {login.city}, {login.country}</span>
                                                ) : (
                                                    <span className="text-muted">Unknown</span>
                                                )}
                                            </td>
                                            <td className="text-monospace small">{login.ipAddress}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted text-center py-4">{t('no_logins', 'No login history found.')}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetailsTabs;
