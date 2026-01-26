import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomeShowcaseCarousel = ({ data, currentDir, mode = 'carousel', carouselId = 'unifiedShowcase' }) => {
    const { t, i18n } = useTranslation();

    const renderCard = (item, type) => {
        const getLocalized = (field) => {
            if (!field) return '';
            if (typeof field === 'string') return field;
            return field[i18n.language] || field.en || field.fr || field.ar || Object.values(field)[0] || '';
        };

        const title = getLocalized(item.title || item.name) || '';
        const desc = getLocalized(item.description);
        const image = (item.images && item.images.length > 0) ? item.images[0] : (item.coverImage || item.thumbnail || '/img/placeholder.png');

        return (
            <div className={`showcase-card showcase-${type} h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white`}>
                <div className="card-image-wrapper position-relative">
                    <img className="card-img w-100" src={image} alt={title} style={{ height: '220px', objectFit: 'cover' }} />
                    <div className="card-overlay">
                        {type === 'videos' && <i className="fa-solid fa-play-circle video-play-icon"></i>}
                        <Link to={`/${type}/${item._id}`} className="sap-premium-btn">
                            {t('view_details', 'View Details')}
                        </Link>
                    </div>
                    {type === 'products' && item.price && (
                        <div className="price-tag position-absolute top-0 end-0 m-3 px-3 py-1 bg-white text-dark fw-bold rounded-pill shadow-sm">
                            {item.price} {item.currency || 'DH'}
                        </div>
                    )}
                </div>
                <div className="card-content p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className={`badge category-badge badge-${type} px-3 py-2 rounded-pill`}>{t(type, type.toUpperCase())}</span>
                        {type === 'projects' && item.raisedAmount !== undefined && (
                            <span className="text-secondary small fw-bold">{(item.raisedAmount / item.targetAmount * 100).toFixed(0)}%</span>
                        )}
                    </div>
                    <h5 className="card-title fw-bold text-truncate mb-2" title={title}>{title}</h5>
                    <p className="card-text small text-muted line-clamp-2 mb-3">{desc ? desc.substring(0, 80) + '...' : ''}</p>

                    {type === 'projects' && (
                        <div className="progress mt-auto" style={{ height: '8px', borderRadius: '4px' }}>
                            <div className="progress-bar bg-success" style={{ width: `${(item.raisedAmount / item.targetAmount * 100)}%` }}></div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Grid mode - static 4 cards in a row
    if (mode === 'grid') {
        const type = Object.keys(data)[0];
        const items = (data[type] || []).slice(0, 4);
        return (
            <div className="row g-4">
                {items.map(item => (
                    <div key={item._id} className="col-lg-3 col-md-6">
                        {renderCard(item, type)}
                    </div>
                ))}
            </div>
        );
    }

    // Single-type carousel mode - shows all items of one type in a carousel
    if (mode === 'single-carousel') {
        const type = Object.keys(data)[0];
        const items = (data[type] || []).slice(0, 4);

        if (items.length === 0) return null;

        return (
            <div id={carouselId} className="carousel slide showcase-carousel" data-bs-ride="carousel" data-bs-interval="5000">
                {/* Indicators */}
                <div className="carousel-indicators mb-0" style={{ bottom: '-40px' }}>
                    {items.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target={`#${carouselId}`}
                            data-bs-slide-to={index}
                            className={index === 0 ? 'active' : ''}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: index === 0 ? '#cba135' : '#dee2e6',
                                border: 'none',
                                margin: '0 6px'
                            }}
                        ></button>
                    ))}
                </div>

                {/* Carousel Items */}
                <div className="carousel-inner pb-5">
                    {items.map((item, index) => (
                        <div key={item._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <div className="row justify-content-center">
                                <div className="col-lg-8 col-md-10">
                                    <div className="d-flex gap-4 align-items-stretch" style={{ minHeight: '400px' }}>
                                        {/* Large Featured Image */}
                                        <div className="flex-grow-1 position-relative rounded-4 overflow-hidden shadow-lg" style={{ flex: '2' }}>
                                            <img
                                                src={(item.images && item.images.length > 0) ? item.images[0] : '/img/placeholder.png'}
                                                alt={item.title}
                                                className="w-100 h-100"
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <div className="position-absolute bottom-0 start-0 end-0 p-4" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                                                <span className={`badge bg-success px-3 py-2 rounded-pill mb-2`}>{t(type, type.toUpperCase())}</span>
                                                <h3 className="text-white fw-bold mb-2">{item.title}</h3>
                                                {type === 'projects' && (
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                                            <div className="progress-bar bg-warning" style={{ width: `${(item.raisedAmount / item.targetAmount * 100)}%` }}></div>
                                                        </div>
                                                        <span className="text-warning fw-bold">{(item.raisedAmount / item.targetAmount * 100).toFixed(0)}%</span>
                                                    </div>
                                                )}
                                                {type === 'products' && item.price && (
                                                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fs-6">{item.price} DH</span>
                                                )}
                                            </div>
                                            <Link to={`/${type}/${item._id}`} className="stretched-link"></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev" style={{ width: '50px' }}>
                    <span className="d-flex align-items-center justify-content-center bg-white text-dark rounded-circle shadow" style={{ width: '48px', height: '48px' }}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next" style={{ width: '50px' }}>
                    <span className="d-flex align-items-center justify-content-center bg-white text-dark rounded-circle shadow" style={{ width: '48px', height: '48px' }}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </span>
                </button>
            </div>
        );
    }

    // Default multi-type carousel (original behavior)
    const slides = [
        { key: 'projects', title: t('discover_projects', 'Discover Agricultural Projects'), items: data.projects },
        { key: 'products', title: t('discover_products', 'Discover Agricultural Products'), items: data.products },
        { key: 'books', title: t('discover_books', 'Knowledge Library: Books'), items: data.books },
        { key: 'videos', title: t('discover_videos', 'Visual Learning: Videos'), items: data.videos },
        { key: 'articles', title: t('discover_articles', 'Agricultural Insights: Articles'), items: data.articles }
    ].filter(s => s.items && s.items.length > 0);

    return (
        <div id={carouselId} className="carousel slide showcase-carousel" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target={`#${carouselId}`}
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                    ></button>
                ))}
            </div>

            <div className="carousel-inner pb-5">
                {slides.map((slide, index) => (
                    <div key={slide.key} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <div className="text-center mb-4">
                            <h3 className="slide-category-title fw-bold">{slide.title}</h3>
                        </div>
                        <div className="row g-4 px-5">
                            {slide.items.slice(0, 4).map((item) => (
                                <div key={item._id} className="col-lg-3 col-md-6">
                                    {renderCard(item, slide.key)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
                <span className="control-icon"><i className="fa-solid fa-chevron-left"></i></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
                <span className="control-icon"><i className="fa-solid fa-chevron-right"></i></span>
            </button>
        </div>
    );
};

export default HomeShowcaseCarousel;
