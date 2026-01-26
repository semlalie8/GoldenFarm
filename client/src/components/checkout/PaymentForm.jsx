import React from 'react';
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { CreditCard, Wallet, Building, Smartphone, DollarSign } from 'lucide-react';

const PaymentForm = ({
    paymentMethod,
    setPaymentMethod,
    cardDetails,
    setCardDetails,
    onBack,
    onSubmit,
    loading,
    t
}) => {
    const paymentMethods = [
        { id: 'cod', name: t('cash_on_delivery', 'Cash on Delivery'), icon: DollarSign, description: t('cod_desc', 'Pay when you receive your order'), color: '#10b981' },
        { id: 'card', name: t('credit_card', 'Credit/Debit Card'), icon: CreditCard, description: t('card_desc', 'Visa, Mastercard, Amex'), color: '#3b82f6' },
        { id: 'paypal', name: 'PayPal', icon: Wallet, description: t('paypal_desc', 'Fast and secure payment'), color: '#0070ba' },
        { id: 'bank_transfer', name: t('bank_transfer', 'Bank Transfer'), icon: Building, description: t('bank_desc', 'Direct bank transfer'), color: '#6b7280' },
        { id: 'mobile_money', name: t('mobile_money', 'Mobile Money'), icon: Smartphone, description: t('mobile_desc', 'Orange Money, Wave, etc.'), color: '#f97316' }
    ];

    return (
        <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-white border-0 p-4">
                <h5 className="mb-0 fw-bold"><CreditCard size={20} className="me-2" /> {t('payment_method', 'Payment Method')}</h5>
            </Card.Header>
            <Card.Body className="p-4">
                <div className="d-flex flex-column gap-3 mb-4">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            className={`p-4 rounded-4 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-2' : 'border'}`}
                            style={{
                                borderColor: paymentMethod === method.id ? method.color : '#e2e8f0',
                                background: paymentMethod === method.id ? `${method.color}08` : '#fff',
                                cursor: 'pointer'
                            }}
                            onClick={() => setPaymentMethod(method.id)}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 rounded-3" style={{ background: `${method.color}15` }}>
                                    <method.icon size={24} style={{ color: method.color }} />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-1 fw-bold">{method.name}</h6>
                                    <p className="mb-0 small text-muted">{method.description}</p>
                                </div>
                                <Form.Check
                                    type="radio"
                                    checked={paymentMethod === method.id}
                                    onChange={() => setPaymentMethod(method.id)}
                                    style={{ transform: 'scale(1.3)' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Card Details Form */}
                {paymentMethod === 'card' && (
                    <div className="bg-light rounded-4 p-4 mb-4">
                        <h6 className="fw-bold mb-3">{t('card_details', 'Card Details')}</h6>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Control
                                    type="text"
                                    placeholder={t('card_number', 'Card Number')}
                                    value={cardDetails.cardNumber}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                    className="rounded-3 py-2"
                                    maxLength={19}
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Control
                                    type="text"
                                    placeholder={t('card_name', 'Name on Card')}
                                    value={cardDetails.cardName}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                                    className="rounded-3 py-2"
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardDetails.expiry}
                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                    className="rounded-3 py-2"
                                    maxLength={5}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="CVV"
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                    className="rounded-3 py-2"
                                    maxLength={4}
                                />
                            </Col>
                        </Row>
                    </div>
                )}

                <div className="d-flex gap-3">
                    <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-pill" onClick={onBack}>
                        {t('back', 'Back')}
                    </Button>
                    <Button
                        className="flex-grow-1 py-3 rounded-pill fw-bold text-white"
                        style={{ backgroundColor: '#cba135', border: 'none' }}
                        onClick={onSubmit}
                        disabled={loading}
                    >
                        {loading ? <Spinner size="sm" /> : t('place_order', 'Place Order')}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PaymentForm;
