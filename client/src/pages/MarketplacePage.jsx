import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Badge, Spinner, Form, InputGroup } from 'react-bootstrap';
import { Search, Filter, ShoppingBag, Star, Package } from 'lucide-react';
import AddToCartButton from '../components/AddToCartButton';

const MarketplacePage = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [marketPrices, setMarketPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/marketplace/products');
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMarketPrices = async () => {
            try {
                const { data } = await axios.get('/api/analytics/market-prices');
                setMarketPrices(data);
            } catch (error) {
                console.error("Error fetching market prices:", error);
            }
        }

        fetchProducts();
        fetchMarketPrices();
    }, []);

    useEffect(() => {
        let filtered = products;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(p => {
                const name = p.name?.[i18n.language] || p.name?.en || p.name || '';
                return name.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, products, i18n.language]);

    const getCompetitorPrice = (productName) => {
        const match = marketPrices.find(m => productName.toLowerCase().includes(m.product_name.toLowerCase().split(' ')[0].toLowerCase()));
        return match ? match : null;
    }

    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }} dir={currentDir}>
            {/* Hero Header */}
            <section className="py-5" style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                color: '#fff'
            }}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={8}>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="p-3 rounded-circle" style={{ background: 'rgba(203, 161, 53, 0.2)' }}>
                                    <ShoppingBag size={32} style={{ color: '#cba135' }} />
                                </div>
                                <Badge className="rounded-pill px-3 py-2" style={{ background: 'rgba(125, 194, 66, 0.2)', color: '#7DC242' }}>
                                    {products.length} {t('products_available', 'Products Available')}
                                </Badge>
                            </div>
                            <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
                                {t('marketplace_page_title', 'Marketplace')}
                            </h1>
                            <p className="lead mb-0 text-white-50">
                                {t('marketplace_sub', 'Connecting farmers directly to cooperatives, distributors, and ethical buyers.')}
                            </p>
                        </Col>
                        <Col lg={4}>
                            <Card className="border-0 shadow-lg rounded-4 p-3" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                <div className="text-center">
                                    <small className="text-white-50">{t('live_market_data', 'Live Market Data')}</small>
                                    {marketPrices.slice(0, 3).map((mp, i) => (
                                        <div key={i} className="d-flex justify-content-between mt-2">
                                            <span className="text-white small">{mp.product_name}</span>
                                            <span className="text-success fw-bold">${mp.market_price}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Filters */}
            <Container className="py-4">
                <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                    <Row className="g-3 align-items-center">
                        <Col md={6}>
                            <InputGroup>
                                <InputGroup.Text className="bg-white border-end-0 rounded-start-pill">
                                    <Search size={18} className="text-muted" />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder={t('search_products', 'Search products...')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-start-0 rounded-end-pill py-2"
                                />
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <div className="d-flex align-items-center gap-2">
                                <Filter size={18} className="text-muted" />
                                <Form.Select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="rounded-pill"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat === 'all' ? t('all_categories', 'All Categories') : cat}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                        </Col>
                        <Col md={2} className="text-end">
                            <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                                {filteredProducts.length} {t('results', 'results')}
                            </Badge>
                        </Col>
                    </Row>
                </Card>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" />
                        <p className="mt-3 text-muted">{t('loading_products', 'Loading products...')}</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <Row className="g-4">
                        {filteredProducts.map((product) => {
                            const benchmark = getCompetitorPrice(product.name?.en || 'product');
                            const productName = product.name?.[i18n.language] || product.name?.en || product.name;
                            const productDesc = product.description?.[i18n.language] || product.description?.en || product.description;

                            return (
                                <Col key={product._id} md={6} lg={4} xl={3}>
                                    <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden product-card-hover">
                                        <div className="position-relative">
                                            <Link to={`/marketplace/${product._id}`}>
                                                <img
                                                    src={product.images?.[0] || product.image || '/img/placeholder.png'}
                                                    alt={productName}
                                                    className="w-100"
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                />
                                            </Link>
                                            {product.stock < 1 && (
                                                <Badge bg="danger" className="position-absolute top-0 end-0 m-2 rounded-pill">
                                                    {t('sold_out', 'Sold Out')}
                                                </Badge>
                                            )}
                                            {product.stock > 0 && product.stock < 10 && (
                                                <Badge bg="warning" className="position-absolute top-0 end-0 m-2 rounded-pill">
                                                    {t('low_stock', 'Low Stock')}
                                                </Badge>
                                            )}
                                        </div>
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <Badge bg="light" text="success" className="rounded-pill small">
                                                    {product.category || 'Agriculture'}
                                                </Badge>
                                                <div className="d-flex align-items-center gap-1">
                                                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                                    <span className="small text-muted">4.5</span>
                                                </div>
                                            </div>
                                            <Link to={`/marketplace/${product._id}`} className="text-decoration-none">
                                                <h5 className="fw-bold mb-2 text-dark">{productName}</h5>
                                            </Link>
                                            <p className="text-muted small mb-3" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {productDesc}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h4 className="mb-0 fw-bold" style={{ color: '#cba135' }}>
                                                    {product.price?.toLocaleString()} DH
                                                </h4>
                                                {benchmark && (
                                                    <span className new-true="badge bg-light text-muted small" title={`Competitor: ${benchmark.competitor}`}>
                                                        Mkt: ${benchmark.market_price}
                                                    </span>
                                                )}
                                            </div>
                                            <AddToCartButton
                                                productId={product._id}
                                                stock={product.stock}
                                                fullWidth={true}
                                            />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <Card className="text-center p-5 border-0 shadow-sm rounded-4">
                        <Package size={64} className="mx-auto mb-4 text-muted" />
                        <h4>{t('no_products_found', 'No products found')}</h4>
                        <p className="text-muted">{t('try_different_search', 'Try a different search term or category')}</p>
                    </Card>
                )}
            </Container>

            <style>{`
                .product-card-hover {
                    transition: all 0.3s ease;
                }
                .product-card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
                }
            `}</style>
        </div>
    );
};

export default MarketplacePage;
