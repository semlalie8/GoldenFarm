import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminArticlesPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data } = await axios.get('/api/content/articles');
                setArticles(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete_article', 'Are you sure you want to delete this article?'))) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                await axios.delete(`/api/content/articles/${id}`, config);
                setArticles(articles.filter(a => a._id !== id));
            } catch (error) {
                console.error('Error deleting article:', error);
            }
        }
    };

    return (
        <div className="dashboard-page" dir={currentDir}>
            <div className="dashboard-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="dashboard-title">{t('manage_articles', 'Manage Articles')}</h1>
                            <p className="dashboard-subtitle">{t('manage_articles_subtitle', 'Manage educational articles')}</p>
                        </div>
                        <div className="col-lg-4 text-end">
                            <Link to="/admin" className="btn btn-outline-light">
                                <i className={`fas fa-arrow-${currentDir === 'rtl' ? 'right' : 'left'} me-2`}></i>
                                {t('back_to_dashboard', 'Back to Dashboard')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container dashboard-content">
                <div className="card-header-custom mb-4">
                    <h2 className="section-title">
                        <i className={`fas fa-file-alt ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                        {t('article_list', 'Article List')}
                    </h2>
                    <Link to="/articles/new" className="btn btn-warning text-white">
                        <i className="fas fa-plus me-2"></i>
                        {t('add_new_article', 'Add New Article')}
                    </Link>
                </div>

                <div className="transactions-card">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : articles.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table transaction-table">
                                <thead>
                                    <tr>
                                        <th>{t('article_title', 'Title')}</th>
                                        <th>{t('content_preview', 'Content Preview')}</th>
                                        <th>{t('actions', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.map((article) => (
                                        <tr key={article._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {article.image && (
                                                        <img
                                                            src={article.image}
                                                            alt={article.title?.en || article.title}
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }}
                                                            onError={(e) => { e.target.src = '/img/placeholder.png'; }}
                                                        />
                                                    )}
                                                    <span className="fw-bold">{article.title?.[i18n.language] || article.title?.en || article.title}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {(() => {
                                                    const content = article.content?.[i18n.language] || article.content?.en || article.content;
                                                    return typeof content === 'string' ? content.substring(0, 50) + '...' : '';
                                                })()}
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Link to={`/articles/edit/${article._id}`} className="btn btn-sm btn-warning text-white" title={t('edit', 'Edit')}>
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(article._id)}
                                                        title={t('delete', 'Delete')}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-newspaper fa-3x"></i>
                            <h3>{t('no_articles_found', 'No articles found')}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default AdminArticlesPage;
