import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { recordActivity } from '../utils/activityTracker';

const BookDetailsPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const { data } = await axios.get(`/api/content/books/${id}`);
                setBook(data);
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };
        fetchBook();
    }, [id]);

    const handleDownload = () => {
        if (userInfo) {
            recordActivity('download_book', id, 'Book', `Downloaded book: ${book.title}`, userInfo.token);
        }
    };

    if (!book) return <div>Loading...</div>;

    return (
        <div className="book-details-page min-vh-100 bg-light py-5">
            <div className="container">
                <nav aria-label="breadcrumb" className="mb-5">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">{t('home', 'Home')}</Link></li>
                        <li className="breadcrumb-item"><Link to="/knowledge" className="text-decoration-none text-muted">{t('knowledge_center', 'Knowledge Center')}</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{book.title?.[i18n.language] || book.title?.en || book.title}</li>
                    </ol>
                </nav>

                <div className="row g-5">
                    {/* Book Cover */}
                    <div className="col-lg-4 text-center">
                        <div className="book-cover-container position-sticky" style={{ top: '100px' }}>
                            <img
                                src={book.coverImage || '/img/placeholder.png'}
                                alt={book.title?.[i18n.language] || book.title?.en || book.title}
                                className="img-fluid rounded-3 shadow-lg mb-4"
                                style={{ maxWidth: '320px', transition: 'transform 0.3s ease' }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                            <div className="d-grid gap-2 mt-4">
                                <a
                                    href={book.downloadUrl}
                                    className="btn btn-lg rounded-pill shadow-sm text-white"
                                    style={{ backgroundColor: '#cba135', borderColor: '#cba135' }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleDownload}
                                >
                                    <i className="fas fa-download me-2"></i> {t('download_pdf', 'Download Full Guide')}
                                </a>
                                <p className="text-muted small mt-2">
                                    <i className="fas fa-lock me-1"></i> {t('secure_download', 'Secure PDF Access')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                            <div className="mb-4">
                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 mb-3 text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                                    {book.category || t('agricultural_knowledge', 'Agricultural Library')}
                                </span>
                                <h1 className="h1 fw-bold text-dark mb-2">
                                    {book.title?.[i18n.language] || book.title?.en || book.title}
                                </h1>
                                <p className="h5 text-muted fw-normal">{t('by', 'By')} <span className="text-dark fw-bold">{book.author || 'Golden Farm Experts'}</span></p>
                            </div>

                            <hr className="my-4 opacity-10" />

                            <div className="book-summary">
                                <h3 className="h6 fw-bold text-muted text-uppercase mb-4 ls-wider" style={{ letterSpacing: '0.1em' }}>
                                    {t('abstract_synopsis', 'Abstract & Synopsis')}
                                </h3>
                                <div className="text-muted fs-5" style={{ lineHeight: '1.8' }}>
                                    {book.description?.[i18n.language] || book.description?.en || book.description}
                                </div>
                            </div>

                            <div className="mt-5 p-4 bg-light rounded-4 border border-light">
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <i className="fas fa-file-pdf text-danger"></i>
                                            </div>
                                            <div>
                                                <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Format</small>
                                                <span className="fw-bold">Digital PDF</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <i className="fas fa-globe text-primary"></i>
                                            </div>
                                            <div>
                                                <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Language</small>
                                                <span className="fw-bold">{i18n.language === 'fr' ? 'Français' : i18n.language === 'ar' ? 'العربية' : 'English'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailsPage;
