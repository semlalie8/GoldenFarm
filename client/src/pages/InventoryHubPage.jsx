import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    FaWarehouse, FaBoxes, FaExclamationTriangle, FaTruckLoading,
    FaSyncAlt, FaDownload, FaQrcode
} from 'react-icons/fa';
import AIAssistant from '../components/AIAssistant';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useSocket } from '../hooks/useSocket';
import toast from 'react-hot-toast';

// Decomposed Components
import InventoryKPIs from '../components/inventory/InventoryKPIs';
import InventoryAnalytics from '../components/inventory/InventoryAnalytics';
import StockMatrix from '../components/inventory/StockMatrix';
import TransactionHistory from '../components/inventory/TransactionHistory';

const InventoryHubPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [data, setData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [showGRNModal, setShowGRNModal] = useState(false);
    const [grnLoading, setGRNLoading] = useState(false);
    const [grnError, setGRNError] = useState(null);
    const [allProducts, setAllProducts] = useState([]);

    // Form State
    const [grnForm, setGrnForm] = useState({
        productId: '',
        warehouseId: '',
        quantity: 0,
        unitCost: 0,
        reference: '',
        batchNumber: ''
    });

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const [statusRes, logsRes] = await Promise.all([
                axios.get('/api/inventory/status', config),
                axios.get('/api/inventory/logs', config)
            ]);
            setData(statusRes.data);
            setLogs(logsRes.data);
        } catch (error) {
            console.error('Error fetching inventory');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/products', config);
            setAllProducts(data);
        } catch (error) {
            console.error('Error fetching products');
        }
    };

    useEffect(() => {
        if (userInfo) {
            fetchInventory();
            fetchAllProducts();
        }
    }, [userInfo]);

    useSocket({
        'INVENTORY_UPDATE': (event) => {
            toast.success(`📦 Stock Update: ${event.productName} ${event.type === 'IN' ? 'received' : 'adjusted'}`);
            fetchInventory();
        },
        'LOW_STOCK': (event) => {
            toast.error(`⚠️ Critical Low Stock: ${event.productName} in ${event.warehouseName}`, { duration: 6000 });
            fetchInventory();
        }
    });

    const handleGRNSubmit = async (e) => {
        e.preventDefault();
        setGRNLoading(true);
        setGRNError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post('/api/inventory/receive', grnForm, config);
            setShowGRNModal(false);
            setGrnForm({ productId: '', warehouseId: '', quantity: 0, unitCost: 0, reference: '', batchNumber: '' });
            fetchInventory();
            toast.success('Goods received successfully!');
        } catch (error) {
            setGRNError(error.response?.data?.message || 'Transaction Failed');
        } finally {
            setGRNLoading(false);
        }
    };

    if (loading) return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <h4 className="fw-bold">{t('synchronizing_stock', 'Synchronizing Stock Reality...')}</h4>
            </div>
        </div>
    );

    return (
        <div className="inventory-hub" dir={currentDir}>
            <style>{`
                .inventory-hub { padding: 40px; background: #f8fafc; min-height: 100vh; color: #1e293b; font-family: 'Outfit', sans-serif; }
                .i-header { margin-bottom: 40px; display: flex; justify-content: space-between; align-items: start; }
                .i-title h1 { font-size: 2.5rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -1px; }
                .i-title p { color: #64748b; font-size: 1.1rem; margin-top: 5px; }
                .low-stock-box { background: #fff1f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin-top: 20px; }
            `}</style>

            <div className="container-fluid">
                <div className="i-header">
                    <div className="i-title">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold">Enterprise v2.0</span>
                            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold">Live Sync Active</span>
                        </div>
                        <h1>Inventory <span>Matrix</span></h1>
                        <p>Global warehouse control & harvest traceability engine</p>
                    </div>
                    <div className="i-actions d-flex gap-3 mt-3">
                        <button className="btn btn-white shadow-sm px-4 py-2 fw-bold" onClick={fetchInventory}>
                            <FaSyncAlt className="me-2" /> Refresh
                        </button>
                        <button className="btn btn-dark shadow-lg px-4 py-2 fw-bold" onClick={() => setShowGRNModal(true)} style={{ background: '#0f172a' }}>
                            <FaTruckLoading className="me-2" /> Goods Receipt (GRN)
                        </button>
                    </div>
                </div>

                {/* KPIs Section */}
                <InventoryKPIs data={data} />

                {/* Analytics Section */}
                <InventoryAnalytics stockData={data?.stockData} />

                <div className="row g-4">
                    <div className="col-lg-8">
                        {/* Stock Matrix Table */}
                        <StockMatrix stockData={data?.stockData} language={i18n.language} />

                        {/* Low Stock Alerts */}
                        {data?.stockData?.filter(s => s.totalStock < 20).length > 0 && (
                            <div className="low-stock-box shadow-sm">
                                <h5 className="text-danger fw-bold d-flex align-items-center gap-2 mb-3">
                                    <FaExclamationTriangle /> Critical Replenishment Alerts
                                </h5>
                                <div className="row g-3">
                                    {data?.stockData?.filter(s => s.totalStock < 20).slice(0, 4).map((lowItem, i) => (
                                        <div key={i} className="col-md-6 col-lg-3">
                                            <div className="p-3 rounded-3 bg-white border-start border-4 border-danger shadow-sm">
                                                <div className="small fw-bold text-dark text-truncate">{lowItem.productInfo[0]?.name?.en}</div>
                                                <div className="h5 mb-0 fw-black text-danger mt-1">{lowItem.totalStock} <span className="small fw-normal text-muted">left</span></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="col-lg-4">
                        <AIAssistant
                            agentType="marketplace"
                            context={{ data, logsCount: logs.length }}
                        />

                        <div className="mt-4">
                            <TransactionHistory logs={logs.slice(0, 10)} />
                        </div>

                        <div className="p-4 rounded-4 shadow-sm bg-white mt-4 border border-dashed border-2">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <FaQrcode size={20} className="text-primary" />
                                <h6 className="fw-bold mb-0">Traceability Scanner</h6>
                            </div>
                            <p className="small text-muted mb-3">Scan product QR codes to view field-to-folk traceability and batch origin.</p>
                            <button className="btn btn-outline-dark w-100 fw-bold border-2">Open QR Engine</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Goods Receipt (GRN) Modal - Keeping integrated for simplicity */}
            <Modal show={showGRNModal} onHide={() => setShowGRNModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 p-4">
                    <Modal.Title className="fw-black h3">
                        {t('goods_receipt_title', 'Goods Receipt Note')}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleGRNSubmit}>
                    <Modal.Body className="p-4 pt-0">
                        {grnError && <Alert variant="danger" className="mb-4">{grnError}</Alert>}
                        <div className="row g-3">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Select Product</Form.Label>
                                    <Form.Select required value={grnForm.productId} onChange={(e) => setGrnForm({ ...grnForm, productId: e.target.value })}>
                                        <option value="">Choose product...</option>
                                        {allProducts.map(p => <option key={p._id} value={p._id}>{p.name.en} ({p.sku})</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Target Warehouse</Form.Label>
                                    <Form.Select required value={grnForm.warehouseId} onChange={(e) => setGrnForm({ ...grnForm, warehouseId: e.target.value })}>
                                        <option value="">Choose warehouse...</option>
                                        {data?.warehouses?.map(w => <option key={w._id} value={w._id}>{w.name} ({w.code})</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Quantity</Form.Label>
                                    <Form.Control type="number" required min="1" value={grnForm.quantity} onChange={(e) => setGrnForm({ ...grnForm, quantity: Number(e.target.value) })} />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Unit Cost (MAD)</Form.Label>
                                    <Form.Control type="number" step="0.01" required value={grnForm.unitCost} onChange={(e) => setGrnForm({ ...grnForm, unitCost: Number(e.target.value) })} />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Batch #</Form.Label>
                                    <Form.Control type="text" placeholder="Traceability ID" value={grnForm.batchNumber} onChange={(e) => setGrnForm({ ...grnForm, batchNumber: e.target.value })} />
                                </Form.Group>
                            </div>
                            <div className="col-12">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Purchase Order Ref</Form.Label>
                                    <Form.Control type="text" required placeholder="e.g. PO-XP-123" value={grnForm.reference} onChange={(e) => setGrnForm({ ...grnForm, reference: e.target.value })} />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="mt-4 p-4 rounded-4 bg-light d-flex justify-content-between align-items-center">
                            <div>
                                <div className="small fw-bold text-muted text-uppercase letter-spacing-1">Estimated Value</div>
                                <div className="h2 mb-0 fw-black text-dark">{(grnForm.quantity * grnForm.unitCost).toLocaleString()} MAD</div>
                            </div>
                            <FaDownload className="text-muted" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 p-4 pt-0">
                        <Button variant="light" className="px-4 py-2 fw-bold" onClick={() => setShowGRNModal(false)}>Cancel</Button>
                        <Button variant="dark" type="submit" className="px-5 py-2 fw-bold shadow-lg" disabled={grnLoading} style={{ background: '#0f172a' }}>
                            {grnLoading ? 'Processing...' : 'Confirm Receipt'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default InventoryHubPage;
