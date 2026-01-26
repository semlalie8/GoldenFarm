import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CheckoutSummary = ({ items, subtotal, shippingFee, tax, total, t }) => {
    return (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '100px' }}>
            <div className="bg-dark p-4 text-white">
                <h5 className="fw-bold text-uppercase m-0 ls-1">{t('order_summary', 'Order Summary')}</h5>
            </div>
            <div className="p-4 bg-white">
                <ListGroup variant="flush" className="mb-4">
                    {items.map((item) => (
                        <ListGroup.Item key={item.product} className="border-0 px-0 py-3 bg-transparent">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="position-relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            className="rounded-3 shadow-sm border"
                                        />
                                        <Badge bg="success" className="position-absolute translate-middle rounded-pill fw-bold" style={{ top: '0', left: '100%', fontSize: '10px' }}>
                                            {item.quantity}
                                        </Badge>
                                    </div>
                                    <span className="small fw-bold text-dark">{item.name}</span>
                                </div>
                                <span className="fw-bold text-dark">{item.price * item.quantity} <small className="text-muted">MAD</small></span>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary">{t('subtotal', 'Subtotal')}</span>
                        <span className="fw-bold">{subtotal.toFixed(2)} MAD</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary">{t('shipping_fee', 'Shipping')}</span>
                        <span className="fw-bold">{shippingFee.toFixed(2)} MAD</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <span className="text-secondary">{t('tax', 'Estimated Tax (20%)')}</span>
                        <span className="fw-bold">{tax.toFixed(2)} MAD</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-4 border">
                        <span className="fw-black text-dark text-uppercase">{t('total', 'Grand Total')}</span>
                        <span className="fw-black text-primary h4 mb-0">{total.toFixed(2)} MAD</span>
                    </div>
                </div>

                <div className="bg-info bg-opacity-10 p-3 rounded-4 mt-4 border border-info border-opacity-20 d-flex gap-2">
                    <ShieldCheck size={20} className="text-info shrink-0 mt-1" />
                    <p className="small text-dark mb-0 opacity-75">
                        {t('secure_checkout_msg', 'Your transaction is protected by end-to-end encryption and agricultural asset compliance protocols.')}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default CheckoutSummary;
