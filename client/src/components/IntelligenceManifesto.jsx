import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Target, Cpu, CheckCircle, AlertCircle, RefreshCcw, BrainCircuit } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Card, Row, Col, Button, Badge, ProgressBar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const IntelligenceManifesto = ({ projectId }) => {
    const { t } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [consensus, setConsensus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [executing, setExecuting] = useState(false);

    const fetchConsensus = async () => {
        setLoading(true);
        try {
            const endpoint = (projectId && projectId !== 'GLOBAL')
                ? `/api/intelligence/project/${projectId}/analyze`
                : `/api/intelligence/global/analyze`;

            const { data } = await axios.post(endpoint, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
                withCredentials: true
            });
            setConsensus(data.manifesto);
        } catch (error) {
            console.error("Neural Error", error);
            toast.error("Neural Engine Connectivity Interrupted");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchConsensus();
    }, [projectId]);

    const handleExecuteProtocol = async (taskDescription, agentName) => {
        setExecuting(true);
        try {
            await axios.post('/api/intelligence/execute-task', {
                projectId: (projectId && projectId !== 'GLOBAL') ? projectId : 'GLOBAL',
                taskDescription: taskDescription || consensus.consensus_summary,
                agentName: agentName || 'COMMAND_CENTER'
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
                withCredentials: true
            });
            toast.success("Autonomous Protocol Initiated");
        } catch (error) {
            toast.error("Protocol Execution Failed");
        } finally {
            setExecuting(false);
        }
    };

    if (loading) return (
        <Card className="border-0 shadow-sm rounded-5 py-5 text-center bg-light bg-opacity-50 mt-4">
            <Card.Body>
                <div className="spinner-border text-primary mb-4" role="status"></div>
                <p className="text-uppercase fw-bold text-muted small letter-spacing-widest">Synchronizing Neural Intelligence...</p>
            </Card.Body>
        </Card>
    );

    if (!consensus) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-5"
        >
            <Card className="border-0 shadow-lg rounded-5 overflow-hidden transition-all hover-shadow-xl border border-white">
                <Card.Header className="p-4 p-md-5 bg-white border-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">
                                <BrainCircuit size={28} />
                            </div>
                            <div>
                                <h2 className="h4 fw-black text-dark text-uppercase mb-1 mb-md-0" style={{ letterSpacing: '0.05em' }}>
                                    {(!projectId || projectId === 'GLOBAL') ? 'Global Command Manifesto' : 'Strategic Asset Manifesto'}
                                </h2>
                                <Badge bg="light" className="text-muted text-uppercase fw-bold mt-1" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                                    <Cpu size={12} className="me-1" /> Quantum Consensus v4.0.1
                                </Badge>
                            </div>
                        </div>
                        <Button
                            variant="light"
                            onClick={fetchConsensus}
                            className="rounded-4 p-3 border shadow-sm transition-hover"
                            style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <RefreshCcw size={20} className={loading ? 'animate-spin opacity-50' : 'text-primary'} />
                        </Button>
                    </div>
                </Card.Header>

                <Card.Body className="p-4 p-md-5 pt-0">
                    <Row className="g-4 mb-5">
                        {consensus.agents.map((agent, index) => (
                            <Col md={6} lg={4} key={index}>
                                <Card className="border-0 bg-light rounded-5 p-4 h-100 border border-white transition-hover shadow-sm">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="p-2 fs-4 rounded-4 bg-white shadow-sm border" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {(agent.name || agent.agent).includes('Agronomist') ? '🌿' :
                                                (agent.name || agent.agent).includes('Economist') || (agent.name || agent.agent).includes('Futurist') ? '📊' :
                                                    (agent.name || agent.agent).includes('Risk') || (agent.name || agent.agent).includes('Architect') ? '🛡️' : '🤖'}
                                        </div>
                                        <div>
                                            <h4 className="h6 fw-bold text-dark text-uppercase mb-1">{agent.name || agent.agent}</h4>
                                            <Badge bg={agent.status === 'CRITICAL' ? 'danger' : 'success'} className="rounded-pill bg-opacity-10 text-uppercase fw-bold" style={{ fontSize: '0.6rem', color: agent.status === 'CRITICAL' ? '#ef4444' : '#10b981' }}>
                                                {agent.status || 'STABLE'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="small text-muted mb-4" style={{ lineHeight: 1.6 }}>
                                        {agent.thought || agent.insight}
                                    </p>
                                    {agent.proposed_action && (
                                        <div className="mt-auto pt-3 border-top border-white">
                                            <p className="mb-2 fw-black text-primary text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                                                <Target size={12} className="me-2" />
                                                Action: <span className="text-dark opacity-100">{agent.proposed_action}</span>
                                            </p>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="w-100 rounded-pill text-uppercase fw-bold"
                                                style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}
                                                onClick={() => handleExecuteProtocol(agent.proposed_action, agent.name || agent.agent)}
                                                disabled={executing}
                                            >
                                                {executing ? 'Executing...' : 'Execute Task'}
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Card className="border-0 rounded-5 p-4 p-md-5 text-white shadow-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', filter: 'blur(40px)' }}></div>

                        <div className="d-flex align-items-center gap-3 mb-4 position-relative">
                            <Zap size={24} className="text-primary" />
                            <h3 className="h5 fw-bold text-uppercase m-0 ls-wider" style={{ letterSpacing: '0.2em' }}>Unified Consensus Summary</h3>
                        </div>

                        <p className="h6 fw-normal text-muted mb-5 ls-wide line-height-xl position-relative" style={{ lineHeight: 1.8, color: '#94a3b8 !important' }}>
                            {consensus.consensus_summary || consensus.summary}
                        </p>

                        <Button
                            onClick={handleExecuteProtocol}
                            disabled={executing}
                            variant="primary"
                            className="w-100 py-3 rounded-pill fw-black text-uppercase shadow-lg border-0 transition-hover"
                            style={{ letterSpacing: '0.2em', fontSize: '11px', background: 'var(--gold-gradient)' }}
                        >
                            {executing ? (
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            ) : (
                                <>
                                    <Target size={18} className="me-2" /> Execute Autonomous Governance Protocol
                                </>
                            )}
                        </Button>
                    </Card>
                </Card.Body>

                <footer className="p-4 bg-light border-top text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <CheckCircle size={14} className="text-success" />
                        <span className="text-uppercase fw-bold text-muted small letter-spacing-widest">Signed by Neural Network Controller 0x4F...9E</span>
                    </div>
                </footer>
            </Card>
        </motion.div>
    );
};

export default IntelligenceManifesto;
