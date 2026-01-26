import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Zap, Shield, TrendingUp, AlertTriangle, CheckCircle, Database, LayoutPanelLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StrategyDivergenceHub = ({ projectId = "GLOBAL" }) => {
    const [scenarios, setScenarios] = useState([]);
    const [simulating, setSimulating] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchScenarios = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            // Use a specific project or "GLOBAL" mock logic
            const { data } = await axios.get(`/api/branching/project/${projectId}`, {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });
            setScenarios(data);
        } catch (error) {
            console.error("Scenario Registry Sync Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScenarios();
    }, [projectId]);

    const runSimulation = async () => {
        setSimulating(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const { data } = await axios.post(`/api/branching/project/${projectId}/sim`, { context: { market: "Volatility High" } }, {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });
            toast.success("Strategic Timelines Generated");
            setScenarios(data.scenarios);
        } catch (error) {
            toast.error("Deep Logic Intersection Failed");
        } finally {
            setSimulating(false);
        }
    };

    const authorizeTimeline = async (id) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.post(`/api/branching/authorize/${id}`, {}, {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });
            toast.success("Timeline Authorized for Execution");
            fetchScenarios();
        } catch (error) {
            toast.error("Authorization Signal Jammed");
        }
    };

    return (
        <div className="divergence-hub mt-5">
            <style>{`
                .divergence-hub { background: #0c0a09; border-radius: 24px; padding: 40px; color: #fafaf9; border: 1px solid #262626; }
                .divergence-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
                .timeline-card { background: #1c1917; border: 1px solid #44403c; border-radius: 20px; padding: 30px; position: relative; overflow: hidden; height: 100%; transition: all 0.3s ease; }
                .timeline-card:hover { border-color: #f97316; background: #292524; }
                .timeline-card.authorized { border-color: #10b981; }
                .impact-badge { font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
                .profit-badge { background: #1e3a8a; color: #60a5fa; }
                .sustain-badge { background: #064e3b; color: #34d399; }
                
                .action-pill { background: #0c0a09; border: 1px solid #44403c; border-radius: 8px; padding: 6px 12px; font-size: 0.7rem; margin-bottom: 8px; color: #a8a29e; }
                .btn-sim { background: #f97316; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
            `}</style>

            <div className="divergence-header">
                <div>
                    <h2 className="h3 fw-black m-0 d-flex align-items-center gap-3">
                        <GitBranch className="text-warning" size={32} />
                        Strategic <span className="text-warning">Divergence</span> Hub
                    </h2>
                    <p className="text-stone-400 small mb-0 mt-1">Simulate and authorize project timelines from the Neural Core</p>
                </div>
                <button className="btn-sim" onClick={runSimulation} disabled={simulating}>
                    {simulating ? <Database className="animate-spin" size={18} /> : <Zap size={18} />}
                    {simulating ? 'Generating Timelines...' : 'Initiate Deep Logic Simulation'}
                </button>
            </div>

            <div className="row g-4">
                {loading ? (
                    <div className="col-12 text-center p-5 text-stone-500">Accessing Branching Registry...</div>
                ) : scenarios.length === 0 ? (
                    <div className="col-12 text-center p-5 border-dashed rounded-4 bg-stone-900 bg-opacity-50">
                        No active simulations. Trigger a Deep Logic event to explore divergent futures.
                    </div>
                ) : (
                    scenarios.map((scenario) => (
                        <div className="col-md-6" key={scenario._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`timeline-card ${scenario.status === 'authorized' ? 'authorized' : ''}`}
                            >
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h4 className="h5 fw-black mb-1">{scenario.title}</h4>
                                        <div className="d-flex gap-2">
                                            <span className="impact-badge profit-badge">{scenario.financialImpact}</span>
                                            <span className="impact-badge sustain-badge">{scenario.sustainabilityImpact}</span>
                                        </div>
                                    </div>
                                    <div className="bg-black p-2 rounded-3 border border-stone-800">
                                        <span className="small text-stone-500 d-block text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Risk Factor</span>
                                        <span className={`h6 m-0 fw-black ${scenario.riskScore > 7 ? 'text-danger' : 'text-primary'}`}>
                                            {scenario.riskScore}/10
                                        </span>
                                    </div>
                                </div>

                                <p className="small text-stone-400 mb-4" style={{ minHeight: '80px', lineHeight: '1.6' }}>
                                    {scenario.narrative}
                                </p>

                                <div className="mb-4">
                                    <span className="d-block small text-stone-500 fw-bold text-uppercase mb-2">Proposed Directive Batch:</span>
                                    {scenario.proposedActions.map((action, i) => (
                                        <div key={i} className="action-pill">
                                            <span className="text-white fw-bold">{action.agent}:</span> {action.action}
                                        </div>
                                    ))}
                                </div>

                                {scenario.status === 'authorized' ? (
                                    <div className="d-flex align-items-center gap-2 text-success fw-bold small">
                                        <CheckCircle size={16} /> TIMELINE_AUTHORIZED_FOR_PHASE_10
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary w-100 rounded-3 fw-bold border-0 shadow-lg"
                                        style={{ background: '#3b82f6' }}
                                        onClick={() => authorizeTimeline(scenario._id)}
                                    >
                                        Authorize This Timeline
                                    </button>
                                )}
                            </motion.div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StrategyDivergenceHub;
