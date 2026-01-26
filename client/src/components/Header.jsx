import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../redux/slices/authSlice';
import CartIcon from './CartIcon';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const changeLanguage = (lng) => {
        // 1. Start Fade Out Animation
        document.body.classList.add('fade-out');

        // 2. Wait for fade out to complete (400ms)
        setTimeout(() => {
            // 3. Change Language
            i18n.changeLanguage(lng);

            // Update document direction for RTL languages
            const isRTL = lng === 'ar';
            const direction = isRTL ? 'rtl' : 'ltr';

            // Apply to document
            document.body.dir = direction;
            document.documentElement.dir = direction;
            document.body.setAttribute('dir', direction);

            // Apply to specific sections that need RTL
            const sections = [
                '.featured-projects',
                '.gf-footer',
                '#footer',
                '.projects-section',
                '.hero-header',
                '.navbar',
                'main'
            ];

            sections.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.setAttribute('dir', direction));
            });

            // 4. Fade In (remove class)
            setTimeout(() => {
                document.body.classList.remove('fade-out');
            }, 50); // Small delay to ensure DOM update is ready

        }, 400); // Matches CSS transition duration
    };

    useEffect(() => {
        // Set initial direction based on current language
        const isRTL = i18n.language === 'ar';
        const direction = isRTL ? 'rtl' : 'ltr';

        document.body.dir = direction;
        document.documentElement.dir = direction;
        document.body.setAttribute('dir', direction);
    }, [i18n.language]);

    const logoutHandler = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="/img/logo.png" alt="logo" />
                    <div className="brand-text">
                        <span className="brand-main">Golden</span>
                        <span className="brand-sub">Farm</span>
                    </div>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">{t('nav_home', 'Home')}</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">{t('nav_about', 'About')}</Link>
                        </li>


                        {/* Services Dropdown */}
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle d-flex align-items-center gap-1" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <span>{t('nav_gallery', 'Services')}</span>
                            </a>
                            <ul className={`dropdown-menu ${i18n.language === 'ar' ? 'text-end' : ''}`}
                                style={{
                                    textAlign: i18n.language === 'ar' ? 'right' : 'left'
                                }}>
                                <li><Link className="dropdown-item" to="/projects">{t('project_funding', 'Project Funding')}</Link></li>
                                <li><Link className="dropdown-item" to="/marketplace">{t('marketplace_integration', 'Marketplace')}</Link></li>
                            </ul>
                        </li>

                        {/* Training & Education Dropdown */}
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle d-flex align-items-center gap-1" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <span>{t('training_education', 'Training & Education')}</span>
                            </a>
                            <ul className={`dropdown-menu ${i18n.language === 'ar' ? 'text-end' : ''}`}
                                style={{
                                    textAlign: i18n.language === 'ar' ? 'right' : 'left'
                                }}>
                                <li><Link className="dropdown-item" to="/videos">{t('video_courses', 'Video Courses')}</Link></li>
                                <li><Link className="dropdown-item" to="/books">{t('pdf_courses', 'Books')}</Link></li>
                                <li><Link className="dropdown-item" to="/articles">{t('articles', 'Articles')}</Link></li>
                            </ul>
                        </li>




                        {/* Cart Icon */}
                        <li className="nav-item me-2">
                            <CartIcon />
                        </li>

                        {/* Join Us Dropdown */}
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle d-flex align-items-center gap-1" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    border: '2px solid #7DC242',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img
                                        src={userInfo?.avatar && userInfo.avatar !== 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' ? userInfo.avatar : "/img/farmer-avatar.png"}
                                        alt={t('nav_join', 'Join us')}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transform: 'scale(1.2)'
                                        }}
                                    />
                                </div>
                            </a>
                            <ul className={`dropdown-menu ${i18n.language === 'ar' ? 'text-end' : ''}`}
                                style={{
                                    textAlign: i18n.language === 'ar' ? 'right' : 'left'
                                }}>
                                {!userInfo ? (
                                    <>
                                        <li><Link className="dropdown-item" to="/login">{t('join_signin', 'Sign in')}</Link></li>
                                        <li><Link className="dropdown-item" to="/register">{t('join_signup', 'Sign up')}</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link className="dropdown-item" to="/profile">{t('join_profile', 'Profile')}</Link></li>
                                        {userInfo.role === 'admin' ? (
                                            <li><Link className="dropdown-item" to="/admin">Admin Dashboard</Link></li>
                                        ) : (
                                            <>
                                                <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                                                <li><Link className="dropdown-item" to="/smart-farm">Smart Farm Intelligence</Link></li>
                                            </>
                                        )}
                                        {userInfo.role === 'admin' && (
                                            <>
                                                <li><Link className="dropdown-item" to="/admin/crm/leads">CRM Hub</Link></li>
                                                <li><Link className="dropdown-item" to="/admin/finance/ledger">Finance Hub</Link></li>
                                            </>
                                        )}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button className="dropdown-item" onClick={logoutHandler} style={{ textAlign: 'inherit' }}>Logout</button></li>
                                    </>
                                )}
                            </ul>
                        </li>

                        {/* Contact CTA Button - Moved after Avatar */}
                        <li className="nav-item ms-lg-3">
                            <Link className="btn btn-gold px-4 py-2" to="/contact" style={{
                                borderRadius: '100px',
                                fontSize: '11px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                boxShadow: '0 4px 15px rgba(212, 160, 23, 0.2)'
                            }}>
                                {t('nav_contact', 'Contact')}
                            </Link>
                        </li>

                        {/* Language Dropdown */}
                        <li className="nav-item dropdown" id="languageDropdown">
                            <a className="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown">
                                <img id="selectedFlag" src={
                                    i18n.language === 'ar' ? 'https://flagcdn.com/w20/ma.png' :
                                        i18n.language === 'fr' ? 'https://flagcdn.com/w20/fr.png' :
                                            'https://flagcdn.com/w20/gb.png'
                                } width="20" height="15" alt="flag" />
                                <span id="selectedLang">
                                    {i18n.language === 'ar' ? 'العربية' :
                                        i18n.language === 'fr' ? 'Français' :
                                            'English'}
                                </span>
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-end ${i18n.language === 'ar' ? 'text-end' : ''}`}
                                style={{
                                    textAlign: i18n.language === 'ar' ? 'right' : 'left'
                                }}>
                                <li>
                                    <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => changeLanguage('ar')}>
                                        <img src="https://flagcdn.com/w20/ma.png" width="20" height="15" alt="Arabic" />
                                        العربية
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => changeLanguage('fr')}>
                                        <img src="https://flagcdn.com/w20/fr.png" width="20" height="15" alt="French" />
                                        Français
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => changeLanguage('en')}>
                                        <img src="https://flagcdn.com/w20/gb.png" width="20" height="15" alt="English" />
                                        English
                                    </button>
                                </li>
                            </ul>
                        </li>

                        {/* Neural Core Icon - Moved to after language */}
                        {userInfo && (
                            <li className="nav-item ms-lg-3">
                                <Link className="neural-core-nav-btn" to="/smart-farm" title={t('nav_intelligence_core', 'Neural Core')}>
                                    <i className="fas fa-brain"></i>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
