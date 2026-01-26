import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminBooksPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await axios.get('/api/content/books');
                setBooks(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching books:', error);
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete_book', 'Are you sure you want to delete this book?'))) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                await axios.delete(`/api/content/books/${id}`, config);
                setBooks(books.filter(b => b._id !== id));
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    return (
        <div className="dashboard-page" dir={currentDir}>
            <div className="dashboard-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="dashboard-title">{t('manage_books', 'Manage Books')}</h1>
                            <p className="dashboard-subtitle">{t('manage_books_subtitle', 'Manage educational books')}</p>
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
                        <i className={`fas fa-book ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                        {t('book_list', 'Book List')}
                    </h2>
                    <Link to="/books/new" className="btn btn-warning text-white">
                        <i className="fas fa-plus me-2"></i>
                        {t('add_new_book', 'Add New Book')}
                    </Link>
                </div>

                <div className="transactions-card">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : books.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table transaction-table">
                                <thead>
                                    <tr>
                                        <th>{t('book_title', 'Title')}</th>
                                        <th>{t('author', 'Author')}</th>
                                        <th>{t('actions', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map((book) => (
                                        <tr key={book._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {book.coverImage && (
                                                        <img
                                                            src={book.coverImage}
                                                            alt={book.title?.en || book.title}
                                                            style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }}
                                                            onError={(e) => { e.target.src = '/img/placeholder.png'; }}
                                                        />
                                                    )}
                                                    <span className="fw-bold">{book.title?.[i18n.language] || book.title?.en || book.title}</span>
                                                </div>
                                            </td>
                                            <td>{book.author || 'Unknown'}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Link to={`/books/edit/${book._id}`} className="btn btn-sm btn-warning text-white" title={t('edit', 'Edit')}>
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(book._id)}
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
                            <i className="fas fa-book-open fa-3x"></i>
                            <h3>{t('no_books_found', 'No books found')}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBooksPage;
