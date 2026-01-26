import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    TrendingUp,
    DollarSign,
    Plus,
    Search,
    Edit,
    Trash2,
    Activity,
    CheckCircle,
    Zap,
    Target,
    ArrowUpRight,
    Loader2,
    PieChart,
    Layers,
    Navigation,
    Globe,
    X,
    ExternalLink,
    Mail,
    Phone,
    Briefcase,
    Shield,
    Sparkles,
    BarChart3,
    Clock,
    Layout,
    Compass
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import AIAssistant from '../components/AIAssistant';

const CRMLeadsPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);

    // Initial Data
    const staticProjects = [
        {
            _id: 'p1',
            title: { en: 'Organic Saffron Hub' },
            description: { en: 'Hand-picked premium saffron from the Atlas mountains.' },
            raisedAmount: 450000,
            targetAmount: 1200000,
            backerCount: 42,
            status: 'active'
        },
        {
            _id: 'p2',
            title: { en: 'Atlas Bee-Keeping' },
            description: { en: 'Sustainable honey production in high-altitude environments.' },
            raisedAmount: 850000,
            targetAmount: 2000000,
            backerCount: 128,
            status: 'active'
        },
        {
            _id: 'p3',
            title: { en: 'Vertical Mint Gardens' },
            description: { en: 'High-yield hydroponic cultivation of Moroccan spearmint.' },
            raisedAmount: 320000,
            targetAmount: 1500000,
            backerCount: 15,
            status: 'active'
        },
        {
            _id: 'p4',
            title: { en: 'Desert Date Palm Initiative' },
            description: { en: 'Restoring oasis ecosystems through smart irrigation.' },
            raisedAmount: 1200000,
            targetAmount: 5000000,
            backerCount: 210,
            status: 'active'
        }
    ];

    const [leads, setLeads] = useState([]);
    const [projects, setProjects] = useState(staticProjects);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('projects');
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentLeadId, setCurrentLeadId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', company: '',
        role: 'investor', status: 'new', pipeline: 'institutional_investors',
        estimatedValue: 0, probability: 10, vision: '', source: '', preferredProject: ''
    });

    const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    useSocket({
        'funding.update': (data) => {
            setProjects(prev => prev.map(p =>
                p._id === data.assetId ? { ...p, raisedAmount: Number(data.newFundingTotal), backerCount: data.backerCount } : p
            ));
        }
    });

    useEffect(() => {
        const loadPageData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const [leadsRes, projectsRes] = await Promise.all([
                    axios.get('/api/crm/leads', config).catch(() => ({ data: [] })),
                    axios.get('/api/projects', config).catch(() => ({ data: [] }))
                ]);
                setLeads(leadsRes.data || []);
                if (projectsRes.data && projectsRes.data.length > 0) setProjects(projectsRes.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (userInfo) loadPageData();
    }, [userInfo]);

    const stats = useMemo(() => {
        const totalValue = leads.reduce((sum, l) => sum + (Number(l.estimatedValue) || 0), 0);
        const activeProjectsCount = projects.filter(p => p.status === 'active' || p.status === 'approved').length;
        const totalRaised = projects.reduce((sum, p) => sum + (Number(p.raisedAmount) || 0), 0);
        return { totalValue, activeProjects: activeProjectsCount, totalRaised };
    }, [leads, projects]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            if (isEditMode) {
                const { data } = await axios.put(`/api/crm/leads/${currentLeadId}`, formData, config);
                setLeads(leads.map(l => l._id === currentLeadId ? data : l));
                toast.success("Lead updated successfully");
            } else {
                const { data } = await axios.post('/api/crm/leads', formData, config);
                setLeads([data, ...leads]);
                toast.success("Lead registered successfully");
            }
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', company: '', role: 'investor', status: 'new', pipeline: 'institutional_investors', estimatedValue: 0, probability: 10, vision: '', source: '', preferredProject: '' });
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    if (loading && !projects.length) {
        return <div className="flex h-screen items-center justify-center bg-white"><Loader2 className="h-10 w-10 animate-spin text-yellow-600" /></div>;
    }

    const masterButtonStyle = (isPrimary = true) => ({
        borderRadius: '100px',
        fontSize: '11px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        boxShadow: isPrimary ? '0 12px 40px rgba(212, 160, 23, 0.4)' : '0 12px 30px rgba(0, 0, 0, 0.08)',
        padding: '20px 50px',
        border: 'none',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isPrimary ? 'linear-gradient(135deg, #fdbc3f, #d4a017)' : 'white',
        color: isPrimary ? 'white' : '#1E293B',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    });

    return (
        <div className="crm-leads-hub bg-[#F9FBFC] min-h-screen pb-32" dir={currentDir}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                .crm-leads-hub { font-family: 'Outfit', sans-serif; }
                
                .wow-header-section { 
                    background: #ffffff;
                    padding: 160px 0 120px; 
                    position: relative; overflow: hidden;
                    border-bottom: 4px solid #F1F5F9;
                }

                .vibrant-mesh-bg {
                    position: absolute; inset: 0; z-index: 0;
                    background: radial-gradient(at 10% 10%, rgba(212, 175, 55, 0.2) 0px, transparent 40%),
                                radial-gradient(at 90% 10%, rgba(16, 185, 129, 0.15) 0px, transparent 40%),
                                radial-gradient(at 90% 90%, rgba(255, 140, 0, 0.15) 0px, transparent 40%),
                                radial-gradient(at 10% 90%, rgba(212, 175, 55, 0.15) 0px, transparent 40%);
                    filter: blur(100px); opacity: 0.8; animation: mesh-float 25s infinite alternate ease-in-out;
                }
                @keyframes mesh-float { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }

                .signature-gold-line {
                    position: absolute; bottom: 0; left: 0; width: 100%; height: 6px;
                    background: linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%);
                    box-shadow: 0 -10px 30px rgba(212, 175, 55, 0.4); z-index: 5;
                }

                .glamour-text {
                    background: linear-gradient(to right, #1E293B 0%, #D4AF37 50%, #1E293B 100%);
                    background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    animation: text-shine 6s linear infinite;
                }
                @keyframes text-shine { to { background-position: 200% center; } }

                .glass-stat-card {
                    background: rgba(255, 255, 255, 0.35); backdrop-filter: blur(40px) saturate(200%);
                    -webkit-backdrop-filter: blur(40px) saturate(200%); border-radius: 45px; padding: 45px; 
                    border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 25px 60px -15px rgba(0,0,0,0.08);
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); position: relative; z-index: 10;
                    flex: 1; min-width: 0;
                }
                .glass-stat-card:hover { transform: translateY(-12px); border-color: rgba(212, 175, 55, 0.5); }

                .ivory-premium-card {
                    background: #ffffff; border-radius: 45px; padding: 45px; border: 1px solid #f1f5f9;
                    box-shadow: 0 20px 50px -15px rgba(0,0,0,0.06); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; 
                }
                .ivory-premium-card:hover { transform: translateY(-15px); border-color: #D4AF37; box-shadow: 0 45px 95px -25px rgba(0,0,0,0.12); }

                .vibrant-metric-main {
                    font-size: 85px; font-weight: 900; background: linear-gradient(90deg, #D4AF37 0%, #FF8C00 50%, #10B981 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -5px; line-height: 1;
                }

                .linear-power-rail {
                    height: 55px; background: #F8FAFC; border-radius: 28px; padding: 8px;
                    box-shadow: inset 0 2px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;
                }
                .linear-rail-fill {
                    height: 100%; border-radius: 22px; background: linear-gradient(90deg, #D4AF37 0%, #FF8C00 45%, #10B981 100%);
                    box-shadow: 0 5px 25px rgba(212, 175, 55, 0.4);
                }

                .modal-ultra-scrim {
                    position: fixed; inset: 0; z-index: 999999; display: flex; align-items: center; justify-content: center;
                    background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(20px); padding: 40px;
                }
                .modal-master-shell {
                    background: white; width: 100%; max-width: 1300px; max-height: 92vh; border-radius: 70px;
                    display: flex; flex-direction: column; overflow: hidden; border: 12px solid white;
                    box-shadow: 0 70px 140px -40px rgba(0,0,0,0.7);
                }
                .modal-vibrant-hero {
                    background: linear-gradient(135deg, #D4AF37 0%, #FF8C00 100%); padding: 80px 100px; color: white;
                }
                .modal-premium-content { padding: 90px; overflow-y: auto; flex: 1; }
                .nexus-premium-input {
                    width: 100%; background: #ffffff; border: 3px solid #F1F5F9; border-radius: 24px;
                    padding: 22px 30px 22px 80px; font-weight: 700; color: #1E293B; outline: none; transition: all 0.4s ease;
                }
                .nexus-premium-input:focus { border-color: #D4AF37; box-shadow: 0 0 0 8px rgba(212, 175, 55, 0.1); }
            `}</style>

            <header className="wow-header-section">
                <div className="vibrant-mesh-bg"></div>
                <div className="signature-gold-line"></div>

                <div className="container px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="h-1 w-12 bg-yellow-500 rounded-full"></div>
                                <span className="text-[13px] font-black text-slate-400 uppercase tracking-[0.8em]">Morocco Agri-Hegemony</span>
                            </div>
                            <h1 className="text-7xl font-black text-slate-900 mb-8 leading-none tracking-tighter glamour-text whitespace-nowrap">
                                Golden <span className="text-yellow-600">Admin</span> Center
                            </h1>
                            <p className="text-slate-500 text-2xl font-medium leading-relaxed max-w-md opacity-90 italic">
                                Elevating agricultural operations through precision intelligence.
                            </p>
                        </motion.div>

                        <div className="flex-1 w-full max-w-2xl">
                            {/* ABSOLUTELY SIDE-BY-SIDE STATS */}
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-stat-card">
                                    <div className="absolute top-8 right-8 text-yellow-500 opacity-20"><TrendingUp size={80} /></div>
                                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] mb-4">Injected Capital</p>
                                    <h4 className="text-5xl font-black text-slate-900 tracking-tighter mb-6 whitespace-nowrap">{stats.totalRaised.toLocaleString()}<span className="text-base text-slate-400 ml-2 font-bold not-italic">MAD</span></h4>
                                    <div className="flex items-center gap-2 text-emerald-600 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-emerald-100/30 shadow-sm"><Sparkles size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Optimized Liquidity</span></div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-stat-card">
                                    <div className="absolute top-8 right-8 text-emerald-500 opacity-20"><Globe size={80} /></div>
                                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] mb-4">Operations</p>
                                    <h4 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">{stats.activeProjects}</h4>
                                    <div className="flex items-center gap-2 text-blue-600 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-blue-100/30 shadow-sm"><Target size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Saturation</span></div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container px-4 mt-20">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center gap-4 mb-8 ml-2">
                        <Activity className="text-yellow-600 animate-pulse" size={24} />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">CRM INTELLIGENCE</span>
                    </div>
                    <AIAssistant agentType="CRM" context={{ leads, projects, stats }} />
                </motion.div>

                {/* THE "STRICTLY SAME LINE" NAVIGATION ROW WITH 20PX MARGIN BOTTOM */}
                <div className="flex items-center mt-20 mb-20" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap' }}>
                    <button style={{ ...masterButtonStyle(activeTab === 'projects'), marginBottom: '20px' }} onClick={() => setActiveTab('projects')}>Asset Portfolio</button>
                    <button style={{ ...masterButtonStyle(activeTab === 'leads'), marginLeft: '12px', marginBottom: '20px' }} onClick={() => setActiveTab('leads')}>Strategic Leads</button>

                    <div style={{ marginLeft: '40px', marginBottom: '20px' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={masterButtonStyle(true)}
                            onClick={() => { setIsEditMode(false); setShowModal(true); }}
                        >
                            <Plus size={24} className="mr-3" /> Registration Protocol
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'projects' ? (
                        <motion.div key="projects" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
                            {projects.map(project => {
                                const raised = Number(project.raisedAmount) || 0;
                                const target = Number(project.targetAmount) || 1;
                                const percentage = Math.round(Math.min(100, (raised / target) * 100));
                                return (
                                    <motion.div key={project._id} className="ivory-premium-card" onClick={() => setSelectedProject(project)}>
                                        <div className="flex justify-between items-start mb-12">
                                            <div>
                                                <div className="flex items-center gap-3 mb-4"><div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div><span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Active sequence</span></div>
                                                <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none lowercase italic">{project.title.en || project.title}</h3>
                                            </div>
                                            <div className="h-20 w-20 rounded-[35px] bg-slate-50 flex items-center justify-center text-slate-900 border border-white shadow-xl"><PieChart size={32} /></div>
                                        </div>
                                        <p className="text-slate-500 italic text-xl leading-relaxed mb-16 opacity-80 h-10 line-clamp-2">"{project.description?.en || project.description}"</p>
                                        <div className="bg-[#FBFCFD] rounded-[50px] border border-[#F1F5F9] p-12 mt-auto">
                                            <div className="flex justify-between items-end mb-10">
                                                <div className="flex flex-col"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Saturation</p><span className="vibrant-metric-main">{percentage}%</span></div>
                                                <div className="text-right flex flex-col items-end gap-5 font-black uppercase tracking-widest opacity-60"><span className="text-yellow-600 text-[10px] flex items-center gap-2"><Shield size={16} /> Secured Node</span><p className="text-[10px] text-slate-300">#GF-{project._id.slice(-4).toUpperCase()}</p></div>
                                            </div>
                                            <div className="linear-power-rail"><motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="linear-rail-fill" transition={{ duration: 2, ease: "circOut" }} /></div>
                                            <div className="mt-10 flex justify-between text-[11px] font-black uppercase text-slate-400 tracking-widest"><span>Injected: {raised.toLocaleString()} <span className="opacity-20 ml-1">MAD</span></span><span>Goal: {target.toLocaleString()} <span className="opacity-20 ml-1">MAD</span></span></div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div key="leads" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="ivory-premium-card !p-0 overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-[#FBFCFD] border-b border-slate-100 font-black italic">
                                    <tr><th className="p-12 text-[11px] uppercase text-slate-400 tracking-widest">Identity Protocol</th><th className="p-12 text-[11px] uppercase text-slate-400 tracking-widest">Class</th><th className="p-12 text-[11px] uppercase text-slate-400 tracking-widest">Potency</th><th className="p-12 text-[11px] uppercase text-slate-400 tracking-widest">Status</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {leads.map(lead => (
                                        <tr key={lead._id} className="hover:bg-slate-50 transition-all cursor-pointer" onClick={() => { setFormData({ ...lead }); setCurrentLeadId(lead._id); setIsEditMode(true); setShowModal(true); }}>
                                            <td className="p-12"><p className="font-black text-slate-900 text-xl">{lead.name}</p><p className="text-[12px] font-bold text-slate-400 italic">{lead.email}</p></td>
                                            <td className="p-12"><span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{lead.role}</span></td>
                                            <td className="p-12 font-black text-slate-900 text-xl">{Number(lead.estimatedValue).toLocaleString()}</td>
                                            <td className="p-12"><span className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${lead.status === 'won' ? 'bg-emerald-50 text-emerald-600' : lead.status === 'lost' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{lead.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* MASTERPIECE MODALS FULLY RESTORED */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="modal-ultra-scrim" onClick={() => setSelectedProject(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 100 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="modal-master-shell" onClick={e => e.stopPropagation()}>
                            <div className="modal-vibrant-hero relative overflow-hidden">
                                <div className="vibrant-mesh-bg opacity-40"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-5 mb-8"><div className="h-5 w-5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)]" /><span className="text-[13px] font-black uppercase tracking-[1em] opacity-80">Asset sequence intelligence</span></div>
                                    <h2 className="text-[110px] font-black tracking-tighter text-white lowercase italic leading-none">{selectedProject.title?.en || selectedProject.title}</h2>
                                    <button
                                        style={{ ...masterButtonStyle(false), position: 'absolute', top: '0', right: '0', height: '80px', width: '80px', padding: 0, borderRadius: '35px' }}
                                        onClick={() => setSelectedProject(null)}
                                    >
                                        <X size={44} />
                                    </button>
                                </div>
                            </div>
                            <div className="modal-premium-content custom-scrollbar">
                                <p className="text-5xl font-bold text-slate-800 mb-20 italic">"{selectedProject.description?.en || selectedProject.description}"</p>
                                <div className="grid grid-cols-2 gap-12 mb-20">
                                    <div className="bg-white border-4 border-slate-50 rounded-[60px] p-12 shadow-lg"><p className="text-[11px] font-black uppercase text-slate-400 mb-6 tracking-widest">Injected Resource</p><h4 className="text-6xl font-black text-slate-900">{Number(selectedProject.raisedAmount).toLocaleString()} <span className="text-xl opacity-20 ml-2">MAD</span></h4></div>
                                    <div className="bg-white border-4 border-slate-50 rounded-[60px] p-12 shadow-lg"><p className="text-[11px] font-black uppercase text-slate-400 mb-6 tracking-widest">Objective Deployment</p><h4 className="text-6xl font-black text-slate-900">{Number(selectedProject.targetAmount).toLocaleString()} <span className="text-xl opacity-20 ml-2">MAD</span></h4></div>
                                </div>
                                <div className="text-center"><button style={{ ...masterButtonStyle(true), padding: '30px 100px', margin: '0 auto', fontSize: '15px' }} onClick={() => setSelectedProject(null)}>Release Drill-Down</button></div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showModal && (
                    <div className="modal-ultra-scrim" onClick={() => setShowModal(false)}>
                        <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="modal-master-shell" onClick={e => e.stopPropagation()}>
                            <div className="modal-vibrant-hero relative overflow-hidden">
                                <div className="vibrant-mesh-bg opacity-40"></div>
                                <div className="relative z-10">
                                    <h2 className="text-[110px] font-black tracking-tighter text-white italic leading-none">Registration Protocol</h2>
                                    <button
                                        style={{ ...masterButtonStyle(false), position: 'absolute', top: '0', right: '0', height: '80px', width: '80px', padding: 0, borderRadius: '35px' }}
                                        onClick={() => setShowModal(false)}
                                    >
                                        <X size={44} />
                                    </button>
                                </div>
                            </div>
                            <div className="modal-premium-content custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-16">
                                    <div className="grid grid-cols-2 gap-12">
                                        <div className="relative"><Users size={32} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300" /><input type="text" className="nexus-premium-input" name="name" value={formData.name} onChange={handleInputChange} placeholder="Administrative Identity" required /></div>
                                        <div className="relative"><Briefcase size={32} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300" /><input type="text" className="nexus-premium-input" name="company" value={formData.company} onChange={handleInputChange} placeholder="Institutional Hegemony" /></div>
                                        <div className="relative"><Mail size={32} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300" /><input type="email" className="nexus-premium-input" name="email" value={formData.email} onChange={handleInputChange} placeholder="Secure Network Link" required /></div>
                                        <div className="relative"><Phone size={32} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300" /><input type="text" className="nexus-premium-input" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Vocal bridge" /></div>
                                    </div>
                                    <div className="flex gap-12 pt-10">
                                        <button type="button" className="flex-1" style={masterButtonStyle(false)} onClick={() => setShowModal(false)}>Abort Registration</button>
                                        <button type="submit" className="flex-[2]" style={masterButtonStyle(true)}><Zap size={32} className="mr-5 fill-yellow-500 text-yellow-500" /> Execute Initialization</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CRMLeadsPage;
