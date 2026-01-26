import React from 'react';
import { FaUsers, FaCrosshairs, FaBullhorn, FaMagic } from 'react-icons/fa';

const MarketingKPIs = ({ stats, t }) => {
    return (
        <div className="m-grid">
            <div className="m-kpi-card">
                <div className="m-kpi-label"><FaUsers /> {t('audience_size', 'Total Audience Size')}</div>
                <div className="m-kpi-value">{stats?.funnel.visits.toLocaleString()}</div>
                <div className="m-kpi-sub" style={{ color: '#10b981' }}>
                    <i className="fas fa-arrow-up"></i> +12% vs last 30d
                </div>
            </div>
            <div className="m-kpi-card">
                <div className="m-kpi-label"><FaCrosshairs /> {t('conversion_rate', 'Lead-to-Sale Conversion')}</div>
                <div className="m-kpi-value">{stats?.funnel.conversionRate}%</div>
                <div className="m-kpi-sub" style={{ color: '#10b981' }}>
                    <i className="fas fa-arrow-up"></i> Top 5% of industry
                </div>
            </div>
            <div className="m-kpi-card">
                <div className="m-kpi-label"><FaBullhorn /> {t('marketing_roi', 'ROI (Blended)')}</div>
                <div className="m-kpi-value">4.2x</div>
                <div className="m-kpi-sub" style={{ color: '#10b981' }}>
                    <i className="fas fa-arrow-up"></i> LTV:CAC Ratio optimized
                </div>
            </div>
            <div className="m-kpi-card">
                <div className="m-kpi-label"><FaMagic /> {t('ai_predictions', 'AI Intelligence')}</div>
                <div className="m-kpi-value">{t('active', 'Active')}</div>
                <div className="m-kpi-sub" style={{ color: '#6366f1' }}>
                    8 opportunities found
                </div>
            </div>
        </div>
    );
};

export default MarketingKPIs;
