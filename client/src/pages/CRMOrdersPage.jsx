import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';

const CRMOrdersPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('/api/crm/orders', config);
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders');
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userInfo]);

    const handleMarkAsPaid = async (id) => {
        if (window.confirm(t('confirm_mark_paid', 'Are you sure you want to mark this order as paid?'))) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                await axios.put(`/api/crm/orders/${id}/pay`, {}, config);
                // Refresh
                const { data } = await axios.get('/api/crm/orders', config);
                setOrders(data);
                // Also update selected order if modal is open
                if (selectedOrder && selectedOrder._id === id) {
                    setSelectedOrder(prev => ({ ...prev, isPaid: true, paidAt: new Date().toISOString() }));
                }
            } catch (error) {
                alert(error.response?.data?.message || 'Error updating payment status');
            }
        }
    };

    const handlePrintInvoice = (order) => {
        const printWindow = window.open('', '', 'height=800,width=800');
        const logoUrl = window.location.origin + '/img/logo.png';
        const formattedDate = new Date(order.createdAt).toLocaleDateString();

        printWindow.document.write('<html><head><title>Invoice ' + order.orderNumber + '</title>');
        printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">');
        printWindow.document.write('</head><body >');
        printWindow.document.write(`
            <div class="container mt-5">
                <div class="row mb-5 align-items-center">
                    <div class="col-6">
                         <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${logoUrl}" alt="Golden Farm" style="height: 60px;">
                            <div>
                                <h3 style="margin: 0; color: #1e293b; font-weight: 800;">Golden<span style="color: #FBBF24;">Farm</span></h3>
                                <p class="text-muted small m-0">Eco-Friendly Agriculture & Marketplace</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 text-end">
                        <h2 class="text-uppercase" style="color: #cbd5e1;">Invoice</h2>
                        <h5 class="fw-bold">#${order.orderNumber || order._id}</h5>
                        <p>Date: ${formattedDate}</p>
                        <span class="badge ${order.isPaid ? 'bg-success' : 'bg-danger'} fs-6">${order.isPaid ? 'PAID' : 'UNPAID'}</span>
                    </div>
                </div>

                <div class="row mb-5">
                    <div class="col-6">
                        <h6 class="fw-bold text-muted text-uppercase">Bill To:</h6>
                        <h5 class="fw-bold text-primary">${order.shippingAddress?.fullName}</h5>
                        <p class="mb-0">${order.shippingAddress?.address}</p>
                        <p class="mb-0">${order.shippingAddress?.city}, ${order.shippingAddress?.country}</p>
                        <p class="mb-0">${order.shippingAddress?.phone}</p>
                        <p>${order.user?.email}</p>
                    </div>
                    <div class="col-6 text-end">
                         <h6 class="fw-bold text-muted text-uppercase">Payment Method:</h6>
                         <p class="fw-bold text-uppercase">${order.paymentMethod}</p>
                    </div>
                </div>

                <table class="table table-bordered mb-4">
                    <thead class="table-light">
                        <tr>
                            <th>Item</th>
                            <th class="text-center">Quantity</th>
                            <th class="text-end">Unit Price</th>
                            <th class="text-end">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td class="text-center">${item.quantity}</td>
                                <td class="text-end">${item.price} MAD</td>
                                <td class="text-end">${(item.price * item.quantity).toLocaleString()} MAD</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-end fw-bold">Subtotal</td>
                            <td class="text-end">${order.subtotal || 0} MAD</td>
                        </tr>
                         <tr>
                            <td colspan="3" class="text-end">Shipping</td>
                            <td class="text-end">${order.shippingFee} MAD</td>
                        </tr>
                        <tr class="table-active">
                             <td colspan="3" class="text-end fw-bold fs-5">Total</td>
                             <td class="text-end fw-bold fs-5 text-primary">${order.totalAmount?.toLocaleString() || order.totalPrice?.toLocaleString()} MAD</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="mt-5 pt-5 text-center text-muted border-top">
                    <p>Thank you for your business!</p>
                    <p class="small">Golden Farm Inc. • Morocco • contact@goldenfarm.ma</p>
                </div>
            </div>
            <script>
                window.onload = function() { window.print(); }
            </script>
        `);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    return (
        <div className="crm-page" dir={currentDir}>
            <div className="container py-5">
                <div className="mb-4">
                    <h1>{t('manage_orders', 'Order Management')}</h1>
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th>{t('order_id', 'Order ID')}</th>
                                        <th>{t('customer', 'Customer')}</th>
                                        <th>{t('date', 'Date')}</th>
                                        <th>{t('payment', 'Payment Method')}</th>
                                        <th>{t('total', 'Total')}</th>
                                        <th>{t('paid', 'Paid')}</th>
                                        <th>{t('status', 'Status')}</th>
                                        <th>{t('actions', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="8" className="text-center py-4">{t('loading', 'Loading...')}</td></tr>
                                    ) : orders.length === 0 ? (
                                        <tr><td colSpan="8" className="text-center py-4">{t('no_orders', 'No orders found')}</td></tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order._id}>
                                                <td><small className="text-muted">{order.orderNumber || order._id.substring(0, 10)}</small></td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="ms-2">
                                                            <div className="fw-bold">{order.user?.name || 'N/A'}</div>
                                                            <small className="text-muted">{order.user?.email}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()} <small className="text-muted">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></td>
                                                <td><span className="badge bg-secondary text-uppercase">{order.paymentMethod}</span></td>
                                                <td className="fw-bold">{order.totalAmount?.toLocaleString() || order.totalPrice?.toLocaleString()} MAD</td>
                                                <td>
                                                    {order.isPaid ? (
                                                        <span className="badge bg-success">{t('yes', 'Yes')}</span>
                                                    ) : (
                                                        <span className="badge bg-danger">{t('no', 'No')}</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${order.status === 'delivered' ? 'success' :
                                                        order.status === 'shipped' ? 'info' :
                                                            order.status === 'cancelled' ? 'danger' : 'warning'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => handleViewOrder(order)}
                                                    >
                                                        <i className="fas fa-eye"></i> {t('view', 'View')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t('order_details', 'Order Details')} - <span className="text-primary">{selectedOrder?.orderNumber}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div className="order-details-content">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex gap-2">
                                    {!selectedOrder.isPaid && (
                                        <Button variant="success" size="sm" onClick={() => handleMarkAsPaid(selectedOrder._id)}>
                                            <i className="fas fa-check-circle me-1"></i> Mark as Paid
                                        </Button>
                                    )}
                                </div>
                                <Button variant="outline-dark" size="sm" onClick={() => handlePrintInvoice(selectedOrder)}>
                                    <i className="fas fa-print me-1"></i> Print Invoice
                                </Button>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h6 className="fw-bold text-muted">{t('shipping_info', 'Shipping Information')}</h6>
                                    <div className="p-3 bg-light rounded">
                                        <p className="mb-1"><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                                        <p className="mb-1"><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
                                        <p className="mb-1"><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                                        <p className="mb-0"><strong>Country:</strong> {selectedOrder.shippingAddress?.country}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="fw-bold text-muted">{t('payment_info', 'Payment Information')}</h6>
                                    <div className="p-3 bg-light rounded">
                                        <p className="mb-1"><strong>Method:</strong> <span className="text-uppercase">{selectedOrder.paymentMethod}</span></p>
                                        <p className="mb-1"><strong>Status:</strong> {selectedOrder.isPaid ? <span className="text-success fw-bold">PAID</span> : <span className="text-danger fw-bold">UNPAID</span>}</p>
                                        {selectedOrder.paidAt && <p className="mb-0"><strong>Paid At:</strong> {new Date(selectedOrder.paidAt).toLocaleString()}</p>}
                                    </div>
                                </div>
                            </div>

                            <h6 className="fw-bold text-muted mb-3">{t('order_items', 'Order Items')}</h6>
                            <div className="table-responsive mb-4">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th className="text-center">Qty</th>
                                            <th className="text-end">Price</th>
                                            <th className="text-end">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {item.image && <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }} />}
                                                        <span>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="text-center">{item.quantity}</td>
                                                <td className="text-end">{item.price} MAD</td>
                                                <td className="text-end">{(item.price * item.quantity).toLocaleString()} MAD</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="3" className="text-end fw-bold">Subtotal:</td>
                                            <td className="text-end">{selectedOrder.subtotal || 0} MAD</td>
                                        </tr>
                                        {selectedOrder.shippingFee > 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-end">Shipping:</td>
                                                <td className="text-end">{selectedOrder.shippingFee} MAD</td>
                                            </tr>
                                        )}
                                        <tr className="table-active">
                                            <td colSpan="3" className="text-end fw-bold fs-5">Grand Total:</td>
                                            <td className="text-end fw-bold fs-5 text-primary">{selectedOrder.totalAmount?.toLocaleString() || selectedOrder.totalPrice?.toLocaleString()} MAD</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        {t('close', 'Close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CRMOrdersPage;
