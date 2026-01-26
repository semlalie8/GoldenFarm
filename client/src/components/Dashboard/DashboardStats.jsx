import React from 'react';
import { useTranslation } from 'react-i18next';

const DashboardStats = ({ stats }) => {
    const { t } = useTranslation();

    const statItems = [
        {
            label: t('dashboard_wallet_balance', 'Wallet Balance'),
            amount: `${stats.walletBalance.toLocaleString()} MAD`,
            icon: 'fa-wallet',
            colorClass: 'wallet-icon',
            change: t('dashboard_available', 'Available'),
            changeIcon: 'fa-arrow-up',
            changeType: 'positive'
        },
        {
            label: t('dashboard_total_invested', 'Total Invested'),
            amount: `${stats.totalInvested.toLocaleString()} MAD`,
            icon: 'fa-chart-line',
            colorClass: 'invested-icon',
            change: t('dashboard_in_projects', 'In Projects'),
            changeIcon: 'fa-seedling',
            changeType: 'neutral'
        },
        {
            label: t('dashboard_active_investments', 'Active Investments'),
            amount: stats.investmentCount,
            icon: 'fa-project-diagram',
            colorClass: 'projects-icon',
            change: t('dashboard_ongoing', 'Ongoing'),
            changeIcon: 'fa-check-circle',
            changeType: 'positive'
        }
    ];

    return (
        <div className="row g-4 mb-5">
            {statItems.map((item, idx) => (
                <div className="col-lg-4 col-md-6" key={idx}>
                    <div className="stat-card">
                        <div className={`stat-icon ${item.colorClass}`}>
                            <i className={`fas ${item.icon}`}></i>
                        </div>
                        <div className="stat-details">
                            <h3 className="stat-label">{item.label}</h3>
                            <p className="stat-amount">{item.amount}</p>
                            <span className={`stat-change ${item.changeType}`}>
                                <i className={`fas ${item.changeIcon}`}></i> {item.change}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
