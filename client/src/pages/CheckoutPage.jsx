import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { fetchCart, clearCart } from '../slices/cartSlice';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle, Wallet, Building, Smartphone, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentForm from '../components/checkout/PaymentForm';

// EmailJS environment variables
const serviceId = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;

const CheckoutPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { items, totalAmount } = useSelector((state) => state.cart);

    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(null);

    const [shippingAddress, setShippingAddress] = useState({
        fullName: userInfo?.name || '',
        phone: userInfo?.phone || '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Morocco'
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchCart());
        } else {
            navigate('/login?redirect=checkout');
        }
    }, [dispatch, userInfo, navigate]);

    const shippingFee = totalAmount * 0.20;
    const tax = totalAmount * 0.2;
    const grandTotal = totalAmount + shippingFee + tax;

    const paymentMethods = [
        { id: 'cod', name: t('cash_on_delivery', 'Cash on Delivery') },
        { id: 'card', name: t('credit_card', 'Credit/Debit Card') },
        { id: 'paypal', name: 'PayPal' },
        { id: 'bank_transfer', name: t('bank_transfer', 'Bank Transfer') },
        { id: 'mobile_money', name: t('mobile_money', 'Mobile Money') }
    ];

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
            setError(t('fill_required_fields', 'Please fill in all required fields'));
            return;
        }
        setError(null);
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError(null);

        try {
            // Create order
            const orderRes = await axios.post('/api/orders', {
                shippingAddress,
                paymentMethod,
                notes: ''
            });

            const order = orderRes.data.order;

            // Process payment
            const paymentRes = await axios.post(`/api/orders/${order._id}/process-payment`, {
                paymentMethod,
                paymentDetails: paymentMethod === 'card' ? cardDetails : {}
            });

            setOrderSuccess({
                orderNumber: order.orderNumber,
                total: grandTotal,
                paymentMethod: paymentMethods.find(m => m.id === paymentMethod)?.name
            });

            // Send admin notification email via EmailJS (from browser)
            try {
                const itemsList = items.map(item => `${item.name} x${item.quantity}`).join(', ');
                const emailData = {
                    name: 'Golden Farm System',
                    email: userInfo?.email || 'orders@goldenfarm.ma',
                    subject: `🛒 New Order: ${order.orderNumber}`,
                    message: `A new order has been placed!\n\nOrder #: ${order.orderNumber}\nCustomer: ${shippingAddress.fullName}\nPhone: ${shippingAddress.phone}\nAddress: ${shippingAddress.address}, ${shippingAddress.city}\n\nItems: ${itemsList}\n\nPayment Method: ${paymentMethod.toUpperCase()}\nTotal Amount: ${grandTotal.toFixed(2)} MAD`
                };

                await emailjs.send(serviceId, templateId, emailData, publicKey);
                console.log('✅ Order notification email sent successfully!');
            } catch (emailErr) {
                console.error('❌ Email notification failed:', emailErr);
            }

            dispatch(clearCart());
            setStep(3);

        } catch (err) {
            setError(err.response?.data?.message || t('order_failed', 'Failed to place order. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) {
        return null;
    }

    if (items.length === 0 && step !== 3) {
        return (
            <Container className="py-5">
                <Card className="text-center p-5 border-0 shadow-sm rounded-4">
                    <h3>{t('cart_empty', 'Your Cart is Empty')}</h3>
                    <p className="text-muted">{t('add_items_first', 'Please add items to your cart before checkout.')}</p>
                    <Link to="/marketplace" className="btn text-white px-4 rounded-pill" style={{ backgroundColor: '#cba135' }}>
                        {t('browse_products', 'Browse Products')}
                    </Link>
                </Card>
            </Container>
        );
    }

    return (
        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
            <Container className="py-5">
                {/* Header */}
                <div className="mb-4">
                    {step < 3 && (
                        <Link to="/cart" className="text-decoration-none text-muted d-flex align-items-center gap-2 mb-3">
                            <ArrowLeft size={18} /> {t('back_to_cart', 'Back to Cart')}
                        </Link>
                    )}
                    <h1 className="fw-bold" style={{ color: '#1e293b' }}>
                        <ShieldCheck size={32} className="me-3" style={{ color: '#cba135' }} />
                        {step === 3 ? t('order_confirmed', 'Order Confirmed') : t('checkout', 'Checkout')}
                    </h1>
                </div>

                {/* Progress Steps */}
                {step < 3 && (
                    <div className="d-flex justify-content-center mb-5">
                        {[
                            { num: 1, label: t('shipping', 'Shipping') },
                            { num: 2, label: t('payment', 'Payment') },
                            { num: 3, label: t('confirmation', 'Confirmation') }
                        ].map((s, i) => (
                            <div key={s.num} className="d-flex align-items-center">
                                <div className={`d-flex align-items-center justify-content-center rounded-circle ${step >= s.num ? 'text-white' : 'text-muted bg-light'}`}
                                    style={{ width: 40, height: 40, backgroundColor: step >= s.num ? '#cba135' : undefined }}>
                                    {step > s.num ? <CheckCircle size={20} /> : s.num}
                                </div>
                                <span className={`ms-2 me-4 ${step >= s.num ? 'fw-bold' : 'text-muted'}`}>{s.label}</span>
                                {i < 2 && <div style={{ width: 50, height: 2, background: step > s.num ? '#cba135' : '#e2e8f0' }} className="me-4" />}
                            </div>
                        ))}
                    </div>
                )}

                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible className="rounded-4">{error}</Alert>}

                {/* Step 3: Order Confirmation */}
                {step === 3 && orderSuccess && (
                    <Card className="border-0 shadow-lg rounded-4 p-5 text-center mx-auto" style={{ maxWidth: '600px' }}>
                        <div className="mb-4">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                                style={{ width: 100, height: 100, background: 'rgba(16, 185, 129, 0.1)' }}>
                                <CheckCircle size={60} style={{ color: '#10b981' }} />
                            </div>
                        </div>
                        <h2 className="fw-bold mb-3">{t('thank_you', 'Thank You for Your Order!')}</h2>
                        <p className="text-muted mb-4">{t('order_received', 'Your order has been received and is being processed.')}</p>

                        <div className="bg-light rounded-4 p-4 mb-4">
                            <p className="mb-2"><strong>{t('order_number', 'Order Number')}:</strong></p>
                            <h4 style={{ color: '#cba135' }}>{orderSuccess.orderNumber}</h4>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">{t('total_paid', 'Total')}</span>
                            <span className="fw-bold">{orderSuccess.total.toLocaleString()} DH</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <span className="text-muted">{t('payment_method', 'Payment Method')}</span>
                            <span className="fw-bold">{orderSuccess.paymentMethod}</span>
                        </div>

                        <div className="d-flex gap-3 justify-content-center">
                            <Link to="/orders" className="btn btn-outline-secondary rounded-pill px-4">
                                {t('view_orders', 'View My Orders')}
                            </Link>
                            <Link to="/marketplace" className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#cba135' }}>
                                {t('continue_shopping', 'Continue Shopping')}
                            </Link>
                        </div>
                    </Card>
                )}

                {step < 3 && (
                    <Row className="g-4">
                        <Col lg={8}>
                            {/* Step 1: Shipping */}
                            {step === 1 && (
                                <ShippingForm
                                    shippingAddress={shippingAddress}
                                    setShippingAddress={setShippingAddress}
                                    onSubmit={handleShippingSubmit}
                                    t={t}
                                />
                            )}

                            {/* Step 2: Payment */}
                            {step === 2 && (
                                <PaymentForm
                                    paymentMethod={paymentMethod}
                                    setPaymentMethod={setPaymentMethod}
                                    cardDetails={cardDetails}
                                    setCardDetails={setCardDetails}
                                    onBack={() => setStep(1)}
                                    onSubmit={handlePlaceOrder}
                                    loading={loading}
                                    t={t}
                                />
                            )}
                        </Col>

                        {/* Order Summary Sidebar */}
                        <Col lg={4}>
                            <CheckoutSummary
                                items={items.map(item => ({
                                    product: item.product?._id,
                                    name: typeof item.product?.name === 'object' ? (item.product.name.en || 'Product') : (item.product?.name || 'Product'),
                                    image: item.product?.image || '/img/placeholder.png',
                                    quantity: item.quantity,
                                    price: item.price
                                }))}
                                subtotal={totalAmount}
                                shippingFee={shippingFee}
                                tax={tax}
                                total={grandTotal}
                                t={t}
                            />
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default CheckoutPage;
