import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import HomeHero from '../components/Home/HomeHero';
import HomeFeaturedServices from '../components/Home/HomeFeaturedServices';
import HomeShowcaseCarousel from '../components/Home/HomeShowcaseCarousel';
import SEO from '../components/SEO';
import { Brain, Database, Activity, Cpu } from 'lucide-react';
import { Container } from 'react-bootstrap';
import '../styles/featured-projects.css';

const HomePage = () => {
    const { t, i18n } = useTranslation();
    const [showcaseData, setShowcaseData] = useState({
        projects: [],
        products: [],
        books: [],
        videos: [],
        articles: []
    });
    const [loading, setLoading] = useState(true);

    const [searchFilters, setSearchFilters] = useState({
        region: '',
        livestock: '',
        breed: '',
        status: ''
    });

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    const handleFilterChange = (e) => {
        setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        console.log('Executing search logic with:', searchFilters);
        // Implement navigation to projects page with filters if needed
    };

    useEffect(() => {
        const fetchAllShowcaseData = async () => {
            setLoading(true);
            try {
                const [projectsRes, productsRes, booksRes, videosRes, articlesRes] = await Promise.allSettled([
                    axios.get('/api/projects'),
                    axios.get('/api/products'),
                    axios.get('/api/content/books'),
                    axios.get('/api/content/videos'),
                    axios.get('/api/content/articles')
                ]);

                setShowcaseData({
                    projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data.slice(0, 4) : [],
                    products: productsRes.status === 'fulfilled' ? productsRes.value.data.slice(0, 4) : [],
                    books: booksRes.status === 'fulfilled' ? booksRes.value.data.slice(0, 4) : [],
                    videos: videosRes.status === 'fulfilled' ? videosRes.value.data.slice(0, 4) : [],
                    articles: articlesRes.status === 'fulfilled' ? articlesRes.value.data.slice(0, 4) : []
                });
            } catch (error) {
                console.error('Error fetching showcase data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllShowcaseData();

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-item').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="home-page home-page-body">
            <HomeHero
                searchFilters={searchFilters}
                handleFilterChange={handleFilterChange}
                handleSearch={handleSearch}
                currentDir={currentDir}
            />

            <section className="bg-white py-5 border-top border-bottom border-success border-opacity-10 position-relative overflow-hidden" style={{ background: '#020617' }}>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .hover-lift { transition: transform 0.3s ease, border-color 0.3s ease; cursor: default; }
                    .hover-lift:hover { transform: translateY(-5px); border-color: rgba(25, 135, 84, 0.5) !important; }
                `}} />
            </section>

            <SEO
                title="Predictive Agriculture Crowdfunding"
                description="The world's first data-governed marketplace for agriculture. Powered by physics-based simulations and local AI."
            />

            <HomeFeaturedServices currentDir={currentDir} />

            {/* 🔥 Recent Projects & Products Carousel */}
            <section className="showcase-section py-5" dir={currentDir}>
                <div className="container">
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
                    ) : (
                        <div id="recentShowcaseCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">
                            {/* Navigation Dots */}
                            <div className="carousel-indicators" style={{ bottom: '-50px' }}>
                                <button type="button" data-bs-target="#recentShowcaseCarousel" data-bs-slide-to="0" className="active" style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#cba135', border: 'none', margin: '0 8px' }}></button>
                                <button type="button" data-bs-target="#recentShowcaseCarousel" data-bs-slide-to="1" style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#dee2e6', border: 'none', margin: '0 8px' }}></button>
                                <button type="button" data-bs-target="#recentShowcaseCarousel" data-bs-slide-to="2" style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#dee2e6', border: 'none', margin: '0 8px' }}></button>
                                <button type="button" data-bs-target="#recentShowcaseCarousel" data-bs-slide-to="3" style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#dee2e6', border: 'none', margin: '0 8px' }}></button>
                                <button type="button" data-bs-target="#recentShowcaseCarousel" data-bs-slide-to="4" style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#dee2e6', border: 'none', margin: '0 8px' }}></button>
                            </div>

                            <div className="carousel-inner pb-5">
                                {/* Slide 1: Recent Projects */}
                                <div className="carousel-item active">
                                    <div className="text-center mb-5">
                                        <h2 className="section-title fw-bold" style={{ fontSize: '3rem', color: '#cba135' }}>
                                            {t('recent_projects', 'Recent Projects')}
                                        </h2>
                                        <p className="text-muted lead">{t('recent_projects_sub', 'Latest investment opportunities in the field')}</p>
                                    </div>
                                    <div className="row g-4 px-4">
                                        {showcaseData.projects.slice(0, 4).map(project => (
                                            <div key={project._id} className="col-lg-3 col-md-6">
                                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                                    <div className="position-relative">
                                                        <img
                                                            src={project.images?.[0] || '/img/Sheep Farming in Azilal.png'}
                                                            alt={project.title}
                                                            className="card-img-top"
                                                            style={{ height: '200px', objectFit: 'cover' }}
                                                        />
                                                        <span className="badge bg-success position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill">
                                                            {(project.raisedAmount / project.targetAmount * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <div className="card-body p-4">
                                                        <h5 className="card-title fw-bold text-truncate">
                                                            {(typeof project.title === 'object' ? (project.title[i18n.language] || project.title.en) : (project.title || 'Project'))}
                                                        </h5>
                                                        <p className="card-text text-muted small mb-3">
                                                            {String((typeof project.description === 'object' ? (project.description[i18n.language] || project.description.en) : project.description) || '').substring(0, 60)}...
                                                        </p>
                                                        <div className="progress mb-3" style={{ height: '8px' }}>
                                                            <div className="progress-bar bg-success" style={{ width: `${(project.raisedAmount / project.targetAmount * 100)}%` }}></div>
                                                        </div>
                                                        <Link to={`/projects/${project._id}`} className="btn w-100 rounded-pill text-white" style={{ backgroundColor: '#cba135' }}>
                                                            {t('view_details', 'View Details')}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-5">
                                        <Link to="/projects" className="btn px-5 py-3 rounded-pill fw-bold text-white" style={{ backgroundColor: '#cba135' }}>
                                            {t('view_all_projects', 'View All Projects')}
                                        </Link>
                                    </div>
                                </div>

                                {/* Slide 2: Recent Products */}
                                <div className="carousel-item">
                                    <div className="text-center mb-5">
                                        <h2 className="section-title fw-bold" style={{ fontSize: '3rem', color: '#cba135' }}>
                                            {t('recent_products', 'Recent Products')}
                                        </h2>
                                        <p className="text-muted lead">{t('recent_products_sub', 'Fresh produce and agricultural assets')}</p>
                                    </div>
                                    <div className="row g-4 px-4">
                                        {showcaseData.products.slice(0, 4).map(product => (
                                            <div key={product._id} className="col-lg-3 col-md-6">
                                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                                    <div className="position-relative">
                                                        <img
                                                            src={product.image || '/img/Market.png'}
                                                            alt={product.name || product.title}
                                                            className="card-img-top"
                                                            style={{ height: '200px', objectFit: 'cover' }}
                                                        />
                                                        {product.price && (
                                                            <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill fw-bold">
                                                                {product.price} DH
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="card-body p-4">
                                                        <h5 className="card-title fw-bold text-truncate">
                                                            {(typeof product.name === 'object' ? (product.name[i18n.language] || product.name.en) : (product.name || product.title))}
                                                        </h5>
                                                        <p className="card-text text-muted small mb-3">
                                                            {String((typeof product.description === 'object' ? (product.description[i18n.language] || product.description.en) : product.description) || '').substring(0, 60)}...
                                                        </p>
                                                        <Link to={`/products/${product._id}`} className="btn w-100 rounded-pill text-white" style={{ backgroundColor: '#cba135' }}>
                                                            {t('view_details', 'View Details')}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-5">
                                        <Link to="/marketplace" className="btn px-5 py-3 rounded-pill fw-bold text-white" style={{ backgroundColor: '#cba135' }}>
                                            {t('visit_marketplace', 'Visit Global Marketplace')}
                                        </Link>
                                    </div>
                                </div>

                                {/* Slide 3: Videos */}
                                <div className="carousel-item">
                                    <div className="text-center mb-5">
                                        <h2 className="section-title fw-bold" style={{ fontSize: '3rem', color: '#cba135' }}>
                                            {t('video_courses_title', 'Video Courses')}
                                        </h2>
                                        <p className="text-muted lead">{t('video_courses_sub', 'Watch practical, step-by-step video lessons')}</p>
                                    </div>
                                    <div className="row g-4 px-4">
                                        {showcaseData.videos.slice(0, 4).map(video => (
                                            <div key={video._id} className="col-lg-3 col-md-6">
                                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                                    <div className="position-relative">
                                                        <img
                                                            src={video.thumbnail || video.coverImage || '/img/Training.png'}
                                                            alt={video.title}
                                                            className="card-img-top"
                                                            style={{ height: '200px', objectFit: 'cover' }}
                                                        />
                                                        <div className="position-absolute top-50 start-50 translate-middle">
                                                            <span className="d-flex align-items-center justify-content-center bg-danger text-white rounded-circle" style={{ width: '60px', height: '60px' }}>
                                                                <i className="fa-solid fa-play fs-4"></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="card-body p-4">
                                                        <h5 className="card-title fw-bold text-truncate">
                                                            {(typeof video.title === 'object' ? (video.title[i18n.language] || video.title.en) : (video.title || 'Video'))}
                                                        </h5>
                                                        <p className="card-text text-muted small mb-3">
                                                            {String((typeof video.description === 'object' ? (video.description[i18n.language] || video.description.en) : video.description) || '').substring(0, 60)}...
                                                        </p>
                                                        <Link to={`/videos/${video._id}`} className="btn w-100 rounded-pill text-white" style={{ backgroundColor: '#cba135' }}>
                                                            {t('watch_course_btn', 'Watch Course')}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-5">
                                        <Link to="/videos" className="btn px-5 py-3 rounded-pill fw-bold text-white" style={{ backgroundColor: '#cba135' }}>
                                            {t('view_all_videos', 'View All Videos')}
                                        </Link>
                                    </div>
                                </div>

                                {/* Slide 4: Books */}
                                <div className="carousel-item">
                                    <div className="text-center mb-5">
                                        <h2 className="section-title fw-bold" style={{ fontSize: '3rem', color: '#cba135' }}>
                                            {t('books_page_title', 'Books & Guides')}
                                        </h2>
                                        <p className="text-muted lead">{t('books_page_sub', 'Download comprehensive PDF guides and manuals')}</p>
                                    </div>
                                    <div className="row g-4 px-4">
                                        {showcaseData.books.slice(0, 4).map(book => (
                                            <div key={book._id} className="col-lg-3 col-md-6">
                                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                                    <div className="position-relative">
                                                        <img
                                                            src={book.coverImage || book.thumbnail || '/img/Training.png'}
                                                            alt={book.title}
                                                            className="card-img-top"
                                                            style={{ height: '200px', objectFit: 'cover' }}
                                                        />
                                                        <span className="badge bg-primary position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill">
                                                            <i className="fa-solid fa-book me-1"></i> PDF
                                                        </span>
                                                    </div>
                                                    <div className="card-body p-4">
                                                        <h5 className="card-title fw-bold text-truncate">
                                                            {(typeof book.title === 'object' ? (book.title[i18n.language] || book.title.en) : (book.title || 'Book'))}
                                                        </h5>
                                                        <p className="card-text text-muted small mb-3">{book.author || 'GoldenFarm Team'}</p>
                                                        <Link to={`/books/${book._id}`} className="btn w-100 rounded-pill text-white" style={{ backgroundColor: '#cba135' }}>
                                                            {t('download_book_btn', 'Download PDF')}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-5">
                                        <Link to="/books" className="btn px-5 py-3 rounded-pill fw-bold text-white" style={{ backgroundColor: '#cba135' }}>
                                            {t('view_all_books', 'View All Books')}
                                        </Link>
                                    </div>
                                </div>

                                {/* Slide 5: Articles */}
                                <div className="carousel-item">
                                    <div className="text-center mb-5">
                                        <h2 className="section-title fw-bold" style={{ fontSize: '3rem', color: '#cba135' }}>
                                            {t('articles_page_title', 'Articles & Insights')}
                                        </h2>
                                        <p className="text-muted lead">{t('articles_page_sub', 'Short, practical reading to apply on the field')}</p>
                                    </div>
                                    <div className="row g-4 px-4">
                                        {showcaseData.articles.slice(0, 4).map(article => (
                                            <div key={article._id} className="col-lg-3 col-md-6">
                                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                                    <div className="position-relative">
                                                        <img
                                                            src={article.coverImage || article.thumbnail || '/img/Training.png'}
                                                            alt={article.title}
                                                            className="card-img-top"
                                                            style={{ height: '200px', objectFit: 'cover' }}
                                                        />
                                                        <span className="badge bg-info position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill">
                                                            <i className="fa-solid fa-newspaper me-1"></i> Article
                                                        </span>
                                                    </div>
                                                    <div className="card-body p-4">
                                                        <h5 className="card-title fw-bold text-truncate">
                                                            {(typeof article.title === 'object' ? (article.title[i18n.language] || article.title.en) : (article.title || 'Article'))}
                                                        </h5>
                                                        <p className="card-text text-muted small mb-3">
                                                            {String((typeof article.content === 'object' ? (article.content[i18n.language] || article.content.en) : article.content) || '').substring(0, 60)}...
                                                        </p>
                                                        <Link to={`/articles/${article._id}`} className="btn w-100 rounded-pill text-white" style={{ backgroundColor: '#cba135' }}>
                                                            {t('read_article_btn', 'Read Article')}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-5">
                                        <Link to="/articles" className="btn px-5 py-3 rounded-pill fw-bold text-white" style={{ backgroundColor: '#cba135' }}>
                                            {t('view_all_articles', 'View All Articles')}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            <button className="carousel-control-prev" type="button" data-bs-target="#recentShowcaseCarousel" data-bs-slide="prev" style={{ width: '60px', left: '-30px' }}>
                                <span className="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle shadow-lg" style={{ width: '50px', height: '50px' }}>
                                    <i className="fa-solid fa-chevron-left fs-5"></i>
                                </span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#recentShowcaseCarousel" data-bs-slide="next" style={{ width: '60px', right: '-30px' }}>
                                <span className="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle shadow-lg" style={{ width: '50px', height: '50px' }}>
                                    <i className="fa-solid fa-chevron-right fs-5"></i>
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </section>


        </div>
    );
};

export default HomePage;
