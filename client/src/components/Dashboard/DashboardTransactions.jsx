import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DashboardTransactions = ({ transactions, currentDir }) => {
    const { t } = useTranslation();

    return (
        <div className="row">
            <div className="col-12">
                <div className="transactions-card p-4" style={{ background: 'var(--bg-white)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                    <div className="card-header-custom d-flex justify-content-between align-items-center mb-4">
                        <h2 className="section-title mb-0">
                            <i className={`fas fa-history ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`} style={{ color: 'var(--accent-blue)' }}></i>
                            {t('dashboard_recent_transactions', 'Recent Transactions')}
                        </h2>
                        <Link to="/profile" className="view-all-link text-decoration-none" style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>
                            {t('dashboard_view_all', 'View All')} <i className={`fas fa-arrow-${currentDir === 'rtl' ? 'left' : 'right'} ${currentDir === 'rtl' ? 'me-2' : 'ms-2'}`}></i>
                        </Link>
                    </div>

                    {transactions && transactions.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table transaction-table align-middle">
                                <thead>
                                    <tr>
                                        <th>{t('dashboard_date', 'Date')}</th>
                                        <th>{t('dashboard_type', 'Type')}</th>
                                        <th>{t('dashboard_amount', 'Amount')}</th>
                                        <th>{t('dashboard_status', 'Status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.slice(0, 5).map((tx) => (
                                        <tr key={tx._id}>
                                            <td>
                                                <i className="far fa-calendar-alt me-2 text-muted"></i>
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="text-capitalize">{tx.type}</td>
                                            <td className="fw-bold">{tx.amount.toLocaleString()} MAD</td>
                                            <td>
                                                <span className={`badge ${tx.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state text-center py-5">
                            <i className="fas fa-inbox fa-3x mb-3 text-muted"></i>
                            <h3>{t('dashboard_no_transactions', 'No transactions yet')}</h3>
                            <p className="text-muted">{t('dashboard_no_transactions_desc', 'Your transaction history will appear here once you make your first investment.')}</p>
                            <Link to="/projects" className="btn btn-gold mt-3" style={{ background: 'var(--gold-gradient)' }}>
                                {t('dashboard_start_investing', 'Start Investing')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardTransactions;
