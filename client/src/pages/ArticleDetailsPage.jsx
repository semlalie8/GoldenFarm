import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../styles/article-details.css';

const ArticleDetailsPage = () => {
    const { id } = useParams();
    const { userInfo } = useSelector((state) => state.auth);
    const { t, i18n } = useTranslation();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const config = userInfo ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};
                const { data } = await axios.get(`/api/content/articles/${id}`, config);
                setArticle(data);
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };
        fetchArticle();
    }, [id, userInfo]);

    if (!article) return (
        <div className="article-details-page">
            <div className="article-header">
                <p>{t('loading', 'Loading...')}</p>
            </div>
        </div>
    );

    // Get the correct language version of title and content
    const displayTitle = article.title?.[i18n.language] || article.title?.en || article.title;
    const displayContent = article.content?.[i18n.language] || article.content?.en || article.content;

    return (
        <div className="article-details-page min-vh-100 bg-white py-5">
            <div className="container">
                <nav aria-label="breadcrumb" className="mb-5">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">{t('home', 'Home')}</Link></li>
                        <li className="breadcrumb-item"><Link to="/articles" className="text-decoration-none text-muted">{t('articles', 'Knowledge Lab')}</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{displayTitle}</li>
                    </ol>
                </nav>

                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8">
                        {/* Article Header */}
                        <header className="mb-5 text-center">
                            <span className="badge bg-gold bg-opacity-10 text-gold rounded-pill px-3 py-2 mb-4 text-uppercase fw-bold" style={{ fontSize: '0.7rem', color: '#cba135', border: '1px solid #cba135' }}>
                                {article.category || t('featured_insight', 'Featured Insight')}
                            </span>
                            <h1 className="display-4 fw-bold text-dark mb-4" style={{ letterSpacing: '-1px' }}>
                                {displayTitle}
                            </h1>
                            <div className="d-flex align-items-center justify-content-center gap-3 text-muted">
                                <span className="small fw-bold">{t('by', 'By')} <span className="text-dark">{article.author || 'Golden Farm Editorial'}</span></span>
                                <span className="opacity-25">|</span>
                                <span className="small">
                                    {new Date(article.createdAt).toLocaleDateString(i18n.language, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </header>

                        {/* Banner Image */}
                        {article.image && (
                            <div className="mb-5">
                                <img
                                    src={article.image}
                                    className="w-100 rounded-4 shadow-sm"
                                    alt={displayTitle}
                                    style={{ maxHeight: '550px', objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        {/* Article Body */}
                        <article className="article-content fs-5 text-muted" style={{ lineHeight: '1.8' }}>
                            <div dangerouslySetInnerHTML={{ __html: displayContent }}></div>
                        </article>

                        <hr className="my-5 opacity-10" />

                        <div className="d-flex justify-content-between align-items-center mt-5">
                            <Link to="/articles" className="btn btn-outline-dark rounded-pill px-4">
                                <i className={`fas fa-arrow-${i18n.dir() === 'rtl' ? 'right' : 'left'} me-2`}></i>
                                {t('back_to_articles', 'Back to Library')}
                            </Link>

                            <div className="social-share d-none d-md-flex align-items-center gap-3">
                                <span className="small text-muted text-uppercase fw-bold">{t('share_insight', 'Share Insight')}</span>
                                <button className="btn btn-sm btn-light rounded-circle shadow-sm" style={{ width: '36px', height: '36px' }}><i className="fab fa-facebook-f"></i></button>
                                <button className="btn btn-sm btn-light rounded-circle shadow-sm" style={{ width: '36px', height: '36px' }}><i className="fab fa-twitter"></i></button>
                                <button className="btn btn-sm btn-light rounded-circle shadow-sm" style={{ width: '36px', height: '36px' }}><i className="fab fa-linkedin-in"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetailsPage;
