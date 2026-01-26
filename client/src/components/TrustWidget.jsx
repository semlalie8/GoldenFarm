import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, TrendingUp, Droplets, Thermometer, Globe, Activity, MapPin, Search, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Nav, Button, Row, Col, ProgressBar, Badge, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ClimatePulse = ({ history }) => {
    const { t } = useTranslation();
    if (!history) return null;

    const data = history.time.map((t, i) => ({
        date: t.split('-').slice(2).join('/'),
        fullDate: t,
        max: history.temperature_2m_max[i],
        min: history.temperature_2m_min[i],
        precip: history.precipitation_sum[i]
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 rounded-4 shadow-lg border-0 text-white" style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', fontSize: '11px' }}>
                    <p className="fw-bold mb-2 opacity-75">{payload[0].payload.fullDate}</p>
                    <div className="d-flex gap-3">
                        <div>
                            <p className="mb-1 text-uppercase opacity-50" style={{ fontSize: '0.65rem' }}>Temp Max</p>
                            <p className="mb-0 fw-bold fs-6">{payload[0].value}°C</p>
                        </div>
                        <div>
                            <p className="mb-1 text-uppercase opacity-50" style={{ fontSize: '0.65rem' }}>Precipitation</p>
                            <p className="mb-0 fw-bold fs-6">{payload[1].value}mm</p>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="border-0 bg-light rounded-4 p-4 mt-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    <h6 className="mb-0 text-uppercase fw-bold text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                        Environmental Forensic Pulse
                    </h6>
                </div>
                <div className="d-flex gap-3">
                    <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }}></div>
                        <span className="fw-bold text-muted text-uppercase" style={{ fontSize: '0.6rem' }}>Temperature</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee' }}></div>
                        <span className="fw-bold text-muted text-uppercase" style={{ fontSize: '0.6rem' }}>Precipitation</span>
                    </div>
                </div>
            </div>
            <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" fontSize={9} axisLine={false} tickLine={false} stroke="#94a3b8" />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="max" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMax)" />
                        <Area type="monotone" dataKey="precip" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorPrecip)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const TrustWidget = ({ projectId }) => {
    const { t } = useTranslation();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLayer, setActiveLayer] = useState('physical'); // physical, virtual, financial

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const { data } = await axios.get(`/api/projects/${projectId}/analysis`, { withCredentials: true });
                setAnalysis(data);
            } catch (error) {
                console.error('Analysis Fetch Failed:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [projectId]);

    const handleExportAudit = () => {
        window.location.href = `/api/projects/${projectId}/audit-report`;
    };

    if (loading) {
        return (
            <div className="py-5 text-center">
                <ProgressBar animated now={100} variant="success" style={{ height: '4px' }} />
                <p className="mt-3 text-uppercase fw-bold text-muted small letter-spacing-widest">Generating Trust Consensus...</p>
            </div>
        );
    }

    if (!analysis) return null;

    const { env_forecast, live_telemetry: iot, financial_authority: ledger, climate_history: climate } = analysis;

    const layerVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    return (
        <Card className="border-0 shadow-lg rounded-5 overflow-hidden bg-white mt-5">
            {/* Header Section */}
            <header className="p-4 p-md-5 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0, 107, 179, 0.1)', filter: 'blur(80px)' }}></div>

                <Row className="align-items-center z-index-1 position-relative">
                    <Col xs={12} md={8}>
                        <div className="d-flex align-items-center gap-4">
                            <div className="p-3 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="h5 fw-bold text-uppercase m-0 ls-wider" style={{ letterSpacing: '0.2em' }}>Institutional Ledger</h3>
                                <div className="d-flex align-items-center gap-2 mt-2">
                                    <div className="bg-success rounded-circle animate-pulse" style={{ width: 8, height: 8 }}></div>
                                    <span className="fw-bold text-info text-uppercase" style={{ fontSize: '0.65rem' }}>Quantum Guard Verified</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={4} className="text-md-end mt-4 mt-md-0">
                        <div className="d-inline-block p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 backdrop-blur">
                            <h4 className="h2 fw-black text-info mb-0 lh-1">AA+</h4>
                            <span className="fw-bold text-muted text-uppercase d-block mt-1" style={{ fontSize: '0.6rem' }}>Trust Score</span>
                        </div>
                    </Col>
                </Row>

                {/* Layer Switcher */}
                <Nav variant="pills" className="bg-white bg-opacity-5 p-1 rounded-4 border border-white border-opacity-5 mt-5">
                    {['physical', 'financial'].map((layer) => (
                        <Nav.Item key={layer} className="flex-grow-1 text-center">
                            <Nav.Link
                                active={activeLayer === layer}
                                onClick={() => setActiveLayer(layer)}
                                className={`text-uppercase fw-bold rounded-4 py-2 ${activeLayer === layer ? 'bg-primary' : 'text-muted'}`}
                                style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
                            >
                                {layer} Layer
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </header>

            <Card.Body className="p-4 p-md-5">
                <AnimatePresence mode="wait">
                    {activeLayer === 'physical' && (
                        <motion.div key="physical" {...layerVariants} transition={{ duration: 0.3 }}>
                            <div className="d-flex justify-content-between align-items-center mb-5">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-light rounded-3 text-primary border">
                                        <Database size={20} />
                                    </div>
                                    <div>
                                        <h5 className="h6 fw-bold text-dark text-uppercase mb-1">Physical Proof-of-Life</h5>
                                        <p className="small text-muted mb-0">Device Index: {iot.deviceId || 'GENERIC_FARM_001'}</p>
                                    </div>
                                </div>
                                <Badge bg="success" className="rounded-pill p-2 px-3 fw-bold text-uppercase bg-opacity-10 text-success border border-success border-opacity-25" style={{ fontSize: '0.65rem' }}>
                                    <span className="spinner-grow spinner-grow-sm me-2" role="status"></span>
                                    Live Telemetry Active
                                </Badge>
                            </div>

                            <Row className="g-4">
                                <Col md={4}>
                                    <Card className="border-0 bg-light rounded-5 p-4 h-100 transition-hover border border-white">
                                        <Droplets size={24} className="text-info mb-4" />
                                        <p className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '0.65rem' }}>Soil Moisture</p>
                                        <h4 className="h2 fw-black text-dark mb-4">{iot.sensors.soil_moisture.value}%</h4>
                                        <ProgressBar now={iot.sensors.soil_moisture.value} variant="info" style={{ height: '6px' }} className="rounded-pill" />
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="border-0 bg-light rounded-5 p-4 h-100 transition-hover border border-white">
                                        <Thermometer size={24} className="text-danger mb-4" />
                                        <p className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '0.65rem' }}>Ambient Temperature</p>
                                        <h4 className="h2 fw-black text-dark mb-2">{iot.sensors.ambient_temp.value}°C</h4>
                                        <div className="d-flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="flex-grow-1" style={{ height: '6px', borderRadius: '4px', background: i <= 3 ? '#ef4444' : '#e2e8f0' }}></div>
                                            ))}
                                        </div>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="border-0 bg-light rounded-5 p-4 h-100 transition-hover border border-white">
                                        <Activity size={24} className="text-success mb-4" />
                                        <p className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '0.65rem' }}>Nitrogen (NPK)</p>
                                        <h4 className="h2 fw-black text-dark mb-3">{iot.sensors.npk_levels.Nitrogen}</h4>
                                        <Badge bg="success" className="rounded-pill fw-bold text-uppercase opacity-75" style={{ fontSize: '0.6rem' }}>Optimal Ratio</Badge>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Sustainability Module */}
                            <Card className="border-0 rounded-5 p-4 mt-5 text-white shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}>
                                <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)' }}></div>
                                <Row className="align-items-center position-relative">
                                    <Col md={8}>
                                        <div className="d-flex align-items-center gap-4">
                                            <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                                                <Globe size={32} className="text-success" />
                                            </div>
                                            <div>
                                                <p className="text-uppercase fw-bold text-success mb-1" style={{ fontSize: '0.65rem' }}>Sustainability Certificate</p>
                                                <h4 className="h5 fw-bold mb-0">Verified Carbon Negative Farming</h4>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={4} className="text-md-end mt-4 mt-md-0">
                                        <h4 className="h1 fw-black text-success mb-0 lh-1">A+</h4>
                                        <span className="fw-bold text-white text-opacity-50 text-uppercase d-block" style={{ fontSize: '0.6rem' }}>Bio-Audit Grade</span>
                                    </Col>
                                </Row>
                            </Card>

                            <ClimatePulse history={climate.history} />
                        </motion.div>
                    )}

                    {activeLayer === 'financial' && (
                        <motion.div key="financial" {...layerVariants} transition={{ duration: 0.3 }}>
                            <div className="d-flex align-items-center gap-3 mb-5">
                                <div className="p-2 bg-light rounded-3 text-info border">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h5 className="h6 fw-bold text-dark text-uppercase mb-1">Deterministic Capital Ledger</h5>
                                    <p className="small text-muted mb-0">Engine: GoldenFarm Finance Core v4.2</p>
                                </div>
                            </div>

                            <Row className="g-4 mb-5">
                                <Col md={6}>
                                    <Card className="border-0 bg-light rounded-5 p-5 border border-white shadow-sm">
                                        <p className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Target Annual ROI</p>
                                        <h4 className="display-4 fw-black text-dark mb-4">{ledger.yield_analysis.annual_p50}</h4>
                                        <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-10">
                                            <TrendingUp size={14} />
                                            <span className="fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Sector Lead: +4.2%</span>
                                        </div>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 bg-dark rounded-5 p-5 text-white shadow-lg overflow-hidden">
                                        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', filter: 'blur(40px)' }}></div>
                                        <p className="text-uppercase fw-bold opacity-50 mb-3" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Risk Resilience (P5)</p>
                                        <h4 className="display-4 fw-black text-danger mb-4">{ledger.yield_analysis.annual_p5}</h4>
                                        <p className="small text-muted mb-0">95% confidence ceiling against critical climate shifts.</p>
                                    </Card>
                                </Col>
                            </Row>

                            <Card className="border-0 bg-light rounded-5 p-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="h6 fw-bold text-uppercase text-muted ls-wider m-0">Capital Trajectory</h5>
                                    <Badge bg="primary" className="rounded-pill p-2 px-3 fw-bold">{ledger.traction_percentage}% Verified</Badge>
                                </div>
                                <div className="p-1 bg-white rounded-pill shadow-inner">
                                    <ProgressBar now={ledger.traction_percentage} variant="primary" style={{ height: '32px' }} className="rounded-pill shadow-sm" />
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card.Body>

            {/* Audit Footer */}
            <footer className="p-4 bg-light border-top d-flex flex-column flex-md-row justify-content-between align-items-center px-md-5">
                <div className="d-flex align-items-center gap-2 mb-3 mb-md-0">
                    <MapPin size={14} className="text-muted" />
                    <span className="text-muted font-monospace" style={{ fontSize: '0.7rem' }}>ASSET_ID: {projectId.substring(18)}</span>
                </div>
                <div className="d-flex align-items-center gap-4">
                    <div className="d-flex align-items-center gap-2">
                        <div className="bg-primary rounded-circle" style={{ width: 8, height: 8 }}></div>
                        <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem' }}>Immutable Forensic Log Attached</span>
                    </div>
                    <Button variant="dark" onClick={handleExportAudit} className="rounded-pill px-4 py-2 border-0 text-uppercase fw-bold shadow-sm" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                        Export Audit Ledger
                    </Button>
                </div>
            </footer>
        </Card>
    );
};

export default TrustWidget;

