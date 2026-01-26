import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutServices = ({ currentDir }) => {
    const { t } = useTranslation();

    const allServices = [
        { icon: 'fa-hand-holding-dollar', title: t('service1_title', 'Project Funding'), text: t('service1_desc', 'Supporting farmers through transparent crowdfunding.') },
        { icon: 'fa-chart-line', title: t('service2_title', 'Progress Tracking'), text: t('service2_desc', 'Real-time updates on project milestones and growth.') },
        { icon: 'fa-users', title: t('service3_title', 'Community Growth'), text: t('service3_desc', 'Fostering collaboration between rural and urban communities.') },
        { icon: 'fa-seedling', title: t('service4_title', 'Sustainable Practices'), text: t('service4_desc', 'Promoting eco-friendly and regenerative agriculture.') },
        { icon: 'fa-handshake', title: t('service5_title', 'Partner Collaboration'), text: t('service5_desc', 'Working with local co-ops to ensure project success.') },
        { icon: 'fa-graduation-cap', title: t('service6_title', 'Training & Education'), text: t('service6_desc', 'Empowering farmers with modern knowledge and tools.') },
        { icon: 'fa-store', title: t('service7_title', 'Marketplace Integration'), text: t('service7_desc', 'Connecting farmers directly to premium markets.') },
        { icon: 'fa-seedling', title: t('service8_title', 'Reinvestment & Expansion'), text: t('service8_desc', 'Scaling successful models for maximum impact.') },
        { icon: 'fa-chart-pie', title: t('service9_title', 'Profit-Sharing Models'), text: t('service9_desc', 'Fair distribution of returns for all stakeholders.') }
    ];

    const chunks = [];
    for (let i = 0; i < allServices.length; i += 3) {
        chunks.push(allServices.slice(i, i + 3));
    }

    return (
        <section className="services-section py-5" dir={currentDir}>
            <div className="services-bg">
                <img src="/img/land-scape.png" alt="Rural farmland" />
            </div>
            <div className="services-overlay" style={{ background: 'rgba(15, 23, 42, 0.85)' }}></div>

            <div className="services-container container position-relative z-index-1">
                <h2 className="text-center mb-5 text-white" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {t('services_core_title', 'Our Core Services')}
                </h2>

                <div id="servicesCarousel" className="carousel slide" data-bs-ride="false">
                    <div className="carousel-inner">
                        {chunks.map((chunk, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <div className="row g-4 justify-content-center">
                                    {chunk.map((service, sIdx) => (
                                        <div key={sIdx} className="col-lg-4 col-md-6">
                                            <div className="services-item p-4 text-center h-100" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: 'var(--border-radius-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <div className="services-icon mb-3" style={{ fontSize: '2.5rem', color: 'var(--secondary-gold)' }}>
                                                    <i className={`fas ${service.icon}`}></i>
                                                </div>
                                                <h3 className="text-white h5 mb-3">{service.title}</h3>
                                                <p className="text-white-50 small">{service.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#servicesCarousel" data-bs-slide="prev">
                        <span className="arrow" aria-hidden="true" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', padding: '10px' }}><i className="fa-solid fa-chevron-left text-white"></i></span>
                        <span className="visually-hidden">{t('prev', 'Previous')}</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#servicesCarousel" data-bs-slide="next">
                        <span className="arrow" aria-hidden="true" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', padding: '10px' }}><i className="fa-solid fa-chevron-right text-white"></i></span>
                        <span className="visually-hidden">{t('next', 'Next')}</span>
                    </button>

                    <div className="carousel-indicators mt-4 position-relative">
                        {chunks.map((_, idx) => (
                            <button key={idx} type="button" data-bs-target="#servicesCarousel" data-bs-slide-to={idx} className={idx === 0 ? 'active' : ''}></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutServices;
