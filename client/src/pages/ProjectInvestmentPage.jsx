import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';
import { CreditCard, Wallet, Building, Smartphone, ArrowLeft, ShieldCheck, CheckCircle, Info } from 'lucide-react';
import SEO from '../components/SEO';
import emailjs from '@emailjs/browser';

// EmailJS environment variables
const serviceId = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;

const ProjectInvestmentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);

    const queryParams = new URLSearchParams(location.search);
    const initialAmount = queryParams.get('amount') || 100;

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [executing, setExecuting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [step, setStep] = useState(1); // 1: Method, 2: Details
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [amount, setAmount] = useState(initialAmount);

    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    });

    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountNumber: '',
        accountHolder: ''
    });

    const [mobileDetails, setMobileDetails] = useState({
        phoneNumber: userInfo?.phone || '',
        provider: 'orange'
    });

    useEffect(() => {
        if (!userInfo) {
            navigate(`/login?redirect=/projects/${id}/invest?amount=${amount}`);
            return;
        }

        const fetchProject = async () => {
            try {
                const { data } = await axios.get(`/api/projects/${id}`);
                setProject(data);
                setLoading(false);
            } catch (err) {
                setError('Project protocol not found');
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, userInfo, navigate, amount]);

    const handleConfirmMethod = () => {
        if (paymentMethod === 'wallet') {
            handleFinalize();
        } else {
            setStep(2);
        }
    };

    const handleFinalize = async () => {
        setExecuting(true);
        setError(null);
        try {
            const payload = {
                campaignId: id,
                amount: Number(amount),
                paymentMethod: paymentMethod,
                paymentDetails: paymentMethod === 'card' ? cardDetails :
                    paymentMethod === 'bank_transfer' ? bankDetails :
                        paymentMethod === 'mobile_money' ? mobileDetails : {}
            };

            await axios.post('/api/crowdfunding/pledge', payload, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
                withCredentials: true
            });

            // Send admin notification email via EmailJS (from browser)
            try {
                const investmentData = {
                    name: 'Golden Farm System',
                    email: userInfo?.email || 'investor@goldenfarm.ma',
                    subject: `💰 New Investment: ${amount} DH in "${project.title?.en || project.title}"`,
                    message: `A new investment has been authorized!\n\nInvestor: ${userInfo.name}\nProject: ${project.title?.en || project.title}\nAmount: ${amount} DH\nPayment Method: ${paymentMethod.toUpperCase()}\n\nLog in to the dashboard for more details.`
                };

                await emailjs.send(serviceId, templateId, investmentData, publicKey);
                console.log('✅ Investment notification email sent!');
            } catch (emailErr) {
                console.error('❌ Investment notification failed:', emailErr);
            }

            setSuccess(true);
            setExecuting(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Protocol execution failed');
            setExecuting(false);
        }
    };

    if (loading) return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <Spinner animation="border" variant="primary" />
        </div>
    );

    if (success) return (
        <Container className="py-5 mt-5 text-center">
            <Card className="border-0 shadow-lg p-5 rounded-5 bg-white mx-auto" style={{ maxWidth: '600px' }}>
                <CheckCircle size={80} className="text-success mb-4 mx-auto" strokeWidth={1.5} />
                <h1 className="fw-black text-dark text-uppercase mb-3">Protocol Initialized</h1>
                <p className="text-secondary mb-4 fs-5">Success! Your investment of <strong>{Number(amount).toLocaleString()} DH</strong> in <strong>{project.title?.en || project.title}</strong> has been successfully authorized.</p>
                <div className="d-grid gap-3">
                    <Button as={Link} to={`/projects/${id}`} variant="primary" className="rounded-pill py-3 fw-bold">Return to Asset</Button>
                    <Button as={Link} to="/dashboard" variant="outline-secondary" className="rounded-pill py-3 fw-bold">Go to Dashboard</Button>
                </div>
            </Card>
        </Container>
    );

    const paymentMethods = [
        { id: 'wallet', name: t('wallet_balance', 'Wallet Balance'), icon: Wallet, description: t('wallet_desc', 'Use your internal credit'), color: '#10b981' },
        { id: 'card', name: t('credit_card', 'Credit/Debit Card'), icon: CreditCard, description: t('card_desc', 'Visa, Mastercard, Amex'), color: '#3b82f6' },
        { id: 'bank_transfer', name: t('bank_transfer', 'Bank Transfer'), icon: Building, description: t('bank_desc', 'Direct bank transfer'), color: '#6b7280' },
        { id: 'mobile_money', name: t('mobile_money', 'Mobile Money'), icon: Smartphone, description: t('mobile_desc', 'Orange Money, Wave, Pay'), color: '#f97316' }
    ];

    return (
        <div className="bg-light min-vh-100 py-5 mt-4">
            <SEO title="Confirm Investment | Golden Farm" />
            <Container>
                <Link to={`/projects/${id}`} className="text-decoration-none text-secondary d-inline-flex align-items-center gap-2 mb-4 hover-translate-x">
                    <ArrowLeft size={20} /> <span className="fw-bold tracking-tighter">Back to Project Acquisition</span>
                </Link>

                <Row className="justify-content-center">
                    <Col lg={10}>
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div>
                                <h1 className="display-5 fw-black text-dark text-uppercase m-0">Investment Protocol</h1>
                                <p className="text-secondary fw-medium mb-0 mt-1 opacity-75">Secure Multi-Stage Deployment Architecture</p>
                            </div>
                            <div className="text-end">
                                <Badge bg="dark" className="px-3 py-2 text-uppercase ls-1">Project ID: {id.substring(0, 8)}</Badge>
                            </div>
                        </div>

                        <Row className="g-4">
                            {/* Left: Input & Details */}
                            <Col md={7}>
                                {error && <Alert variant="danger" className="rounded-4 border-0 shadow-sm">{error}</Alert>}

                                {step === 1 ? (
                                    <Card className="border-0 shadow-sm rounded-5 p-4 mb-4">
                                        <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                            <ShieldCheck size={24} className="text-primary" />
                                            1. Selection of Funding Mode
                                        </h4>
                                        <div className="d-flex flex-column gap-3 mb-4">
                                            {paymentMethods.map((method) => (
                                                <div
                                                    key={method.id}
                                                    className={`p-3 rounded-4 cursor-pointer transition-all border-2 ${paymentMethod === method.id ? '' : 'border-transparent bg-light opacity-75'}`}
                                                    style={{
                                                        borderColor: paymentMethod === method.id ? method.color : 'transparent',
                                                        background: paymentMethod === method.id ? `${method.color}10` : '#f8fafc',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                >
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="p-2 rounded-3" style={{ background: `${method.color}25` }}>
                                                            <method.icon size={20} style={{ color: method.color }} />
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-0 fw-bold">{method.name}</h6>
                                                            <p className="mb-0 small text-muted" style={{ fontSize: '11px' }}>{method.description}</p>
                                                        </div>
                                                        <Form.Check
                                                            type="radio"
                                                            checked={paymentMethod === method.id}
                                                            readOnly
                                                            style={{ transform: 'scale(1.2)' }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            onClick={handleConfirmMethod}
                                            className="w-100 py-3 rounded-pill fw-black text-uppercase shadow-lg border-0 transition-hover"
                                            style={{ background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)', letterSpacing: '0.1em' }}
                                        >
                                            {paymentMethod === 'wallet' ? 'Confirm & Execute' : 'Next: Payment Details'}
                                        </Button>
                                    </Card>
                                ) : (
                                    <Card className="border-0 shadow-sm rounded-5 p-4 mb-4">
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                                <Info size={24} className="text-primary" />
                                                2. {paymentMethod.replace('_', ' ').toUpperCase()} INFO
                                            </h4>
                                            <Button variant="link" className="text-muted p-0 text-decoration-none small fw-bold" onClick={() => setStep(1)}>Change Mode</Button>
                                        </div>

                                        {paymentMethod === 'card' && (
                                            <Row className="g-3">
                                                <Col md={12}>
                                                    <Form.Label className="small fw-bold text-uppercase text-muted">Card Number</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="XXXX XXXX XXXX XXXX"
                                                        className="py-3 rounded-3"
                                                        value={cardDetails.cardNumber}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Label className="small fw-bold text-uppercase text-muted">Cardholder Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="M. AHMED"
                                                        className="py-3 rounded-3"
                                                        value={cardDetails.cardName}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                                                    />
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Label className="small fw-bold text-uppercase text-muted">Expiry Date</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="py-3 rounded-3"
                                                        value={cardDetails.expiry}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                    />
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Label className="small fw-bold text-uppercase text-muted">CVV</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="XXX"
                                                        className="py-3 rounded-3"
                                                        value={cardDetails.cvv}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                    />
                                                </Col>
                                            </Row>
                                        )}

                                        {paymentMethod === 'bank_transfer' && (
                                            <Row className="g-3">
                                                <Col md={12}>
                                                    <Form.Label className="small fw-bold text-uppercase text-muted">Sender Bank Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="CIH, BMCE, etc."
                                                        className="py-3 rounded-3"
                                                        value={bankDetails.bankName}
                                                        onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Label className="small fw-bold text-uppercase text-muted">Account Number (RIB)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="24 Digits"
                                                        className="py-3 rounded-3"
                                                        value={bankDetails.accountNumber}
                                                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Label className="small fw-bold text-uppercase text-muted">Account Holder</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Full Legal Name"
                                                        className="py-3 rounded-3"
                                                        value={bankDetails.accountHolder}
                                                        onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                                                    />
                                                </Col>
                                            </Row>
                                        )}

                                        {paymentMethod === 'mobile_money' && (
                                            <Row className="g-3">
                                                <Col md={12}>
                                                    <Form.Label className="small fw-bold text-uppercase text-muted">Provider</Form.Label>
                                                    <Form.Select
                                                        className="py-3 rounded-3"
                                                        value={mobileDetails.provider}
                                                        onChange={(e) => setMobileDetails({ ...mobileDetails, provider: e.target.value })}
                                                    >
                                                        <option value="orange">Orange Money</option>
                                                        <option value="wave">Wave</option>
                                                        <option value="inwi">Inwi Money</option>
                                                    </Form.Select>
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Label className="small fw-bold text-uppercase text-muted">Phone Number</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        placeholder="+212 6..."
                                                        className="py-3 rounded-3"
                                                        value={mobileDetails.phoneNumber}
                                                        onChange={(e) => setMobileDetails({ ...mobileDetails, phoneNumber: e.target.value })}
                                                    />
                                                </Col>
                                            </Row>
                                        )}

                                        <Button
                                            onClick={handleFinalize}
                                            disabled={executing}
                                            className="w-100 py-3 mt-4 rounded-pill fw-black text-uppercase shadow-lg border-0 transition-hover"
                                            style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', letterSpacing: '0.1em' }}
                                        >
                                            {executing ? <Spinner size="sm" /> : 'Authorize Transaction'}
                                        </Button>
                                    </Card>
                                )}
                            </Col>

                            {/* Right: Summary Sidebar */}
                            <Col md={5}>
                                <Card className="border-0 shadow-sm rounded-5 overflow-hidden sticky-top" style={{ top: '100px' }}>
                                    <div className="bg-dark p-4 text-white">
                                        <h5 className="fw-black text-uppercase m-0 ls-1">Asset Summary</h5>
                                    </div>
                                    <div className="p-4 bg-white">
                                        <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-4">
                                            <img
                                                src={project.images?.[0] || '/img/placeholder_project.png'}
                                                alt="project"
                                                style={{ width: '60px', height: '60px', borderRadius: '15px', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <h6 className="fw-bold mb-0">{project.title?.en || project.title}</h6>
                                                <span className="small text-muted text-uppercase">{project.category}</span>
                                            </div>
                                        </div>

                                        <ListGroup variant="flush">
                                            <ListGroup.Item className="border-0 px-0 d-flex justify-content-between">
                                                <span className="text-secondary fw-medium">Investment Amount</span>
                                                <span className="fw-black">{Number(amount).toLocaleString()} DH</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="border-0 px-0 d-flex justify-content-between">
                                                <span className="text-secondary fw-medium">Expected ROI</span>
                                                <span className="text-info fw-black">{project.roi}%</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="border-0 px-0 d-flex justify-content-between">
                                                <span className="text-secondary fw-medium">Service Fee</span>
                                                <span className="text-muted fw-bold">0.00 DH</span>
                                            </ListGroup.Item>
                                            <hr className="my-3 opacity-10" />
                                            <ListGroup.Item className="border-0 px-0 d-flex justify-content-between align-items-center">
                                                <span className="fw-black text-dark fs-5 uppercase">Total Protocol</span>
                                                <span className="fw-black text-primary h3 mb-0">{Number(amount).toLocaleString()} DH</span>
                                            </ListGroup.Item>
                                        </ListGroup>

                                        <div className="bg-primary bg-opacity-5 p-3 rounded-4 mt-4 border border-primary border-opacity-10">
                                            <div className="d-flex gap-3 align-items-start">
                                                <ShieldCheck className="text-primary mt-1" size={20} />
                                                <p className="small text-dark mb-0 fw-medium">
                                                    Your capital is secured via smart governance protocols and institutional-grade escrow.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProjectInvestmentPage;
