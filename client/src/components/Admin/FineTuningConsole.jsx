import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, Gauge, Terminal, Play, Save, CheckCircle, AlertCircle, Cpu, BarChart } from 'lucide-react';

const FineTuningConsole = () => {
    const [telemetry, setTelemetry] = useState(null);
    const [stressTestResult, setStressTestResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tuning, setTuning] = useState(false);

    const fetchTelemetry = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const { data } = await axios.get('/api/automation/telemetry', {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });
            setTelemetry(data);
        } catch (error) {
            console.error("Telemetry Sync Error");
        }
    };

    useEffect(() => {
        fetchTelemetry();
        const interval = setInterval(fetchTelemetry, 10000);
        return () => clearInterval(interval);
    }, []);

    const runStress = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const { data } = await axios.post('/api/automation/stress-test', {}, {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });
            setStressTestResult(data);
            fetchTelemetry();
        } catch (error) {
            console.error("Stress Test Interrupted");
        } finally {
            setLoading(false);
        }
    };

    const handleFineTune = async () => {
        setTuning(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.post('/api/automation/fine-tune', {}, {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });
            setTimeout(() => setTuning(false), 2000);
        } catch (error) {
            setTuning(false);
        }
    };

    return (
        <div className="fine-tuning-console mt-5">
            <style>{`
                .fine-tuning-console { background: #020617; border-radius: 24px; padding: 40px; color: #f8fafc; border: 1px solid #1e293b; font-family: 'JetBrains Mono', monospace; }
                .metric-box { background: #1e293b; border-radius: 12px; padding: 20px; border: 1px solid #334155; }
                .terminal-output { background: black; border-radius: 8px; padding: 15px; font-size: 0.75rem; color: #10b981; max-height: 200px; overflow-y: auto; border: 1px solid #065f46; }
                .status-optimal { color: #10b981; }
                .status-degraded { color: #f59e0b; }
                .tuning-btn { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; }
            `}</style>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 fw-black m-0 d-flex align-items-center gap-3">
                    <Activity className="text-primary" />
                    Neural <span className="text-primary">Fine-Tuning</span> Console
                </h2>
                <div className="d-flex gap-2">
                    <button className="tuning-btn" onClick={handleFineTune} disabled={tuning}>
                        <Save size={14} className={tuning ? 'animate-spin' : ''} />
                        {tuning ? 'Re-Syncing Synapses...' : 'Sync AI Parameters'}
                    </button>
                    <button className="btn btn-outline-danger btn-sm rounded-3" onClick={runStress} disabled={loading}>
                        <Play size={14} className={loading ? 'animate-pulse' : ''} /> Stress Test
                    </button>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="metric-box">
                        <span className="small text-slate-400 d-block mb-1">AI Latency (Avg)</span>
                        <div className="h3 fw-black m-0 d-flex align-items-end gap-2">
                            {telemetry?.averageLatency} <span className="small text-muted pb-1">ms</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="metric-box">
                        <span className="small text-slate-400 d-block mb-1">Engine Status</span>
                        <div className={`h3 fw-black m-0 status-${telemetry?.status?.toLowerCase()}`}>
                            {telemetry?.status || 'INIT'}
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="metric-box">
                        <span className="small text-slate-400 d-block mb-1">Failure Frequency</span>
                        <div className="h3 fw-black m-0 text-danger">
                            {telemetry?.failureRate || '0.00%'}
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="metric-box">
                        <span className="small text-slate-400 d-block mb-1">Neural Samples</span>
                        <div className="h3 fw-black m-0 text-primary">
                            {telemetry?.samples || 0}
                        </div>
                    </div>
                </div>
            </div>

            {stressTestResult && (
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-2 text-slate-400 small">
                        <Terminal size={14} /> Stress Test Result (Total Time: {stressTestResult.executionTime}ms)
                    </div>
                    <div className="terminal-output">
                        {stressTestResult.results.map((res, i) => (
                            <div key={i} className="mb-1">
                                <span className="text-slate-500">[{res.task}]</span> {res.status === 'fulfilled' ? <CheckCircle size={10} color="#10b981" /> : <AlertCircle size={10} color="#ef4444" />} {res.value}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10">
                <div className="d-flex align-items-center gap-2 text-primary small fw-bold mb-2">
                    <BarChart size={14} /> Optimization Suggestions
                </div>
                <ul className="text-slate-400 small mb-0 ps-3">
                    <li>RAG retrieval is performing within optimal bounds (&lt; 200ms).</li>
                    <li>Ollama LLM latency is currently high due to local hardware constraints.</li>
                    <li>Recommend pruning Vector Memories older than 90 days if samples exceed 1000.</li>
                </ul>
            </div>
        </div>
    );
};

export default FineTuningConsole;
