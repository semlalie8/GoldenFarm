import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutStory = ({ currentDir }) => {
    const { t } = useTranslation();

    return (
        <section className="about-section" dir={currentDir}>
            <div className="about-header text-start mb-5">
                <h2 data-translate="about_title" style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {t('about_title', 'About GoldenFarm')}
                </h2>
                <p data-translate="about_subtitle" style={{ maxWidth: '800px', color: 'var(--text-muted)', textAlign: 'left' }}>
                    {t('about_subtitle', 'GoldenFarm bridges Morocco’s rural traditions with digital finance — turning community livestock projects into sustainable opportunities for impact-driven investors.')}
                </p>
            </div>

            <div className="about-content row align-items-center g-0 justify-content-start" style={{ columnGap: '5px' }}>
                <div className="col-lg-6">
                    <img src="/img/about.png" alt="Moroccan farmers with livestock" className="img-fluid rounded-lg shadow-lg" style={{ borderRadius: 'var(--border-radius-lg)' }} />
                </div>
                <div className="col-lg-6 about-text">
                    <h3 className="mb-4" style={{ color: 'var(--primary-gold)' }}>{t('about_story_title', 'Our Story')}</h3>
                    <div className="story-paragraphs" style={{ lineHeight: '1.8' }}>
                        {[1, 2, 3, 4, 5].map(num => (
                            <p key={num} className="mb-3">
                                {t(`about_story_p${num}`, '')}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutStory;
