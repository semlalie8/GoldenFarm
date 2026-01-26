import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { Package, Eye, Truck, CheckCircle, XCircle, Clock, RefreshCw, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AdminOrdersPage = () => {
    const { t } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, [page]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/orders?page=${page}&limit=15`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setOrders(data.orders);
            setTotalPages(data.pages);
        } catch (error) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/api/orders/stats', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setStats(data);
        } catch (error) {
            console.error('Stats fetch error:', error);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            setUpdating(true);
            await axios.put(`/api/orders/${orderId}/status`, { status }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setSuccess('Order status updated successfully');
            fetchOrders();
            setShowModal(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update order');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: { bg: 'warning', icon: Clock },
            confirmed: { bg: 'info', icon: CheckCircle },
            processing: { bg: 'primary', icon: RefreshCw },
            shipped: { bg: 'primary', icon: Truck },
            delivered: { bg: 'success', icon: CheckCircle },
            cancelled: { bg: 'danger', icon: XCircle },
            refunded: { bg: 'secondary', icon: RefreshCw }
        };
        const variant = variants[status] || variants.pending;
        const Icon = variant.icon;
        return (
            <Badge bg={variant.bg} className="d-inline-flex align-items-center gap-1 rounded-pill px-3">
                <Icon size={14} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const statCards = [
        { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingBag, color: '#3b82f6' },
        { label: 'Pending', value: stats.pendingOrders || 0, icon: Clock, color: '#f59e0b' },
        { label: 'Completed', value: stats.completedOrders || 0, icon: CheckCircle, color: '#10b981' },
        { label: 'Revenue', value: `${(stats.totalRevenue || 0).toLocaleString()} DH`, icon: DollarSign, color: '#cba135' }
    ];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Container className="py-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="fw-bold mb-1" style={{ color: '#1e293b' }}>
                            <Package size={32} className="me-3" style={{ color: '#cba135' }} />
                            {t('order_management', 'Order Management')}
                        </h1>
                        <p className="text-muted mb-0">{t('manage_orders_desc', 'View and manage all customer orders')}</p>
                    </div>
                    <Button
                        variant="outline-primary"
                        className="rounded-pill"
                        onClick={() => { fetchOrders(); fetchStats(); }}
                    >
                        <RefreshCw size={18} className="me-2" /> {t('refresh', 'Refresh')}
                    </Button>
                </div>

                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

                {/* Stats Cards */}
                <Row className="g-4 mb-4">
                    {statCards.map((stat, i) => (
                        <Col key={i} md={3}>
                            <Card className="border-0 shadow-sm rounded-4 h-100">
                                <Card.Body className="d-flex align-items-center gap-3 p-4">
                                    <div className="p-3 rounded-3" style={{ background: `${stat.color}15` }}>
                                        <stat.icon size={24} style={{ color: stat.color }} />
                                    </div>
                                    <div>
                                        <p className="text-muted small mb-1">{stat.label}</p>
                                        <h3 className="mb-0 fw-bold">{stat.value}</h3>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Orders Table */}
                <Card className="border-0 shadow-sm rounded-4">
                    <Card.Header className="bg-white border-0 p-4">
                        <h5 className="mb-0 fw-bold">{t('recent_orders', 'Recent Orders')}</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="success" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-5">
                                <Package size={64} className="text-muted mb-3" />
                                <p className="text-muted">{t('no_orders', 'No orders found')}</p>
                            </div>
                        ) : (
                            <Table responsive hover className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 px-4 py-3">{t('order', 'Order')}</th>
                                        <th className="border-0 py-3">{t('customer', 'Customer')}</th>
                                        <th className="border-0 py-3">{t('items', 'Items')}</th>
                                        <th className="border-0 py-3">{t('total', 'Total')}</th>
                                        <th className="border-0 py-3">{t('payment', 'Payment')}</th>
                                        <th className="border-0 py-3">{t('status', 'Status')}</th>
                                        <th className="border-0 py-3">{t('date', 'Date')}</th>
                                        <th className="border-0 py-3 text-end pe-4">{t('actions', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-4 py-3">
                                                <span className="fw-bold" style={{ color: '#cba135' }}>{order.orderNumber}</span>
                                            </td>
                                            <td className="py-3">
                                                <div>
                                                    <p className="mb-0 fw-medium">{order.user?.name || 'Guest'}</p>
                                                    <small className="text-muted">{order.user?.email}</small>
                                                </div>
                                            </td>
                                            <td className="py-3">{order.items?.length || 0}</td>
                                            <td className="py-3 fw-bold">{order.totalAmount?.toLocaleString()} DH</td>
                                            <td className="py-3">
                                                <div>
                                                    <span className="text-uppercase small">{order.paymentMethod?.replace('_', ' ')}</span>
                                                    {order.isPaid ? (
                                                        <Badge bg="success" className="ms-2 rounded-pill">Paid</Badge>
                                                    ) : (
                                                        <Badge bg="warning" className="ms-2 rounded-pill">Unpaid</Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3">{getStatusBadge(order.status)}</td>
                                            <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 text-end pe-4">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="rounded-pill me-2"
                                                    onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                    {totalPages > 1 && (
                        <Card.Footer className="bg-white border-0 p-4">
                            <div className="d-flex justify-content-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <Button
                                        key={p}
                                        size="sm"
                                        variant={p === page ? 'primary' : 'outline-secondary'}
                                        className="rounded-circle"
                                        style={{ width: 36, height: 36 }}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </Button>
                                ))}
                            </div>
                        </Card.Footer>
                    )}
                </Card>
            </Container>

            {/* Order Detail Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">
                        Order {selectedOrder?.orderNumber}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    {selectedOrder && (
                        <>
                            <Row className="g-4 mb-4">
                                <Col md={6}>
                                    <Card className="border rounded-3 h-100">
                                        <Card.Body>
                                            <h6 className="fw-bold mb-3">{t('customer', 'Customer')}</h6>
                                            <p className="mb-1"><strong>{selectedOrder.shippingAddress?.fullName}</strong></p>
                                            <p className="mb-1 text-muted small">{selectedOrder.shippingAddress?.phone}</p>
                                            <p className="mb-0 text-muted small">
                                                {selectedOrder.shippingAddress?.address}<br />
                                                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border rounded-3 h-100">
                                        <Card.Body>
                                            <h6 className="fw-bold mb-3">{t('order_info', 'Order Info')}</h6>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Subtotal</span>
                                                <span>{selectedOrder.subtotal?.toLocaleString()} DH</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Shipping</span>
                                                <span>{selectedOrder.shippingFee} DH</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Tax</span>
                                                <span>{selectedOrder.tax?.toLocaleString()} DH</span>
                                            </div>
                                            <hr />
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">Total</span>
                                                <span className="fw-bold" style={{ color: '#cba135' }}>{selectedOrder.totalAmount?.toLocaleString()} DH</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <h6 className="fw-bold mb-3">{t('items', 'Items')}</h6>
                            <div className="d-flex flex-column gap-2 mb-4">
                                {selectedOrder.items?.map((item, i) => (
                                    <div key={i} className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                                        <img
                                            src={item.image || '/img/placeholder.png'}
                                            alt={item.name}
                                            className="rounded"
                                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                                        />
                                        <div className="flex-grow-1">
                                            <p className="mb-0 fw-medium">{item.name}</p>
                                            <small className="text-muted">Qty: {item.quantity} × {item.price} DH</small>
                                        </div>
                                        <span className="fw-bold">{(item.price * item.quantity).toLocaleString()} DH</span>
                                    </div>
                                ))}
                            </div>

                            <h6 className="fw-bold mb-3">{t('update_status', 'Update Status')}</h6>
                            <div className="d-flex gap-2 flex-wrap">
                                {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                                    <Button
                                        key={status}
                                        variant={selectedOrder.status === status ? 'primary' : 'outline-secondary'}
                                        size="sm"
                                        className="rounded-pill"
                                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                                        disabled={updating || selectedOrder.status === status}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Button>
                                ))}
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminOrdersPage;
