import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { addTransaction } from '../redux/slices/financeSlice';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import {
    Shield,
    TrendingUp,
    Download,
    RefreshCw,
    Book,
    FileCheck,
    Zap,
    Scale,
    Activity,
    Cpu,
    Target,
    Trello,
    Layers,
    CheckCircle,
    Wallet,
    ArrowRight,
    Calculator,
    ClipboardList,
    FileSignature,
    TrendingDown,
    Plus,
    X,
    Save,
    Search,
    ArrowDownRight,
    Percent,
    Eye
} from 'lucide-react';
import AIAssistant from '../components/AIAssistant';
import { getAccountName, searchAccounts } from '../utils/pcmRegistry';

const FinanceHubPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [activeSubTab, setActiveSubTab] = useState('bilan');

    // Tax Simulator State
    const [simProfit, setSimProfit] = useState(null);
    const [simTvaSales, setSimTvaSales] = useState(null);

    const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    const dispatch = useDispatch();
    const { transactions } = useSelector((state) => state.finance);

    const [showEntryForm, setShowEntryForm] = useState(false);
    const [newEntry, setNewEntry] = useState({ date: new Date().toISOString().split('T')[0], account: '', label: '', debit: 0, credit: 0 });
    const [accountSearch, setAccountSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // -------------------------------------------------------------------------
    // 2. INTEGRATED KPI & TAX ENGINE
    // -------------------------------------------------------------------------
    const financialVitals = useMemo(() => {
        const totalDebit = transactions.reduce((acc, t) => acc + t.debit, 0);
        const totalCredit = transactions.reduce((acc, t) => acc + t.credit, 0);

        const revenues = transactions.filter(t => t.account.startsWith('7')).reduce((acc, t) => acc + (t.credit - t.debit), 0);
        const expenses = transactions.filter(t => t.account.startsWith('6')).reduce((acc, t) => acc + (t.debit - t.credit), 0);
        const resultatComptable = revenues - expenses;

        const tvaFacturee = transactions.filter(t => t.account === '4455').reduce((acc, t) => acc + (t.credit - t.debit), 0);
        const tvaRecuperableCharges = transactions.filter(t => t.account === '3455').reduce((acc, t) => acc + (t.debit - t.credit), 0);
        const tvaRecuperableImmo = transactions.filter(t => t.account === '3456').reduce((acc, t) => acc + (t.debit - t.credit), 0);
        const tvaDue = tvaFacturee - (tvaRecuperableCharges + tvaRecuperableImmo);

        const class2 = transactions.filter(t => t.account.startsWith('2')).reduce((acc, t) => acc + (t.debit - t.credit), 0);
        const class3_hors_tva = transactions.filter(t => t.account.startsWith('3') && t.account !== '3455' && t.account !== '3456').reduce((acc, t) => acc + (t.debit - t.credit), 0);
        const treasury = transactions.filter(t => t.account.startsWith('5')).reduce((acc, t) => acc + (t.debit - t.credit), 0);
        const class1 = transactions.filter(t => t.account.startsWith('1')).reduce((acc, t) => acc + (t.credit - t.debit), 0);
        const class4_hors_tva = transactions.filter(t => t.account.startsWith('4') && t.account !== '4455').reduce((acc, t) => acc + (t.credit - t.debit), 0);

        return {
            totalDebit, totalCredit,
            revenues, expenses, resultatComptable,
            tvaFacturee, tvaRecuperableCharges, tvaRecuperableImmo, tvaDue,
            assets: class2 + class3_hors_tva + treasury + tvaRecuperableCharges + tvaRecuperableImmo,
            equity: class1, class2, class3: class3_hors_tva + tvaRecuperableCharges + tvaRecuperableImmo,
            cash: treasury, liabilities: class4_hors_tva + tvaFacturee
        };
    }, [transactions]);

    const calculateIS = (profit) => {
        if (profit <= 0) return { total: 0, rate: 0, label: 'Déficit' };

        // 2026 Specific Unified Protocol
        if (profit < 300000) {
            return { total: profit * 0.10, rate: 10, label: 'Taux Réduit (PME)' };
        } else if (profit < 100000000) {
            return { total: profit * 0.20, rate: 20, label: 'Taux Normal unifié' };
        } else {
            return { total: profit * 0.35, rate: 35, label: 'Taux Élevé (>100M)' };
        }
    };

    const isReal = calculateIS(financialVitals.resultatComptable);
    const isSimulated = calculateIS(simProfit !== null ? Number(simProfit) : financialVitals.resultatComptable);

    const handleAddEntry = (e) => {
        e.preventDefault();
        const entry = { ...newEntry, id: Date.now(), debit: Number(newEntry.debit), credit: Number(newEntry.credit) };
        dispatch(addTransaction(entry));
        setShowEntryForm(false);
        setNewEntry({ date: new Date().toISOString().split('T')[0], account: '', label: '', debit: 0, credit: 0 });
        setAccountSearch('');
        toast.success(`Ecriture Validated: #${entry.id}`);
    };

    const handleAccountSelect = (code) => {
        setNewEntry({ ...newEntry, account: code });
        setAccountSearch(code);
        setSearchResults([]);
    };

    useEffect(() => {
        if (accountSearch.length > 0) setSearchResults(searchAccounts(accountSearch));
        else setSearchResults([]);
    }, [accountSearch]);

    const pageVariant = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } };

    return (
        <div className="finance-hub-wrapper bg-[#fbfcfb] min-h-screen" dir={currentDir}>
            <style>{`
                .finance-hub-wrapper { font-family: 'Outfit', sans-serif; background-image: radial-gradient(at top right, rgba(125, 194, 66, 0.04), transparent 500px), radial-gradient(at bottom left, rgba(212, 160, 23, 0.04), transparent 500px); }
                .finance-container { max-width: 1400px; margin: 0 auto; padding: 40px 24px; }
                .executive-header { padding: 40px 0; border-bottom: 1px solid rgba(0,0,0,0.03); margin-bottom: 40px; }
                .finance-card { background: white; border-radius: 32px; border: 1px solid rgba(0,0,0,0.04); box-shadow: 0 15px 45px -15px rgba(0,0,0,0.05); padding: 40px; }
                .finance-tab { padding: 12px 28px; border-radius: 16px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; transition: all 0.4s; border: none; color: #94a3b8; background: transparent; }
                .finance-tab.active { background: #020617; color: white; box-shadow: 0 10px 20px -5px rgba(2, 6, 23, 0.3); }
                .finance-sub-tab { padding: 10px 20px; border-radius: 14px; font-size: 10px; font-weight: 700; text-transform: uppercase; transition: all 0.3s; border: 1px solid transparent; color: #64748b; background: #f8fafc; }
                .finance-sub-tab.active { background: white; color: var(--accent-green); border-color: #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
                .tax-card-dark { background: #020617; color: white; border-radius: 28px; padding: 32px; position: relative; overflow: hidden; }
                .tax-input { background: #f8fafc; border: 2px solid #f1f5f9; border-radius: 16px; padding: 16px 20px; font-weight: 600; width: 100%; outline: none; transition: all 0.3s; }
                .tax-input:focus { border-color: var(--accent-green); background: white; }
                .overlay-pane { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; }
                .sim-field { border-left: 4px solid var(--accent-green); padding-left: 15px; }
            `}</style>

            <div className="finance-container">
                <div className="executive-header d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-4">
                        <div className="p-4 bg-white rounded-[28px] shadow-sm border border-slate-50"><Shield className="text-[#d4a017]" size={36} /></div>
                        <div>
                            <h1 className="h2 fw-black text-slate-900 m-0 tracking-tighter uppercase italic">SAP Finance <span className="text-[#7DC242]">Intelligence</span></h1>
                            <p className="text-muted small fw-bold uppercase tracking-widest mt-1 opacity-60">Neural ERP Hook - 2026 Fiscal Framework</p>
                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <button className="sap-premium-outline" onClick={() => setShowEntryForm(true)}><Plus size={16} className="me-2" /> Nouvelle Ecriture</button>
                        <button className="sap-premium-btn" onClick={() => window.print()}><Download size={16} className="me-2" /> Global Audit</button>
                    </div>
                </div>

                <div className="d-flex gap-2 p-2 bg-slate-100/50 rounded-[22px] w-fit mb-5">
                    {['overview', 'tax', 'blueprint', 'analytics'].map(id => (
                        <button key={id} onClick={() => { setActiveTab(id); if (id === 'overview') setActiveSubTab('bilan'); }} className={`finance-tab ${activeTab === id ? 'active' : ''}`}>{id}</button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" {...pageVariant}>
                            <div className="d-flex flex-wrap gap-2 p-1.5 bg-slate-100/50 rounded-2xl w-fit mb-5">
                                {['bilan', 'cpc', 'journal', 'esg', 'tf', 'etic'].map(id => (
                                    <button key={id} onClick={() => setActiveSubTab(id)} className={`finance-sub-tab ${activeSubTab === id ? 'active' : ''}`}>{id}</button>
                                ))}
                            </div>

                            {activeSubTab === 'bilan' && (
                                <div className="finance-card">
                                    <h3 className="fw-black uppercase m-0 tracking-tighter mb-5 italic">Bilan Consolidé</h3>
                                    <div className="row g-5">
                                        <div className="col-lg-6">
                                            <div className="space-y-3">
                                                <div className="d-flex justify-content-between p-4 bg-slate-50 rounded-2xl"><span>Immobilisations Brut</span><span className="fw-black">{financialVitals.class2.toLocaleString()} DH</span></div>
                                                <div className="d-flex justify-content-between p-4 bg-slate-50 rounded-2xl"><span>Actif Circulant</span><span className="fw-black">{financialVitals.class3.toLocaleString()} DH</span></div>
                                                <div className="d-flex justify-content-between p-4 bg-[#020617] text-white rounded-2xl mt-4"><span className="fw-bold small uppercase">Total Actif</span><span className="h4 m-0 fw-black">{financialVitals.assets.toLocaleString()} DH</span></div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="space-y-3">
                                                <div className="d-flex justify-content-between p-4 bg-slate-50 rounded-2xl"><span>Capitaux Propres</span><span className="fw-black">{financialVitals.equity.toLocaleString()} DH</span></div>
                                                <div className="d-flex justify-content-between p-4 bg-slate-50 rounded-2xl border-2 border-emerald-100"><span>Résultat Net</span><span className="fw-black text-emerald-600">{financialVitals.resultatComptable.toLocaleString()} DH</span></div>
                                                <div className="d-flex justify-content-between p-4 bg-[#020617] text-white rounded-2xl mt-4"><span className="fw-bold small uppercase">Total Passif</span><span className="h4 m-0 fw-black">{(financialVitals.equity + financialVitals.liabilities + financialVitals.resultatComptable + financialVitals.tvaFacturee).toLocaleString()} DH</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSubTab === 'journal' && (
                                <div className="finance-card">
                                    <h3 className="fw-black uppercase m-0 tracking-tighter mb-5 italic">Le Journal Général</h3>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="text-muted small uppercase"><tr><th>Account</th><th>Label</th><th>Debit</th><th>Credit</th></tr></thead>
                                            <tbody>
                                                {transactions.map(t => (
                                                    <tr key={t.id}>
                                                        <td className="fw-black text-[#d4a017]">{t.account} <span className="small text-muted italic ml-2">{getAccountName(t.account)}</span></td>
                                                        <td>{t.label}</td>
                                                        <td className="text-emerald-600 fw-bold">{t.debit ? t.debit.toLocaleString() : '-'}</td>
                                                        <td className="text-[#d4a017] fw-bold">{t.credit ? t.credit.toLocaleString() : '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {(['esg', 'tf', 'etic', 'cpc'].includes(activeSubTab)) && (
                                <div className="finance-card text-center py-10">
                                    {activeSubTab === 'cpc' ? <TrendingUp size={64} className="mx-auto mb-4 text-[#7DC242]" /> : <FileSignature size={64} className="mx-auto mb-4 text-slate-300" />}
                                    <h2 className="fw-black uppercase">{activeSubTab.toUpperCase()} Integration</h2>
                                    <p className="text-muted">Analyzing real-time PCM journal for synthesized report generation.</p>
                                    <button className="sap-premium-btn mt-4" onClick={() => toast.success(`${activeSubTab.toUpperCase()} Interrogated`)}>Download PDF</button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'tax' && (
                        <motion.div key="tax" {...pageVariant}>
                            <div className="row g-5">
                                <div className="col-lg-7">
                                    <div className="finance-card">
                                        <h3 className="fw-black mb-5 uppercase italic">Neural Tax Simulator</h3>
                                        <div className="row g-4 mb-5">
                                            <div className="col-md-6">
                                                <label className="small fw-black uppercase mb-2">Simulate Profit (HT)</label>
                                                <input type="number" className="tax-input" placeholder={financialVitals.resultatComptable} onChange={(e) => setSimProfit(e.target.value)} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="small fw-black uppercase mb-2">Simulate Sales (HT)</label>
                                                <input type="number" className="tax-input" placeholder={financialVitals.revenues} onChange={(e) => setSimTvaSales(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="tax-card-dark">
                                            <div className="d-flex justify-content-between mb-4 pb-4 border-b border-white/10">
                                                <div>
                                                    <p className="small uppercase mb-0 opacity-50">IS Bracket (2026)</p>
                                                    <h4 className="m-0 fw-black">{isSimulated.rate}% <span className="text-[10px] opacity-40 italic block">{isSimulated.label}</span></h4>
                                                </div>
                                                <div><p className="small uppercase mb-0 opacity-50">Total Duty</p><h4 className="m-0 fw-black text-[#d4a017]">{isSimulated.total.toLocaleString()} DH</h4></div>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <div><p className="small uppercase mb-0 opacity-50">TVA Forecast</p><h4 className="m-0 fw-black">{(Number(simTvaSales || financialVitals.revenues) * 0.20).toLocaleString()} DH</h4></div>
                                                <div><p className="small uppercase mb-0 opacity-50">Net Margin</p><h4 className="m-0 fw-black text-[#7DC242]">{((Number(simProfit || financialVitals.resultatComptable) - isSimulated.total)).toLocaleString()} DH</h4></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-5">
                                    <div className="finance-card h-100 d-flex flex-column justify-content-between">
                                        <div>
                                            <h4 className="fw-black mb-4">Fiscal Intelligence (LF 2026)</h4>
                                            <div className="space-y-4">
                                                <p className="text-muted leading-relaxed">
                                                    The system is now locked to the **Unified Standard Rate** (20% for &lt; 100M MAD) and the **High Rate** (35% for ≥ 100M MAD) per final reform.
                                                </p>
                                                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
                                                    <p className="small fw-bold text-blue-700 mb-1">Cession de Parts Node</p>
                                                    <p className="small text-blue-600 m-0">Mutation rights lowered from 6% to 5% per LF 2026 modernization.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-4">
                                            <div className="d-flex justify-content-between mb-2"><span>Current ETR</span><span className="fw-black">{((isReal.total / financialVitals.resultatComptable) * 100).toFixed(1)}%</span></div>
                                            <div className="d-flex justify-content-between"><span>Simulated ETR</span><span className="fw-black text-[#7DC242]">{((isSimulated.total / (simProfit || financialVitals.resultatComptable)) * 100).toFixed(1)}%</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'blueprint' && (
                        <motion.div key="blueprint" {...pageVariant}>
                            <div className="row g-5">
                                <div className="col-lg-8">
                                    <div className="finance-card">
                                        <h3 className="fw-black uppercase mb-5 italic">Tactical Blueprint</h3>
                                        <div className="p-5 bg-[#020617] rounded-4 text-white relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h4 className="fw-black text-[#7DC242] mb-3">Solar Grid Expansion Phase II</h4>
                                                <p className="opacity-70 mb-5">Strategic allocation for 450k DH in Class 2332 assets identified. Estimated VAT recovery of 90k DH via Article 124 CGI.</p>
                                                <div className="d-flex gap-4">
                                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex-1">
                                                        <p className="small uppercase opacity-40 mb-1">Impact on IS</p>
                                                        <h5 className="m-0 fw-black">-12,400 DH</h5>
                                                    </div>
                                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex-1">
                                                        <p className="small uppercase opacity-40 mb-1">CapEx Buffer</p>
                                                        <h5 className="m-0 fw-black text-[#d4a017]">85% Ready</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <Trello className="absolute top-1/2 right-10 translate-y-[-50%] text-white opacity-5" size={240} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <AIAssistant agentType="FINANCE" context={financialVitals} onAction={(m) => toast.success(m)} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div key="analytics" {...pageVariant}>
                            <div className="finance-card">
                                <h3 className="fw-black uppercase mb-5 italic">Neural Analytics Hub</h3>
                                <div className="row g-5">
                                    <div className="col-lg-8">
                                        <div style={{ height: '400px' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={[
                                                    { name: 'Jan', rev: financialVitals.revenues * 0.8, exp: financialVitals.expenses * 0.7 },
                                                    { name: 'Feb', rev: financialVitals.revenues * 0.9, exp: financialVitals.expenses * 0.85 },
                                                    { name: 'Mar', rev: financialVitals.revenues, exp: financialVitals.expenses },
                                                ]}>
                                                    <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7DC242" stopOpacity={0.1} /><stop offset="95%" stopColor="#7DC242" stopOpacity={0} /></linearGradient></defs>
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                                                    <Tooltip />
                                                    <Area type="monotone" dataKey="rev" stroke="#7DC242" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                                    <Area type="monotone" dataKey="exp" stroke="#94a3b8" strokeWidth={2} fill="transparent" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="small fw-bold text-muted uppercase mb-1">Efficiency Ratio</p>
                                            <h3 className="fw-black">{((financialVitals.resultatComptable / financialVitals.revenues) * 100).toFixed(1)}%</h3>
                                        </div>
                                        <div className="p-4 bg-[#020617] rounded-4 text-white">
                                            <p className="small fw-bold text-emerald-500 uppercase mb-1">Next Quarter Projection</p>
                                            <h3 className="fw-black">+18.4% Yield</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {showEntryForm && (
                    <div className="overlay-pane" onClick={() => setShowEntryForm(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="finance-card w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="d-flex justify-content-between align-items-center mb-5 pb-4 border-b">
                                <h3 className="fw-black m-0 tracking-tighter italic h3">Générer une Écriture</h3>
                                <button className="p-2 hover:bg-slate-100 rounded-full" onClick={() => setShowEntryForm(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleAddEntry} className="space-y-4">
                                <div className="row g-4">
                                    <div className="col-6"><label className="small fw-black text-muted mb-2">Date</label><input type="date" className="tax-input" value={newEntry.date} onChange={e => setNewEntry({ ...newEntry, date: e.target.value })} required /></div>
                                    <div className="col-6 relative"><label className="small fw-black text-muted mb-2">Compte PCM</label><input type="text" className="tax-input" placeholder="Ex: 5141" value={accountSearch} onChange={e => setAccountSearch(e.target.value)} required />{searchResults.length > 0 && <div className="search-dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: 'white', border: '1px solid #eee' }}>{searchResults.map(acc => <div key={acc[0]} className="p-2 hover:bg-slate-100 cursor-pointer flex justify-between" onClick={() => handleAccountSelect(acc[0])}><span className="fw-bold">{acc[0]}</span><span className="small italic text-muted">{acc[1]}</span></div>)}</div>}</div>
                                </div>
                                <div><label className="small fw-black text-muted mb-2">Libellé</label><input type="text" className="tax-input" placeholder="Justificatif..." value={newEntry.label} onChange={e => setNewEntry({ ...newEntry, label: e.target.value })} required /></div>
                                <div className="row g-4"><div className="col-6"><label className="small fw-black text-emerald-700 mb-2">Débit</label><input type="number" className="tax-input" value={newEntry.debit} onChange={e => setNewEntry({ ...newEntry, debit: e.target.value, credit: 0 })} /></div><div className="col-6"><label className="small fw-black text-slate-700 mb-2">Crédit</label><input type="number" className="tax-input" value={newEntry.credit} onChange={e => setNewEntry({ ...newEntry, credit: e.target.value, debit: 0 })} /></div></div>
                                <button type="submit" className="sap-premium-btn w-100 mt-4 py-4"><Save size={20} className="me-2" /> Valider l'Ecriture</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceHubPage;
