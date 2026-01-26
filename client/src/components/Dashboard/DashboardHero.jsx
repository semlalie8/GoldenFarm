import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DashboardHero = ({ userName, currentDir }) => {
    const { t } = useTranslation();

    return (
        <div className="dashboard-hero">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <h1 className="dashboard-title">
                            {t('dashboard_welcome', 'Welcome back')}, <span className="user-name">{userName}</span>!
                        </h1>
                        <p className="dashboard-subtitle">
                            {t('dashboard_subtitle', "Here's an overview of your agricultural investments and activities")}
                        </p>
                    </div>
                    <div className="col-lg-4 text-end">
                        <Link to="/projects" className="btn btn-gold btn-lg" style={{ background: 'var(--gold-gradient)' }}>
                            <i className={`fas fa-plus ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                            {t('dashboard_new_investment', 'Explore Projects')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHero;
