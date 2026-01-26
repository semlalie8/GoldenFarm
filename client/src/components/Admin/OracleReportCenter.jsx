import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { motion } from 'framer-motion';
import { FileText, Download, ShieldCheck, History, Search, FileSignature, Database, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const OracleReportCenter = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const fetchReports = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const { data } = await axios.get('/api/reports', {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });
            setReports(data);
        } catch (error) {
            console.error("Oracle Sync Error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleGenerate = async (projectId = null) => {
        setGenerating(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const { data } = await axios.post('/api/reports/generate', { projectId }, {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });
            toast.success("Institutional Oracle Sealed");
            setReports([data, ...reports]);
        } catch (error) {
            toast.error("Generation Signal Interrupted");
        } finally {
            setGenerating(false);
        }
    };

    const exportToPDF = (report) => {
        const doc = new jsPDF();

        // Premium PDF Header
        doc.setFillColor(15, 76, 54);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("GOLDEN FARM INSTITUTIONAL AUDIT", 20, 25);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Report ID: ${report.reportId}`, 20, 50);
        doc.text(`Title: ${report.title}`, 20, 60);
        doc.text(`Generated At: ${new Date(report.createdAt).toLocaleString()}`, 20, 70);

        // Snapshot Data
        doc.setFontSize(14);
        doc.text("Structural Snapshot Context", 20, 85);
        doc.setFontSize(10);
        const snapshotLines = JSON.stringify(report.dataSnapshot, null, 2).split('\n');
        doc.text(snapshotLines, 20, 95);

        // Authentication Seal
        const pageHeight = doc.internal.pageSize.height;
        doc.setFillColor(248, 250, 252);
        doc.rect(10, pageHeight - 50, 190, 40, 'F');
        doc.setTextColor(15, 76, 54);
        doc.setFontSize(12);
        doc.text("CRYPTOGRAPHIC ORACLE SEAL (PROOF OF INTELLIGENCE)", 20, pageHeight - 35);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(report.sealHash, 20, pageHeight - 20);

        doc.save(`${report.reportId}.pdf`);
    };

    return (
        <div className="oracle-center mt-5">
            <style>{`
                .oracle-center { background: #ffffff; border-radius: 24px; padding: 40px; color: #1e293b; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
                .report-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
                .report-card { border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; transition: all 0.3s ease; display: flex; justify-content: space-between; align-items: center; }
                .report-card:hover { border-color: #0f4c36; background: #f8fafc; }
                
                .seal-badge { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 800; color: #059669; background: #ecfdf5; padding: 4px 12px; border-radius: 99px; text-transform: uppercase; }
                .oracle-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 25px; margin-bottom: 35px; }
                
                .btn-oracle { background: #0f4c36; color: white; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 10px; transition: transform 0.2s; }
                .btn-oracle:hover { transform: translateY(-2px); opacity: 0.9; }
                .btn-oracle:disabled { background: #94a3b8; transform: none; }
            `}</style>

            <div className="oracle-header">
                <div>
                    <h2 className="h3 fw-black m-0 d-flex align-items-center gap-3">
                        <FileSignature className="text-primary" size={32} />
                        The <span className="text-primary">Oracle</span> Layer
                    </h2>
                    <p className="text-muted small mb-0 mt-1">Authenticated Institutional Reporting & Proof-of-Intelligence Hub</p>
                </div>
                <button className="btn-oracle" onClick={() => handleGenerate()} disabled={generating}>
                    {generating ? <Database className="animate-spin" /> : <ShieldCheck />}
                    {generating ? 'Sealing Oracle...' : 'Generate Institutional Audit'}
                </button>
            </div>

            <div className="oracle-stats row g-4 mb-5">
                <div className="col-md-4">
                    <div className="p-4 rounded-4 border bg-light text-center">
                        <FileText className="mb-2 text-primary" />
                        <span className="d-block h3 fw-black">{reports.length}</span>
                        <span className="small text-muted text-uppercase fw-bold">Active Certificates</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 rounded-4 border bg-light text-center">
                        <ShieldCheck className="mb-2 text-success" />
                        <span className="d-block h3 fw-black">100%</span>
                        <span className="small text-muted text-uppercase fw-bold">Integrity Rating</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 rounded-4 border bg-light text-center">
                        <Database className="mb-2 text-info" />
                        <span className="d-block h3 fw-black">GLOBAL</span>
                        <span className="small text-muted text-uppercase fw-bold">Ledger Authority</span>
                    </div>
                </div>
            </div>

            <h4 className="h6 text-uppercase fw-bold text-slate-400 mb-4 d-flex align-items-center gap-2">
                <History size={16} /> Certificate Registry (Institutional Grade)
            </h4>

            <div className="report-list">
                {loading ? (
                    <div className="text-center p-5 text-muted">Synchronizing Oracle Registry...</div>
                ) : reports.length === 0 ? (
                    <div className="text-center p-5 border-dashed rounded-4 bg-light">No audited reports detected in the current session.</div>
                ) : (
                    reports.map((report, i) => (
                        <motion.div
                            key={report._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="report-card mb-3"
                        >
                            <div className="d-flex align-items-center gap-4">
                                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h5 className="h6 mb-1 fw-bold">{report.title}</h5>
                                    <div className="d-flex gap-3 align-items-center">
                                        <span className="small text-muted">{new Date(report.createdAt).toLocaleDateString()}</span>
                                        <span className="seal-badge">
                                            <ShieldCheck size={12} /> Authenticated
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-secondary btn-sm rounded-3 d-flex align-items-center gap-2" onClick={() => exportToPDF(report)}>
                                    <Download size={14} /> PDF
                                </button>
                                <button className="btn btn-primary btn-sm rounded-3 d-flex align-items-center gap-2" style={{ background: '#0f4c36', border: 'none' }}>
                                    <Send size={14} /> Send
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OracleReportCenter;
