import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ArticlesPage = () => {
    const { t, i18n } = useTranslation();
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data } = await axios.get('/api/content/articles');
                setArticles(data);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };
        fetchArticles();
    }, []);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    return (
        <div dir={currentDir}>
            {/* PAGE HEADER */}
            <section className="funding-header">
                <h1 data-translate="articles_page_title">{t('articles_page_title', 'Articles & Educational Insights')}</h1>
                <p data-translate="articles_page_sub">
                    {t('articles_page_sub', 'Short, practical reading to apply immediately on the field.')}
                </p>
            </section>

            {/* PROJECTS WRAPPER */}
            <div className="projects-wrapper">
                <div className="row g-4 justify-content-center">
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <div key={article._id} className="col-md-6 col-lg-3 col-xl-3 col-xxl-3 d-flex">
                                <div className="project-card w-100">
                                    <img
                                        src={article.image || '/img/placeholder.png'}
                                        alt={article.title?.[i18n.language] || article.title?.en || article.title}
                                    />
                                    <div className="p-3">
                                        <h5>{article.title?.[i18n.language] || article.title?.en || article.title}</h5>
                                        <p>{(() => {
                                            const content = article.content?.[i18n.language] || article.content?.en || article.content;
                                            return content ? content.substring(0, 100) + '...' : '';
                                        })()}</p>
                                        <Link to={`/articles/${article._id}`} className="fund-btn text-center text-decoration-none">
                                            {t('read_article_btn', 'Read Article')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center">
                            <p>{t('no_articles_found', 'No articles found.')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticlesPage;
