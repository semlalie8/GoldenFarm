import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DashboardQuickAccess = ({ currentDir }) => {
    const { t } = useTranslation();

    return (
        <div className="row mb-5">
            <div className="col-12">
                <div className="card-header-custom mb-4">
                    <h2 className="section-title">
                        <i className={`fas fa-th-large ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                        {t('dashboard_quick_access', 'Quick Access')}
                    </h2>
                    <p className="section-subtitle">{t('dashboard_quick_access_desc', 'Explore our services and educational resources')}</p>
                </div>
            </div>

            <div className="col-12 mb-3">
                <h5 style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '16px', fontSize: '1.1rem' }}>
                    <i className={`fas fa-briefcase ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`} style={{ color: 'var(--accent-green)' }}></i>
                    {t('nav_gallery', 'Services')}
                </h5>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
                <Link to="/projects" className="quick-access-card">
                    <div className="qa-icon projects-funding-icon"><i className="fas fa-hand-holding-usd"></i></div>
                    <h4>{t('project_funding', 'Project Funding')}</h4>
                    <p>{t('funding_desc', 'Support sustainable farming projects')}</p>
                    <span className="qa-arrow"><i className={`fas fa-arrow-${currentDir === 'rtl' ? 'left' : 'right'}`}></i></span>
                </Link>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
                <Link to="/smart-farm" className="quick-access-card" style={{ border: '2px solid var(--accent-blue)', background: 'linear-gradient(to bottom right, #f8fafc, #eff6ff)' }}>
                    <div className="qa-icon" style={{ background: 'var(--accent-blue)', color: 'white' }}><i className="fas fa-brain"></i></div>
                    <h4 style={{ color: 'var(--accent-blue)' }}>{t('smart_farm_intel', 'Neural Intelligence')}</h4>
                    <p>{t('smart_farm_desc', 'Autonomous asset orchestration & AI insights')}</p>
                    <span className="qa-arrow"><i className={`fas fa-arrow-${currentDir === 'rtl' ? 'left' : 'right'}`}></i></span>
                </Link>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
                <Link to="/marketplace" className="quick-access-card">
                    <div className="qa-icon marketplace-icon"><i className="fas fa-store"></i></div>
                    <h4>{t('marketplace_integration', 'Marketplace')}</h4>
                    <p>{t('dashboard_marketplace_desc', 'Browse agricultural products')}</p>
                    <span className="qa-arrow"><i className={`fas fa-arrow-${currentDir === 'rtl' ? 'left' : 'right'}`}></i></span>
                </Link>
            </div>

            <div className="col-12 mb-3 mt-2">
                <h5 style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '16px', fontSize: '1.1rem' }}>
                    <i className={`fas fa-graduation-cap ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`} style={{ color: 'var(--accent-green)' }}></i>
                    {t('training_education', 'Training & Education')}
                </h5>
            </div>

            {[
                { to: "/videos", icon: 'fa-video', class: 'video-icon', title: t('video_courses', 'Video Courses'), desc: t('dashboard_videos_desc', 'Watch educational videos') },
                { to: "/books", icon: 'fa-book', class: 'books-icon', title: t('pdf_courses', 'Books'), desc: t('dashboard_books_desc', 'Download PDF guides') },
                { to: "/articles", icon: 'fa-newspaper', class: 'articles-icon', title: t('articles', 'Articles'), desc: t('dashboard_articles_desc', 'Read helpful articles') }
            ].map((item, idx) => (
                <div className="col-lg-4 col-md-6 mb-4" key={idx}>
                    <Link to={item.to} className="quick-access-card">
                        <div className={`qa-icon ${item.class}`}><i className={`fas ${item.icon}`}></i></div>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                        <span className="qa-arrow"><i className={`fas fa-arrow-${currentDir === 'rtl' ? 'left' : 'right'}`}></i></span>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default DashboardQuickAccess;
