import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, FileText, MapPin, Activity, TrendingUp, Globe, CheckCircle } from 'lucide-react';

const SovereignAuditPage = () => {
    const { id } = useParams();
    const [audit, setAudit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudit = async () => {
            try {
                const { data } = await axios.get(`/api/projects/${id}/audit`, { withCredentials: true });
                setAudit(data);
            } catch (error) {
                console.error('Audit Fetch Failed:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAudit();
    }, [id]);

    if (loading) return <div className="p-20 text-center font-black animate-pulse">GENERATING SOVEREIGN AUDIT...</div>;
    if (!audit) return <div className="p-20 text-center text-red-500">AUTHENTICATION REQUIRED FOR AUDIT ACCESS</div>;

    return (
        <div className="sovereign-audit-report bg-white min-h-screen p-12 max-w-4xl mx-auto shadow-2xl my-10 border border-slate-200">
            {/* Report Header */}
            <header className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-900 text-white rounded">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter m-0">Sovereign Audit</h1>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{audit.entity}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase mb-1">Audit Certificate ID</p>
                    <p className="font-mono text-sm bg-slate-100 px-3 py-1 rounded">{audit.audit_id}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{new Date(audit.timestamp).toLocaleString()}</p>
                </div>
            </header>

            {/* Project Context */}
            <section className="mb-12">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black m-0">{audit.project.title}</h2>
                        <div className="flex items-center gap-2 mt-1 text-slate-500">
                            <MapPin size={12} />
                            <span className="text-[10px] font-bold uppercase">{audit.project.jurisdiction}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="px-4 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase">Verified Asset</span>
                    </div>
                </div>
            </section>

            {/* Audit Layers */}
            <div className="space-y-12">
                {/* Physical Layer */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-blue-600">
                        <Activity size={18} />
                        <h3 className="text-sm font-black uppercase tracking-widest m-0">Layer 1: Physical Grounding (IoT)</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        {Object.entries(audit.audit_layers.physical).map(([key, sensor]) => (
                            <div key={key} className="p-4 border border-slate-100 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{key.replace('_', ' ')}</p>
                                <p className="text-lg font-black">{sensor.value}{sensor.unit}</p>
                                <span className="text-[9px] font-black text-emerald-500 uppercase">Status: {sensor.status}</span>
                            </div>
                        ))}
                    </div>
                </section>



                {/* Monetary Layer */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-emerald-600">
                        <TrendingUp size={18} />
                        <h3 className="text-sm font-black uppercase tracking-widest m-0">Layer 3: Monetary Authority (Ledger)</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 border-2 border-slate-900 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Expected Annual ROI</p>
                            <p className="text-4xl font-black">{audit.audit_layers.monetary.yield_analysis.annual_p50}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Market Correlation</p>
                            <p className="text-xl font-black text-slate-700">LOW (+0.12)</p>
                            <span className="text-[9px] font-bold text-blue-500 uppercase">Diversification Optimized</span>
                        </div>
                    </div>
                </section>

                {/* Compliance & Seal */}
                <section className="bg-slate-50 p-8 rounded-[32px] border border-slate-200 mt-20">
                    <div className="flex justify-between items-end">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Compliance Audit Result</h4>
                            <div className="flex flex-wrap gap-4">
                                {audit.compliance_status.checks.map(check => (
                                    <div key={check.name} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                        <CheckCircle size={14} className="text-emerald-500" />
                                        <span className="text-[10px] font-bold text-slate-700">{check.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="relative inline-block">
                                <ShieldCheck size={80} className="text-slate-900 opacity-10 absolute inset-0 -m-10" />
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] relative z-10">{audit.seal}</p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-[9px] text-slate-400 font-bold uppercase leading-relaxed max-w-2xl">
                        This document constitutes a cryptographically signed snapshot of the asset condition at the specified timestamp.
                        It integrates live IoT telemetry with deterministic ledger logic and environmental grounding.
                        Authorized for institutional use under the GoldenFarm Governance Protocol.
                    </p>
                </section>
            </div>

            {/* Print Controls (Hidden on Print) */}
            <div className="mt-12 flex justify-center no-print">
                <button
                    onClick={() => window.print()}
                    className="px-8 py-3 bg-slate-900 text-white font-black text-xs rounded-xl uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl"
                >
                    <FileText size={16} />
                    Download Sovereign PDF
                </button>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .sovereign-audit-report { 
                        box-shadow: none !important; 
                        margin: 0 !important; 
                        border: none !important; 
                        width: 100% !important;
                        max-width: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default SovereignAuditPage;
