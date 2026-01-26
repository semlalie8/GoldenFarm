import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Button, Collapse } from 'react-bootstrap';
import { Package, ChevronDown, ChevronUp, Truck, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const OrdersPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=orders');
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/orders/my-orders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userInfo, navigate]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle size={18} className="text-success" />;
            case 'shipped': return <Truck size={18} className="text-primary" />;
            case 'cancelled': return <XCircle size={18} className="text-danger" />;
            default: return <Clock size={18} className="text-warning" />;
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: { bg: 'warning', label: t('pending', 'Pending') },
            confirmed: { bg: 'info', label: t('confirmed', 'Confirmed') },
            processing: { bg: 'primary', label: t('processing', 'Processing') },
            shipped: { bg: 'primary', label: t('shipped', 'Shipped') },
            delivered: { bg: 'success', label: t('delivered', 'Delivered') },
            cancelled: { bg: 'danger', label: t('cancelled', 'Cancelled') },
            refunded: { bg: 'secondary', label: t('refunded', 'Refunded') }
        };
        const variant = variants[status] || variants.pending;
        return <Badge bg={variant.bg} className="rounded-pill px-3">{variant.label}</Badge>;
    };

    if (!userInfo) return null;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Container className="py-5">
                <div className="mb-4">
                    <h1 className="fw-bold" style={{ color: '#1e293b' }}>
                        <Package size={32} className="me-3" style={{ color: '#cba135' }} />
                        {t('my_orders', 'My Orders')}
                    </h1>
                    <p className="text-muted">{t('orders_description', 'Track and manage your orders')}</p>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" />
                        <p className="mt-3 text-muted">{t('loading_orders', 'Loading your orders...')}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <Card className="text-center p-5 border-0 shadow-sm rounded-4">
                        <Package size={80} className="mx-auto mb-4" style={{ color: '#cbd5e1' }} />
                        <h3 className="fw-bold mb-3">{t('no_orders', 'No Orders Yet')}</h3>
                        <p className="text-muted mb-4">{t('no_orders_message', "You haven't placed any orders yet.")}</p>
                        <Link to="/marketplace" className="btn text-white px-5 py-3 rounded-pill fw-bold" style={{ backgroundColor: '#cba135' }}>
                            {t('start_shopping', 'Start Shopping')}
                        </Link>
                    </Card>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {orders.map((order) => (
                            <Card key={order._id} className="border-0 shadow-sm rounded-4 overflow-hidden">
                                {/* Order Header */}
                                <Card.Header
                                    className="bg-white p-4 cursor-pointer"
                                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Row className="align-items-center">
                                        <Col md={3}>
                                            <small className="text-muted d-block">{t('order_number', 'Order Number')}</small>
                                            <span className="fw-bold" style={{ color: '#cba135' }}>{order.orderNumber}</span>
                                        </Col>
                                        <Col md={2}>
                                            <small className="text-muted d-block">{t('date', 'Date')}</small>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </Col>
                                        <Col md={2}>
                                            <small className="text-muted d-block">{t('items', 'Items')}</small>
                                            <span>{order.items?.length || 0}</span>
                                        </Col>
                                        <Col md={2}>
                                            <small className="text-muted d-block">{t('total', 'Total')}</small>
                                            <span className="fw-bold">{order.totalAmount?.toLocaleString()} DH</span>
                                        </Col>
                                        <Col md={2}>
                                            <small className="text-muted d-block">{t('status', 'Status')}</small>
                                            {getStatusBadge(order.status)}
                                        </Col>
                                        <Col md={1} className="text-end">
                                            {expandedOrder === order._id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                        </Col>
                                    </Row>
                                </Card.Header>

                                {/* Order Details */}
                                <Collapse in={expandedOrder === order._id}>
                                    <div>
                                        <Card.Body className="p-4 bg-light">
                                            <Row className="g-4">
                                                {/* Order Items */}
                                                <Col md={8}>
                                                    <h6 className="fw-bold mb-3">{t('order_items', 'Order Items')}</h6>
                                                    <div className="d-flex flex-column gap-3">
                                                        {order.items?.map((item, i) => (
                                                            <div key={i} className="d-flex align-items-center gap-3 bg-white p-3 rounded-3">
                                                                <img
                                                                    src={item.image || '/img/placeholder.png'}
                                                                    alt={item.name}
                                                                    className="rounded-3"
                                                                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                                                                />
                                                                <div className="flex-grow-1">
                                                                    <p className="mb-0 fw-medium">{item.name}</p>
                                                                    <small className="text-muted">Qty: {item.quantity}</small>
                                                                </div>
                                                                <span className="fw-bold">{(item.price * item.quantity).toLocaleString()} DH</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Col>

                                                {/* Order Info */}
                                                <Col md={4}>
                                                    <h6 className="fw-bold mb-3">{t('order_details', 'Order Details')}</h6>
                                                    <div className="bg-white p-3 rounded-3 mb-3">
                                                        <small className="text-muted d-block mb-1">{t('shipping_address', 'Shipping Address')}</small>
                                                        <p className="mb-0">
                                                            {order.shippingAddress?.fullName}<br />
                                                            {order.shippingAddress?.address}<br />
                                                            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                                                            {order.shippingAddress?.phone}
                                                        </p>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-3 mb-3">
                                                        <small className="text-muted d-block mb-1">{t('payment', 'Payment')}</small>
                                                        <p className="mb-0 fw-medium">{order.paymentMethod?.toUpperCase().replace('_', ' ')}</p>
                                                        {order.isPaid ? (
                                                            <Badge bg="success" className="mt-1">{t('paid', 'Paid')}</Badge>
                                                        ) : (
                                                            <Badge bg="warning" className="mt-1">{t('unpaid', 'Unpaid')}</Badge>
                                                        )}
                                                    </div>
                                                    <div className="bg-white p-3 rounded-3">
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span className="text-muted">{t('subtotal', 'Subtotal')}</span>
                                                            <span>{order.subtotal?.toLocaleString()} DH</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span className="text-muted">{t('shipping', 'Shipping')}</span>
                                                            <span>{order.shippingFee === 0 ? 'FREE' : `${order.shippingFee} DH`}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span className="text-muted">{t('tax', 'Tax')}</span>
                                                            <span>{order.tax?.toLocaleString()} DH</span>
                                                        </div>
                                                        <hr />
                                                        <div className="d-flex justify-content-between">
                                                            <span className="fw-bold">{t('total', 'Total')}</span>
                                                            <span className="fw-bold" style={{ color: '#cba135' }}>{order.totalAmount?.toLocaleString()} DH</span>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            {/* Order Timeline */}
                                            <div className="mt-4 pt-4 border-top">
                                                <h6 className="fw-bold mb-3">{t('order_timeline', 'Order Timeline')}</h6>
                                                <div className="d-flex gap-4">
                                                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, i) => {
                                                        const isActive = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= i;
                                                        const isCurrent = order.status === status;
                                                        return (
                                                            <div key={status} className="text-center flex-grow-1">
                                                                <div
                                                                    className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-2 ${isActive ? 'text-white' : 'text-muted bg-light'}`}
                                                                    style={{
                                                                        width: 36,
                                                                        height: 36,
                                                                        backgroundColor: isActive ? (isCurrent ? '#cba135' : '#10b981') : undefined,
                                                                        border: isCurrent ? '3px solid #cba135' : 'none'
                                                                    }}
                                                                >
                                                                    {isActive ? <CheckCircle size={18} /> : i + 1}
                                                                </div>
                                                                <p className={`mb-0 small ${isActive ? 'fw-bold' : 'text-muted'}`}>
                                                                    {t(status, status.charAt(0).toUpperCase() + status.slice(1))}
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </div>
                                </Collapse>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default OrdersPage;
