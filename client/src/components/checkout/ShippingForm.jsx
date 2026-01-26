import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { Truck } from 'lucide-react';

const ShippingForm = ({ shippingAddress, setShippingAddress, onSubmit, t }) => {
    return (
        <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-white border-0 p-4">
                <h5 className="mb-0 fw-bold"><Truck size={20} className="me-2" /> {t('shipping_address', 'Shipping Address')}</h5>
            </Card.Header>
            <Card.Body className="p-4">
                <Form onSubmit={onSubmit}>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>{t('full_name', 'Full Name')} *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={shippingAddress.fullName}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                    className="rounded-3 py-2"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>{t('phone', 'Phone Number')} *</Form.Label>
                                <Form.Control
                                    type="tel"
                                    value={shippingAddress.phone}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                    className="rounded-3 py-2"
                                    placeholder="+212 6XX XXX XXX"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>{t('address', 'Street Address')} *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={shippingAddress.address}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                    className="rounded-3 py-2"
                                    placeholder={t('address_placeholder', 'Street name, building, apartment...')}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>{t('city', 'City')} *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    className="rounded-3 py-2"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>{t('postal_code', 'Postal Code')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={shippingAddress.postalCode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>{t('country', 'Country')}</Form.Label>
                                <Form.Select
                                    value={shippingAddress.country}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                    className="rounded-3 py-2"
                                >
                                    <option value="Morocco">Morocco</option>
                                    <option value="France">France</option>
                                    <option value="Spain">Spain</option>
                                    <option value="Germany">Germany</option>
                                    <option value="USA">USA</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button type="submit" className="mt-4 w-100 py-3 rounded-pill fw-bold text-white" style={{ backgroundColor: '#cba135', border: 'none' }}>
                        {t('continue_to_payment', 'Continue to Payment')}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ShippingForm;
