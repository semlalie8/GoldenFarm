import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { fetchCart, updateCartItem, removeFromCart, clearCart, clearError, clearSuccess } from '../slices/cartSlice';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CartPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { items, totalAmount, loading, error, successMessage } = useSelector((state) => state.cart);

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchCart());
        }
    }, [dispatch, userInfo]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => dispatch(clearSuccess()), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    const handleQuantityChange = (productId, currentQty, change) => {
        const newQty = currentQty + change;
        if (newQty >= 1) {
            dispatch(updateCartItem({ productId, quantity: newQty }));
        }
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleClearCart = () => {
        if (window.confirm(t('confirm_clear_cart', 'Are you sure you want to clear your cart?'))) {
            dispatch(clearCart());
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (!userInfo) {
        return (
            <Container className="py-5">
                <Card className="text-center p-5 border-0 shadow-sm rounded-4">
                    <ShoppingCart size={64} className="mx-auto mb-4 text-muted" />
                    <h3>{t('login_to_view_cart', 'Login to View Your Cart')}</h3>
                    <p className="text-muted">{t('login_cart_message', 'Please log in to add items and view your shopping cart.')}</p>
                    <Link to="/login" className="btn text-white px-4 py-2 rounded-pill" style={{ backgroundColor: '#cba135' }}>
                        {t('login', 'Login')}
                    </Link>
                </Card>
            </Container>
        );
    }

    const shippingFee = totalAmount * 0.20;
    const tax = totalAmount * 0.2;
    const grandTotal = totalAmount + shippingFee + tax;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Container className="py-5">
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <Link to="/marketplace" className="text-decoration-none text-muted d-flex align-items-center gap-2 mb-2">
                            <ArrowLeft size={18} /> {t('continue_shopping', 'Continue Shopping')}
                        </Link>
                        <h1 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                            <ShoppingCart size={32} className="me-3" style={{ color: '#cba135' }} />
                            {t('shopping_cart', 'Shopping Cart')}
                        </h1>
                    </div>
                    {items.length > 0 && (
                        <Button variant="outline-danger" onClick={handleClearCart} className="rounded-pill">
                            <Trash2 size={16} className="me-2" /> {t('clear_cart', 'Clear Cart')}
                        </Button>
                    )}
                </div>

                {error && <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" />
                        <p className="mt-3 text-muted">{t('loading_cart', 'Loading your cart...')}</p>
                    </div>
                ) : items.length === 0 ? (
                    <Card className="text-center p-5 border-0 shadow-sm rounded-4">
                        <Package size={80} className="mx-auto mb-4" style={{ color: '#cbd5e1' }} />
                        <h3 className="fw-bold mb-3">{t('cart_empty', 'Your Cart is Empty')}</h3>
                        <p className="text-muted mb-4">{t('cart_empty_message', 'Looks like you haven\'t added any products yet.')}</p>
                        <Link to="/marketplace" className="btn text-white px-5 py-3 rounded-pill fw-bold" style={{ backgroundColor: '#cba135' }}>
                            {t('browse_products', 'Browse Products')}
                        </Link>
                    </Card>
                ) : (
                    <Row className="g-4">
                        {/* Cart Items */}
                        <Col lg={8}>
                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                                <Card.Header className="bg-white border-0 p-4">
                                    <h5 className="mb-0 fw-bold">{t('cart_items', 'Cart Items')} ({items.length})</h5>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    {items.map((item, index) => (
                                        <div key={item.product?._id || index} className={`p-4 d-flex align-items-center gap-4 ${index !== items.length - 1 ? 'border-bottom' : ''}`}>
                                            {/* Product Image */}
                                            <Link to={`/products/${item.product?._id}`}>
                                                <img
                                                    src={item.product?.image || '/img/placeholder.png'}
                                                    alt={item.product?.name}
                                                    className="rounded-3"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            </Link>

                                            {/* Product Info */}
                                            <div className="flex-grow-1">
                                                <Link to={`/products/${item.product?._id}`} className="text-decoration-none">
                                                    <h5 className="fw-bold mb-1 text-dark">
                                                        {typeof item.product?.name === 'object' ? (item.product.name.en || 'Product') : (item.product?.name || 'Product')}
                                                    </h5>
                                                </Link>
                                                <p className="text-muted small mb-2">{item.product?.category || 'Agriculture'}</p>
                                                <Badge bg="success" className="rounded-pill px-3">
                                                    {item.price?.toLocaleString()} DH
                                                </Badge>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="d-flex align-items-center gap-2">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="rounded-circle p-2"
                                                    onClick={() => handleQuantityChange(item.product?._id, item.quantity, -1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={16} />
                                                </Button>
                                                <span className="fw-bold px-3" style={{ minWidth: '40px', textAlign: 'center' }}>
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="rounded-circle p-2"
                                                    onClick={() => handleQuantityChange(item.product?._id, item.quantity, 1)}
                                                    disabled={item.quantity >= (item.product?.stock || 99)}
                                                >
                                                    <Plus size={16} />
                                                </Button>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-end" style={{ minWidth: '120px' }}>
                                                <p className="fw-bold mb-0" style={{ color: '#cba135', fontSize: '1.2rem' }}>
                                                    {(item.price * item.quantity).toLocaleString()} DH
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <Button
                                                variant="link"
                                                className="text-danger p-2"
                                                onClick={() => handleRemove(item.product?._id)}
                                            >
                                                <Trash2 size={20} />
                                            </Button>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Order Summary */}
                        <Col lg={4}>
                            <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
                                <Card.Header className="bg-white border-0 p-4">
                                    <h5 className="mb-0 fw-bold">{t('order_summary', 'Order Summary')}</h5>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">{t('subtotal', 'Subtotal')}</span>
                                        <span className="fw-bold">{totalAmount.toLocaleString()} DH</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">{t('shipping', 'Shipping')}</span>
                                        <span className="fw-bold">
                                            {shippingFee.toLocaleString()} DH
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">{t('tax', 'Tax')} (20%)</span>
                                        <span className="fw-bold">{tax.toLocaleString()} DH</span>
                                    </div>



                                    <hr className="my-4" />

                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="fw-bold fs-5">{t('total', 'Total')}</span>
                                        <span className="fw-bold fs-4" style={{ color: '#cba135' }}>
                                            {grandTotal.toLocaleString()} DH
                                        </span>
                                    </div>

                                    <Button
                                        className="w-100 py-3 rounded-pill fw-bold text-white"
                                        style={{ backgroundColor: '#cba135', border: 'none' }}
                                        onClick={handleCheckout}
                                    >
                                        <CreditCard size={20} className="me-2" />
                                        {t('proceed_to_checkout', 'Proceed to Checkout')}
                                    </Button>

                                    <div className="mt-4 text-center">
                                        <small className="text-muted">
                                            🔒 {t('secure_checkout', 'Secure checkout with SSL encryption')}
                                        </small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default CartPage;
