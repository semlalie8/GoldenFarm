import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomeFeaturedServices = ({ currentDir }) => {
    const { t } = useTranslation();

    const services = [
        {
            title: t('funding_title', 'Project Funding'),
            desc: t('funding_desc', 'Supporting farmers and bringing sustainable agricultural projects to life through inclusive funding solutions.'),
            link: '/projects',
            icon: '/img/Funding.png',
            iconClass: 'fa-compass'
        },
        {
            title: t('market_title', 'Marketplace'),
            desc: t('market_desc', 'We connect rural farmers directly to buyers through transparent, fair-trade digital marketplaces.'),
            link: '/marketplace',
            icon: '/img/Market.png',
            iconClass: 'fa-compass'
        }
    ];

    return (
        <section className="featured-projects" aria-label="Featured Projects" dir={currentDir}>
            <h2 className="section-title" data-translate="featured_title">
                {t('featured_title', 'Featured Services')}
            </h2>

            <div className="project-container">
                {services.map((service, idx) => (
                    <div className="project-box fade-item" key={idx}>
                        <div className="project-info">
                            <h3 data-translate="funding_title">{service.title}</h3>
                            <p data-translate="funding_desc">{service.desc}</p>
                            <Link to={service.link} className="project-btn" style={{ background: 'var(--gold-gradient)' }}>
                                <i className={`fa-solid ${service.iconClass} ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                                <span data-translate="discover_btn">{t('discover_btn', 'Discover')}</span>
                            </Link>
                        </div>
                        <div className="project-icon">
                            <img src={service.icon} alt={service.title} />
                        </div>
                    </div>
                ))}

                <div className="project-box fade-item" style={{ gridColumn: '1 / -1' }}>
                    <div className="project-info">
                        <h3 data-translate="training_title">{t('training_title', 'Training & Education')}</h3>
                        <p data-translate="training_desc2">
                            {t('training_desc2', 'Empower farmers with agricultural knowledge, practical tutorials, and financial literacy courses.')}
                        </p>

                        <div className="multi-btn-group">
                            {[
                                { to: '/videos', icon: 'fa-video', label: t('video_btn', 'Videos') },
                                { to: '/books', icon: 'fa-book', label: t('book_btn', 'Books') },
                                { to: '/articles', icon: 'fa-newspaper', label: t('article_btn', 'Articles') }
                            ].map((btn, idx) => (
                                <Link to={btn.to} className="multi-btn" key={idx}>
                                    <i className={`fa-solid ${btn.icon} ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                                    <span data-translate="video_btn">{btn.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="project-icon">
                        <img src="/img/Training.png" alt="Training & Education Icon" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeFeaturedServices;
