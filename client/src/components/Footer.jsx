import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        // Apply RTL to footer when language is Arabic
        const isRTL = i18n.language === 'ar';
        const footer = document.getElementById('footer');
        if (footer) {
            footer.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        }
    }, [i18n.language]);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        alert(t('newsletter_success', 'Thank you for subscribing!'));
    };

    return (
        <>
            <footer className="gf-footer" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} id="footer">
                <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '40px' }}>
                    {/* 1️⃣ BRAND / ABOUT */}
                    <div className="footer-col fade-left">
                        <a className="footer-brand" href="/">
                            <img src="/img/logo.png" alt="logo" className="footer-logo" />
                            <div className="brand-text">
                                <span className="brand-main" data-translate="brand_main">Golden</span>
                                <span className="brand-sub" data-translate="brand_sub">Farm</span>
                            </div>
                        </a>
                        <p data-translate="footer_text" className="footer-desc">
                            {t('footer_text', 'Empowering Moroccan livestock farmers through transparent, sustainable, and community-based crowdfunding initiatives.')}
                        </p>
                    </div>

                    {/* 2️⃣ LOCATIONS */}
                    <div className="footer-col fade-center">
                        <h4 data-translate="footer_locations">{t('footer_locations', 'Locations')}</h4>
                        <ul className="footer-links">
                            <li><a href="#" data-translate="city_marrakech">{t('city_marrakech', 'Marrakech')}</a></li>
                            <li><a href="#" data-translate="city_fes">{t('city_fes', 'Fès')}</a></li>
                            <li><a href="#" data-translate="city_agadir">{t('city_agadir', 'Agadir')}</a></li>
                            <li><a href="#" data-translate="city_casablanca">{t('city_casablanca', 'Casablanca')}</a></li>
                            <li><a href="#" data-translate="city_rabat">{t('city_rabat', 'Rabat')}</a></li>
                        </ul>
                    </div>

                    {/* 3️⃣ SOCIAL / CONTACT */}
                    <div className="footer-col fade-right">
                        <h4 data-translate="footer_follow">{t('footer_follow', 'Follow Us')}</h4>
                        <div className="social-icons" aria-label="social links">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-tiktok"></i></a>
                            <a href="#"><i className="fab fa-snapchat-ghost"></i></a>
                        </div>

                        <div className="footer-contact">
                            <h4 data-translate="footer_contact">{t('footer_contact', 'Contact Us')}</h4>
                            <p>
                                <a href="tel:+212600000000" dir="ltr" style={{ display: 'inline-block' }}>+212 6 00 00 00 00</a>
                            </p>
                            <p>
                                <a href="mailto:contact@goldenfarm.ma">contact@goldenfarm.ma</a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4️⃣ NEWSLETTER (CENTERED ROW) */}
                <div className="container newsletter-row" style={{ textAlign: 'center', margin: '0 auto 40px auto', maxWidth: '600px' }}>
                    <h3 data-translate="newsletter_title" style={{ marginBottom: '10px' }}>{t('newsletter_title', 'Stay Updated')}</h3>
                    <p data-translate="newsletter_desc" style={{ marginBottom: '20px' }}>{t('newsletter_desc', 'Receive updates about new community farming projects.')}</p>
                    <form className="newsletter-form" onSubmit={handleNewsletterSubmit} style={{ display: 'flex', justifyContent: 'center' }}>
                        <input
                            type="email"
                            placeholder={t('newsletter_email_placeholder', 'example@gmail.com')}
                            required
                            style={{
                                borderRadius: i18n.language === 'ar' ? '0 30px 30px 0' : '30px 0 0 30px',
                                border: '1px solid #ccc',
                                padding: '10px 20px',
                                outline: 'none',
                                width: '100%'
                            }}
                        />
                        <button type="submit" data-translate="newsletter_btn" style={{
                            borderRadius: i18n.language === 'ar' ? '30px 0 0 30px' : '0 30px 30px 0',
                            background: 'linear-gradient(90deg, #d4a017, #f2c94c)',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 25px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}>
                            {t('newsletter_btn', 'Subscribe')}
                        </button>
                    </form>
                </div>

                <div className="footer-bottom" data-translate="footer_rights">
                    <span dir="ltr" style={{ display: 'inline-block' }}>© {new Date().getFullYear()} GoldenFarm.</span> {t('footer_rights', 'All Rights Reserved.')}
                </div>
            </footer>

            {/* ✅ Floating WhatsApp Button */}
            <a className="whatsapp-btn" href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
            </a>

            {/* ✅ SLIDE-IN DONATE BANNER */}
            <a href="/projects" className="donate-banner">
                <span>{t('donate_now', 'Donate Now')}</span>
            </a>
        </>
    );
};

export default Footer;
