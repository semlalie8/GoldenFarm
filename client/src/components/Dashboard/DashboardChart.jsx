import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardChart = ({ stats, currentDir }) => {
    const { t } = useTranslation();

    const chartData = [
        { name: t('dashboard_wallet', 'Wallet'), amount: stats.walletBalance },
        { name: t('dashboard_invested', 'Invested'), amount: stats.totalInvested },
    ];

    return (
        <div className="row mb-5">
            <div className="col-12">
                <div className="chart-card p-4" style={{ background: 'var(--bg-white)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                    <div className="card-header-custom mb-4">
                        <h2 className="section-title">
                            <i className={`fas fa-chart-bar ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`} style={{ color: 'var(--accent-green)' }}></i>
                            {t('dashboard_financial_overview', 'Financial Overview')}
                        </h2>
                        <p className="section-subtitle">{t('dashboard_chart_desc', 'Your wallet and investment summary')}</p>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="name" tick={{ fill: 'var(--text-main)' }} />
                                <YAxis tick={{ fill: 'var(--text-main)' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-white)',
                                        border: '1px solid var(--accent-green)',
                                        borderRadius: '10px',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="amount" fill="var(--accent-green)" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardChart;
