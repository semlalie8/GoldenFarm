import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Badge, Spinner, Breadcrumb } from 'react-bootstrap';
import { ArrowLeft, Star, Package, Truck, ShieldCheck, Heart } from 'lucide-react';
import AddToCartButton from '../components/AddToCartButton';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" variant="success" />
            </div>
        );
    }

    if (!product) {
        return (
            <Container className="py-5">
                <Card className="text-center p-5 border-0 shadow-sm rounded-4">
                    <Package size={64} className="mx-auto mb-4 text-muted" />
                    <h3>{t('product_not_found', 'Product Not Found')}</h3>
                    <Link to="/marketplace" className="btn btn-success rounded-pill mt-3">
                        {t('back_to_marketplace', 'Back to Marketplace')}
                    </Link>
                </Card>
            </Container>
        );
    }

    const productName = product.name?.[i18n.language] || product.name?.en || product.name || 'Product';
    const productDesc = product.description?.[i18n.language] || product.description?.en || product.description || '';
    const images = product.images?.length > 0 ? product.images : [product.image || '/img/placeholder.png'];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Container className="py-5">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-4">
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>{t('home', 'Home')}</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/marketplace' }}>{t('marketplace', 'Marketplace')}</Breadcrumb.Item>
                    <Breadcrumb.Item active>{productName}</Breadcrumb.Item>
                </Breadcrumb>

                <Row className="g-5">
                    {/* Product Images */}
                    <Col lg={6}>
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="position-relative" style={{ paddingBottom: '100%' }}>
                                <img
                                    src={images[selectedImage]}
                                    alt={productName}
                                    className="position-absolute w-100 h-100"
                                    style={{ objectFit: 'cover', top: 0, left: 0 }}
                                />
                                {product.stock < 1 && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                        style={{ background: 'rgba(0,0,0,0.5)' }}>
                                        <Badge bg="danger" className="px-4 py-2 fs-5">{t('out_of_stock', 'Out of Stock')}</Badge>
                                    </div>
                                )}
                            </div>
                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="d-flex gap-2 p-3 bg-light">
                                    {images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`${productName} ${i + 1}`}
                                            className={`rounded-3 cursor-pointer ${selectedImage === i ? 'border border-2 border-success' : ''}`}
                                            style={{ width: 60, height: 60, objectFit: 'cover', cursor: 'pointer' }}
                                            onClick={() => setSelectedImage(i)}
                                        />
                                    ))}
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* Product Info */}
                    <Col lg={6}>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Badge bg="success" className="rounded-pill px-3">{product.category || 'Agriculture'}</Badge>
                            {product.stock > 0 && product.stock < 10 && (
                                <Badge bg="warning" className="rounded-pill px-3">{t('low_stock', 'Only')} {product.stock} {t('left', 'left')}</Badge>
                            )}
                        </div>

                        <h1 className="fw-bold mb-3" style={{ color: '#1e293b', fontSize: '2rem' }}>{productName}</h1>

                        {/* Rating */}
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <div className="d-flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={18} fill={star <= 4 ? '#f59e0b' : 'none'} color="#f59e0b" />
                                ))}
                            </div>
                            <span className="text-muted small">(4.0) • 128 {t('reviews', 'reviews')}</span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                            <h2 className="fw-bold mb-0" style={{ color: '#cba135', fontSize: '2.5rem' }}>
                                {product.price?.toLocaleString()} DH
                            </h2>
                            {product.originalPrice && (
                                <span className="text-muted text-decoration-line-through ms-2">
                                    {product.originalPrice?.toLocaleString()} DH
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>{productDesc}</p>

                        {/* Stock Info */}
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="d-flex align-items-center gap-2">
                                <Package size={18} className="text-success" />
                                <span className="small">
                                    {product.stock > 0 ? (
                                        <span className="text-success fw-bold">{t('in_stock', 'In Stock')} ({product.stock})</span>
                                    ) : (
                                        <span className="text-danger fw-bold">{t('out_of_stock', 'Out of Stock')}</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="mb-4">
                            <AddToCartButton
                                productId={product._id}
                                stock={product.stock}
                                showQuantity={true}
                                fullWidth={true}
                                size="lg"
                            />
                        </div>

                        {/* Features */}
                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-light">
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <Truck size={24} style={{ color: '#cba135' }} />
                                    <div>
                                        <p className="mb-0 fw-bold">{t('shipping_fee', 'Shipping Fee')}</p>
                                        <small className="text-muted">{t('shipping_fee_desc', 'Fixed 20% of subtotal')}</small>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <ShieldCheck size={24} style={{ color: '#cba135' }} />
                                    <div>
                                        <p className="mb-0 fw-bold">{t('quality_guarantee', 'Quality Guarantee')}</p>
                                        <small className="text-muted">{t('quality_desc', '100% authentic products')}</small>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Seller Info */}
                        {product.seller && (
                            <Card className="border-0 shadow-sm rounded-4 p-4 mt-4">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={product.seller.avatar || '/img/farmer-avatar.png'}
                                        alt="Seller"
                                        className="rounded-circle"
                                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                                    />
                                    <div>
                                        <p className="mb-0 fw-bold">{product.seller.name || 'Farmer'}</p>
                                        <small className="text-muted">{t('verified_seller', 'Verified Seller')}</small>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProductDetailsPage;
