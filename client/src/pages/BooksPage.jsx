import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const BooksPage = () => {
    const { t, i18n } = useTranslation();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await axios.get('/api/content/books');
                setBooks(data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    return (
        <div dir={currentDir}>
            {/* PAGE HEADER */}
            <section className="funding-header">
                <h1 data-translate="books_page_title">{t('books_page_title', 'Books & Guides')}</h1>
                <p data-translate="books_page_sub">
                    {t('books_page_sub', 'Download comprehensive PDF guides and agricultural manuals.')}
                </p>
            </section>

            {/* PROJECTS WRAPPER */}
            <div className="projects-wrapper">
                <div className="row g-4 justify-content-center">
                    {books.length > 0 ? (
                        books.map((book) => (
                            <div key={book._id} className="col-md-6 col-lg-3 col-xl-3 col-xxl-3 d-flex">
                                <div className="project-card w-100">
                                    <img
                                        src={book.coverImage || '/img/placeholder.png'}
                                        alt={book.title?.[i18n.language] || book.title?.en || book.title}
                                    />
                                    <div className="p-3">
                                        <h5>{book.title?.[i18n.language] || book.title?.en || book.title}</h5>
                                        <p>{(() => {
                                            const desc = book.description?.[i18n.language] || book.description?.en || book.description;
                                            return desc ? desc.substring(0, 100) + '...' : '';
                                        })()}</p>
                                        <a
                                            href={book.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="fund-btn text-center text-decoration-none"
                                        >
                                            {t('download_book_btn', 'Download PDF')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center">
                            <p>{t('no_books_found', 'No books found.')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BooksPage;
