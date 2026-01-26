import React from 'react';
import { useTranslation } from 'react-i18next';

const UserDetailsStats = ({ user }) => {
    const { t } = useTranslation();

    return (
        <div className="row g-4 mb-4">
            <div className="col-md-3">
                <div className="stat-card bg-white p-3 rounded shadow-sm h-100">
                    <div className="text-muted small text-uppercase fw-bold mb-1">{t('wallet_balance', 'Wallet Balance')}</div>
                    <h3 className="text-success mb-0" style={{ color: 'var(--accent-green)' }}>{user.walletBalance?.toLocaleString() || 0} MAD</h3>
                </div>
            </div>
            <div className="col-md-3">
                <div className="stat-card bg-white p-3 rounded shadow-sm h-100">
                    <div className="text-muted small text-uppercase fw-bold mb-1">{t('total_logins', 'Total Logins')}</div>
                    <h3 className="text-primary mb-0" style={{ color: 'var(--accent-blue)' }}>{user.loginHistory?.length || 0}</h3>
                </div>
            </div>
            <div className="col-md-3">
                <div className="stat-card bg-white p-3 rounded shadow-sm h-100">
                    <div className="text-muted small text-uppercase fw-bold mb-1">{t('joined_date', 'Joined Date')}</div>
                    <h5 className="text-dark mb-0">{new Date(user.createdAt).toLocaleDateString()}</h5>
                </div>
            </div>
            <div className="col-md-3">
                <div className="stat-card bg-white p-3 rounded shadow-sm h-100">
                    <div className="text-muted small text-uppercase fw-bold mb-1">{t('status', 'Status')}</div>
                    <h5 className="text-dark mb-0">
                        {user.isEmailVerified ? (
                            <span className="text-success"><i className="fas fa-check-circle me-1"></i> Verified</span>
                        ) : (
                            <span className="text-warning"><i className="fas fa-exclamation-circle me-1"></i> Unverified</span>
                        )}
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsStats;
