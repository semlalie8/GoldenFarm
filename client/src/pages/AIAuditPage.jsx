import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTerminal, FaHistory, FaCheckCircle, FaTimesCircle, FaClock, FaSatelliteDish } from 'react-icons/fa';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { Badge } from 'react-bootstrap';
import NeuralRepository from '../components/Admin/NeuralRepository';
import MarketVision from '../components/Admin/MarketVision';
import OracleReportCenter from '../components/Admin/OracleReportCenter';
import FineTuningConsole from '../components/Admin/FineTuningConsole';
import NeuralVision from '../components/Admin/NeuralVision';
import StrategyDivergenceHub from '../components/Admin/StrategyDivergenceHub';
import { useSocket } from '../hooks/useSocket';
import { toast } from 'react-hot-toast';

const AIAuditPage = () => {
    const [logs, setLogs] = useState([]);
    const [activeJobs, setActiveJobs] = useState([]);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [jobQueueStatus, setJobQueueStatus] = useState([]);
    const [securityLogs, setSecurityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const socket = useSocket();

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/automation/logs');
            setLogs(data.logs || []);
            setPendingApprovals(data.pendingApprovals || []);
            setJobQueueStatus(data.jobQueueStatus || []);
            setSecurityLogs(data.securityLogs || []);
            // Fetch orchestration jobs too
            const { data: jobsData } = await axios.get('/api/automation/orchestrations');
            setActiveJobs(jobsData || []);

            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('orchestration.update', (updatedJob) => {
            setActiveJobs(prev => {
                const exists = prev.find(j => j.eventId === updatedJob.eventId);
                if (exists) {
                    return prev.map(j => j.eventId === updatedJob.eventId ? updatedJob : j);
                } else {
                    return [updatedJob, ...prev];
                }
            });

            if (updatedJob.status === 'completed') {
                toast.success(`AI Task Completed: ${updatedJob.payload.task}`);
                fetchData(); // Refresh history
            }
        });

        socket.on('ai_activity.new', (newLog) => {
            setLogs(prev => [newLog, ...prev]);
        });

        return () => {
            socket.off('orchestration.update');
            socket.off('ai_activity.new');
        };
    }, [socket]);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleApproval = async (id, status) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo?.token}` },
            };
            await axios.post(`/api/automation/handle-approval/${id}`, { status }, config);
            setPendingApprovals(prev => prev.filter(p => p._id !== id));
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><div className="audit-spinner"></div></div>;

    return (
        <div className="audit-container">
            <style>{`
                .audit-container { padding: 40px; background: #0f172a; min-height: 100vh; font-family: 'Inter', sans-serif; color: #f8fafc; }
                .audit-header { margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                .audit-title { font-size: 1.8rem; font-weight: 800; color: #f8fafc; }
                .audit-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
                .audit-card { background: #1e293b; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5); overflow: hidden; border: 1px solid #334155; }
                .card-header { padding: 15px 20px; background: #0f172a; color: white; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #334155; }
                .audit-table { width: 100%; border-collapse: collapse; }
                .audit-table th { text-align: left; padding: 12px 20px; background: #1e293b; color: #94a3b8; font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid #334155; }
                .audit-table td { padding: 15px 20px; border-bottom: 1px solid #334155; font-size: 0.85rem; color: #e2e8f0; }
                .badge-agent { background: rgba(59, 130, 246, 0.1); color: #60a5fa; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 0.7rem; }
                .badge-success { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 0.7rem; }
                .badge-processing { background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 0.7rem; animation: pulse 2s infinite; }
                .badge-failure { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 0.7rem; }
                .approval-item { padding: 15px; border-left: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.05); margin-bottom: 15px; border-radius: 0 8px 8px 0; }
                .audit-spinner { border: 4px solid #334155; border-top: 4px solid #3b82f6; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
                .quantum-overlay { position: relative; overflow: hidden; }
                .quantum-overlay::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent); animation: sweep 3s infinite; }
                @keyframes sweep { 0% { left: -100%; } 100% { left: 200%; } }
                .pulse-dot { box-shadow: 0 0 10px #10b981; animation: glow 2s infinite; }
                @keyframes glow { 0% { box-shadow: 0 0 5px #10b981; } 50% { box-shadow: 0 0 15px #10b981; } 100% { box-shadow: 0 0 5px #10b981; } }
            `}</style>

            <div className="audit-header">
                <h1 className="audit-title">AI Autonomous Outbox</h1>
                <div className="d-flex gap-2">
                    <div className="d-flex align-items-center gap-2 me-3 text-success" style={{ fontSize: '0.8rem' }}>
                        <div className="pulse-dot" style={{ background: '#10b981', width: '8px', height: '8px', borderRadius: '50%' }}></div>
                        ORCHESTRATION ENGINE LIVE
                    </div>
                    <button className="btn btn-outline-light btn-sm" onClick={fetchData}>Refresh Synapse</button>
                </div>
            </div>

            <MarketVision />
            <NeuralVision />
            <StrategyDivergenceHub />

            <div className="audit-grid">
                <div className="d-flex flex-column gap-4">
                    {/* Active Orchestrations Section */}
                    <div className="audit-card" style={{ border: '1px solid #3b82f6' }}>
                        <div className="card-header" style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0f172a 100%)' }}>
                            <FaSatelliteDish className="animate-pulse" /> <span>Neural Outbox (Active Actions)</span>
                        </div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table className="audit-table">
                                <thead>
                                    <tr>
                                        <th>Job ID</th>
                                        <th>Target</th>
                                        <th>Operation</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeJobs.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center p-4 text-slate-500">Outbox is currently empty.</td></tr>
                                    ) : (
                                        activeJobs.map(job => (
                                            <tr key={job.eventId}>
                                                <td style={{ fontSize: '0.7rem', color: '#64748b' }}>{job.eventId.split('-').pop()}</td>
                                                <td><Badge bg="secondary" className="bg-opacity-20 text-slate-300">{job.payload.agent}</Badge></td>
                                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.payload.task}</td>
                                                <td>
                                                    <span className={`badge-${job.status}`}>
                                                        {job.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Execution History Section */}
                    <div className="audit-card">
                        <div className="card-header"><FaHistory /> <span>Execution Log history</span></div>
                        <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
                            <table className="audit-table">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Agent</th>
                                        <th>Context</th>
                                        <th>Result</th>
                                        <th>Metric</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log._id}>
                                            <td style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                                            <td><span className="badge-agent">{log.agentName}</span></td>
                                            <td title={log.input}>{log.input.substring(0, 40)}...</td>
                                            <td>
                                                <span className={log.executionResult === 'success' ? 'badge-success' : 'badge-failure'}>
                                                    {log.executionResult.toUpperCase()}
                                                </span>
                                            </td>
                                            <td><FaClock style={{ marginRight: '4px', fontSize: '0.7rem' }} />{log.latency}ms</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column gap-4">
                    <div className="audit-card" style={{ border: '1px solid #10b981' }}>
                        <div className="card-header" style={{ background: '#065f46' }}><FaSatelliteDish /> <span>Neural Worker Feed</span></div>
                        <div style={{ padding: '20px', maxHeight: '250px', overflowY: 'auto' }}>
                            {(!jobQueueStatus || jobQueueStatus.length === 0) ? (
                                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>Queue is clean. No background drift.</p>
                            ) : (
                                jobQueueStatus.map(job => (
                                    <div key={job._id} style={{ marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                                        <div className="d-flex justify-content-between">
                                            <span style={{ fontSize: '0.7rem', color: '#10b981' }}>{job.taskType}</span>
                                            <span className={`badge-${job.status}`} style={{ fontSize: '0.6rem' }}>{job.status.toUpperCase()}</span>
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Attempts: {job.attempts}/{job.maxAttempts}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="audit-card" style={{ border: '1px solid #3b82f6' }}>
                        <div className="card-header" style={{ background: '#1e3a8a' }}><ShieldCheck size={16} /> <span>Security & Resilience</span></div>
                        <div style={{ padding: '20px' }}>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="small text-slate-400">Circuit Breakers:</span>
                                <span className="small text-success fw-bold">ACTIVE</span>
                            </div>
                            <div className="p-2 rounded bg-slate-900 border border-slate-800 small text-muted" style={{ fontSize: '0.7rem' }}>
                                <div className="d-flex justify-content-between mb-1">
                                    <span>AI Synapse:</span>
                                    <span className="text-success">CLOSED</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Actuator Bus:</span>
                                    <span className="text-success">CLOSED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="audit-card" style={{ border: '1px solid #ef4444' }}>
                        <div className="card-header" style={{ background: '#7f1d1d' }}><AlertTriangle size={16} /> <span>Security Audit Trail</span></div>
                        <div style={{ padding: '0px', maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="audit-table">
                                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                    <tr>
                                        <th>Event</th>
                                        <th>IP</th>
                                        <th>Severity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!securityLogs || securityLogs.length === 0) ? (
                                        <tr><td colSpan="3" className="text-center p-4 text-slate-500">Secure perimeter maintained. No alerts.</td></tr>
                                    ) : (
                                        securityLogs.map(sLog => (
                                            <tr key={sLog._id}>
                                                <td style={{ fontSize: '0.7rem' }} title={sLog.path}>
                                                    <div className="fw-bold">{sLog.event.replace('_', ' ')}</div>
                                                    <div className="text-slate-500">{new Date(sLog.timestamp).toLocaleTimeString()}</div>
                                                </td>
                                                <td style={{ fontSize: '0.65rem', fontFamily: 'monospace' }}>{sLog.ipAddress}</td>
                                                <td>
                                                    <span style={{
                                                        fontSize: '0.6rem',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        background: sLog.severity === 'HIGH' || sLog.severity === 'CRITICAL' ? '#7f1d1d' : '#1e293b',
                                                        color: sLog.severity === 'HIGH' || sLog.severity === 'CRITICAL' ? '#fecaca' : '#94a3b8'
                                                    }}>
                                                        {sLog.severity}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <NeuralRepository />
            <OracleReportCenter />
            <FineTuningConsole />
        </div>
    );
};

export default AIAuditPage;

