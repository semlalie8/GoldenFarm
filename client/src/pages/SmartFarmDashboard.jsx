import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Brain, TrendingUp, AlertTriangle, ArrowRight, Activity, ShieldCheck, Globe, Wallet, FolderOpen, Package, Users, BarChart3, Clock, DollarSign, Leaf, MessageSquare, Eye, Briefcase, Mail, Target, Box, UserCheck, Zap, Server, Database, Cpu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import IntelligenceManifesto from '../components/IntelligenceManifesto';
import NeuralFeed from '../components/NeuralFeed';
import { useSocket } from '../hooks/useSocket';
import toast from 'react-hot-toast';

const SmartFarmDashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [prices, setPrices] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Unified platform data from all modules
    const [platformData, setPlatformData] = useState(null);
    const [userStats, setUserStats] = useState({
        projects: [],
        products: [],
        investments: [],
        totalInvested: 0,
        totalEarnings: 0,
        projectCount: 0,
        productCount: 0
    });
    const [userAlerts, setUserAlerts] = useState([]);
    const [lastPulse, setLastPulse] = useState(null);
    const [isPulsing, setIsPulsing] = useState(false);

    const fetchDashboardData = async () => {
        try {
            // Fetch Market Prices
            const priceRes = await axios.get('/api/analytics/market-prices');
            setPrices(priceRes.data.slice(0, 5));

            if (userInfo.role === 'admin') {
                setActiveProjectId('GLOBAL');
                try {
                    const platformRes = await axios.get('/api/platform/analytics', {
                        headers: { Authorization: `Bearer ${userInfo.token}` }
                    });
                    setPlatformData(platformRes.data);

                    const alerts = [];
                    const data = platformRes.data;
                    if (data.projects.funded > 0) alerts.push({ type: 'success', title: 'Funding Success', message: `${data.projects.funded} projects fully funded!` });
                    if (data.users.newThisMonth > 0) alerts.push({ type: 'info', title: 'User Growth', message: `${data.users.newThisMonth} new users this month` });
                    if (data.inventory.lowStock > 0) alerts.push({ type: 'warning', title: 'Low Stock Alert', message: `${data.inventory.lowStock} products running low` });
                    setUserAlerts(alerts);
                } catch (err) {
                    console.error('Platform analytics error:', err);
                }
            } else if (userInfo.role === 'farmer') {
                const [projectsRes, productsRes] = await Promise.allSettled([
                    axios.get('/api/projects/my-projects', { headers: { Authorization: `Bearer ${userInfo.token}` } }),
                    axios.get('/api/products/my-products', { headers: { Authorization: `Bearer ${userInfo.token}` } })
                ]);
                const myProjects = projectsRes.status === 'fulfilled' ? (projectsRes.value.data.projects || projectsRes.value.data || []) : [];
                const myProducts = productsRes.status === 'fulfilled' ? (productsRes.value.data || []) : [];
                if (myProjects.length > 0) setActiveProjectId(myProjects[0]._id);
                setUserStats({
                    projects: myProjects,
                    products: myProducts,
                    investments: [],
                    totalInvested: myProjects.reduce((sum, p) => sum + (p.raisedAmount || 0), 0),
                    totalEarnings: myProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.soldCount || 0)), 0),
                    projectCount: myProjects.length,
                    productCount: myProducts.length
                });
            } else {
                const [projectsRes, investmentsRes] = await Promise.allSettled([
                    axios.get('/api/projects'),
                    axios.get('/api/crowdfunding/my-investments', { headers: { Authorization: `Bearer ${userInfo.token}` } })
                ]);
                const allProjects = projectsRes.status === 'fulfilled' ? (projectsRes.value.data.projects || projectsRes.value.data) : [];
                const myInvestments = investmentsRes.status === 'fulfilled' ? investmentsRes.value.data : [];
                if (allProjects.length > 0) setActiveProjectId(allProjects[0]._id);
                const totalInvested = myInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
                setUserStats({
                    projects: allProjects.slice(0, 5),
                    products: [],
                    investments: myInvestments,
                    totalInvested,
                    totalEarnings: totalInvested * 1.12,
                    projectCount: myInvestments.length,
                    productCount: 0
                });
            }
        } catch (error) {
            console.error("Dashboard Load Error", error);
        } finally {
            setLoading(false);
        }
    };

    useSocket({
        'NEW_ORDER': (data) => {
            toast.success(`🛒 New Order: ${data.customer} (${data.amount} MAD)`);
            fetchDashboardData();
        },
        'NEW_INVESTMENT': (data) => {
            toast.success(`💰 New Investment: ${data.amount} MAD in ${data.projectTitle}`);
            fetchDashboardData();
        },
        'FARM_PULSE': (data) => {
            setLastPulse(data);
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 1000);
        }
    });

    useEffect(() => {
        if (userInfo) fetchDashboardData();
    }, [userInfo]);

    // Chart Components
    const SimpleBarChart = ({ data, height = 120, color = '#7DC242' }) => {
        const maxValue = Math.max(...data.map(d => d.funding || d.amount || d.count || 1));
        return (
            <div className="d-flex align-items-end justify-content-between gap-2" style={{ height }}>
                {data.map((item, i) => (
                    <div key={i} className="d-flex flex-column align-items-center flex-grow-1">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${((item.funding || item.amount || item.count || 0) / maxValue) * 100}%` }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            style={{ width: '100%', background: `linear-gradient(180deg, ${color}, ${color}80)`, borderRadius: '8px 8px 0 0', minHeight: '4px' }}
                        />
                        <span className="mt-2" style={{ fontSize: '10px', color: '#64748b' }}>{item.month || item.name?.substring(0, 3)}</span>
                    </div>
                ))}
            </div>
        );
    };

    const DonutChart = ({ data, size = 100 }) => {
        const total = data.reduce((sum, d) => sum + (d.count || d.value || 0), 0);
        const colors = ['#7DC242', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
        let cum = 0;
        return (
            <div className="d-flex align-items-center gap-3">
                <svg width={size} height={size} viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                    {data.map((item, i) => {
                        const pct = total > 0 ? ((item.count || item.value || 0) / total) * 100 : 0;
                        const offset = 25 - cum;
                        cum += pct;
                        return <circle key={i} cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke={colors[i % colors.length]} strokeWidth="3" strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={offset} />;
                    })}
                    <text x="21" y="21" textAnchor="middle" dy="0.35em" style={{ fontSize: '7px', fontWeight: 'bold', fill: '#1e293b' }}>{total}</text>
                </svg>
                <div className="d-flex flex-column gap-1">
                    {data.slice(0, 4).map((item, i) => (
                        <div key={i} className="d-flex align-items-center gap-2">
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i % colors.length] }} />
                            <span style={{ fontSize: '10px', color: '#64748b' }}>{item.name} ({item.count || item.value})</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="neural-dashboard d-flex align-items-center justify-content-center">
            <div className="text-center">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-4 mb-4" style={{ background: 'rgba(125, 194, 66, 0.1)', borderRadius: '50%' }}>
                    <Brain size={64} style={{ color: '#7DC242' }} />
                </motion.div>
                <h2 className="neural-title" style={{ fontSize: '32px' }}>Synchronizing Neural Command...</h2>
                <p className="neural-subtitle">Aggregating data from all platform modules</p>
            </div>
        </div>
    );

    // ==================== ADMIN DASHBOARD ====================
    if (userInfo.role === 'admin' && platformData) {
        const { users, projects, products, crm, financial, hr, marketing, inventory, trends, systemHealth } = platformData;

        return (
            <div className="neural-dashboard">
                <div className="neural-ornament"></div>
                <div className="neural-container">
                    {/* Header */}
                    <header className="neural-header mb-4">
                        <div>
                            <div className="neural-badge"><ShieldCheck size={12} /> Neural Command • Administrator</div>
                            <h1 className="neural-title">Unified <span>Platform</span> Control</h1>
                            <p className="neural-subtitle">Real-time integration across Finance, CRM, HR, Marketing & Operations</p>
                            {isPulsing && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="d-flex align-items-center gap-2 mt-2"
                                    style={{ color: '#7DC242', fontSize: '12px', fontWeight: 600 }}
                                >
                                    <div className="pulse-dot"></div>
                                    <span>LIVE NEURAL PULSE: {lastPulse?.data?.moisture || lastPulse?.data?.ambient_temp || 'Data incoming...'}</span>
                                </motion.div>
                            )}
                        </div>
                        <div className="neural-status-bar">
                            <div className="status-item">
                                <span className="status-label">System Status</span>
                                <div className="status-value"><div className="status-indicator"></div>{systemHealth?.status || 'OPERATIONAL'}</div>
                            </div>
                            <div style={{ width: '1px', height: '32px', background: '#f1f5f9' }}></div>
                            <div className="status-item text-end">
                                <span className="status-label">Last Sync</span>
                                <span className="status-value">{new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </header>

                    {/* Module Quick Links */}
                    <div className="row g-3 mb-4">
                        {[
                            { name: 'Finance Hub', icon: DollarSign, link: '/finance', color: '#10b981', stat: `${(financial?.platformRevenue || 0).toLocaleString()} DH` },
                            { name: 'CRM', icon: MessageSquare, link: '/crm', color: '#8b5cf6', stat: `${crm?.totalLeads || 0} Leads` },
                            { name: 'HR Hub', icon: Users, link: '/hr', color: '#f59e0b', stat: `${hr?.totalTeamMembers || 0} Staff` },
                            { name: 'Marketing', icon: Target, link: '/marketing', color: '#ef4444', stat: `${marketing?.activeCampaigns || 0} Campaigns` },
                            { name: 'Inventory', icon: Box, link: '/inventory', color: '#06b6d4', stat: `${inventory?.totalStock || 0} Items` },
                            { name: 'Projects', icon: FolderOpen, link: '/admin/projects', color: '#3b82f6', stat: `${projects?.total || 0} Active` }
                        ].map((mod, i) => (
                            <div key={i} className="col-lg-2 col-md-4 col-6">
                                <Link to={mod.link} className="text-decoration-none">
                                    <div className="neural-card h-100 text-center p-3" style={{ transition: 'transform 0.2s', cursor: 'pointer' }}>
                                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2" style={{ width: 48, height: 48, background: `${mod.color}15` }}>
                                            <mod.icon size={24} style={{ color: mod.color }} />
                                        </div>
                                        <h6 className="mb-1 small fw-bold text-dark">{mod.name}</h6>
                                        <p className="mb-0" style={{ fontSize: '11px', color: mod.color, fontWeight: 600 }}>{mod.stat}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Key Metrics */}
                    <div className="row g-3 mb-4">
                        <div className="col-lg-3 col-6">
                            <div className="neural-card p-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-3 rounded-3" style={{ background: 'rgba(125, 194, 66, 0.1)' }}><Users size={24} style={{ color: '#7DC242' }} /></div>
                                    <div>
                                        <p className="status-label mb-1">Total Users</p>
                                        <h3 className="mb-0 fw-bold">{users?.total || 0}</h3>
                                        <small className="text-success">+{users?.newThisMonth || 0} this month</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="neural-card p-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-3 rounded-3" style={{ background: 'rgba(59, 130, 246, 0.1)' }}><DollarSign size={24} style={{ color: '#3b82f6' }} /></div>
                                    <div>
                                        <p className="status-label mb-1">Total Funding</p>
                                        <h3 className="mb-0 fw-bold">{(projects?.totalFunding || 0).toLocaleString()} DH</h3>
                                        <small className="text-primary">{projects?.fundingProgress || 0}% of target</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="neural-card p-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-3 rounded-3" style={{ background: 'rgba(245, 158, 11, 0.1)' }}><Package size={24} style={{ color: '#f59e0b' }} /></div>
                                    <div>
                                        <p className="status-label mb-1">Products Listed</p>
                                        <h3 className="mb-0 fw-bold">{products?.total || 0}</h3>
                                        <small className="text-warning">{products?.totalSold || 0} sold</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="neural-card p-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-3 rounded-3" style={{ background: 'rgba(139, 92, 246, 0.1)' }}><BarChart3 size={24} style={{ color: '#8b5cf6' }} /></div>
                                    <div>
                                        <p className="status-label mb-1">Platform Revenue</p>
                                        <h3 className="mb-0 fw-bold">{(financial?.platformRevenue || 0).toLocaleString()} DH</h3>
                                        <small style={{ color: '#8b5cf6' }}>+{financial?.monthlyGrowth || 0}% growth</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Main Content */}
                        <div className="col-lg-8">
                            {/* Funding Trend Chart */}
                            <div className="neural-card p-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h5 className="fw-bold mb-1">Platform Growth Trend</h5>
                                        <p className="text-muted small mb-0">Funding & user acquisition over time</p>
                                    </div>
                                    <span className="badge rounded-pill" style={{ background: 'rgba(125, 194, 66, 0.1)', color: '#7DC242' }}>Live Data</span>
                                </div>
                                {trends && <SimpleBarChart data={trends} height={140} />}
                            </div>

                            {/* Module Integration Grid */}
                            <div className="row g-4 mb-4">
                                {/* Finance Summary */}
                                <div className="col-md-6">
                                    <div className="neural-card p-4 h-100">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h6 className="fw-bold mb-0"><DollarSign size={16} className="me-2" style={{ color: '#10b981' }} />Financial Hub</h6>
                                            <Link to="/finance" className="small text-success">View →</Link>
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div className="p-3 rounded-3" style={{ background: '#f0fdf4' }}>
                                                    <p className="small text-muted mb-1">Revenue</p>
                                                    <h5 className="mb-0 fw-bold" style={{ color: '#10b981' }}>{(financial?.platformRevenue || 0).toLocaleString()}</h5>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="p-3 rounded-3" style={{ background: '#eff6ff' }}>
                                                    <p className="small text-muted mb-1">Product Sales</p>
                                                    <h5 className="mb-0 fw-bold" style={{ color: '#3b82f6' }}>{(financial?.productSales || 0).toLocaleString()}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CRM Summary */}
                                <div className="col-md-6">
                                    <div className="neural-card p-4 h-100">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h6 className="fw-bold mb-0"><MessageSquare size={16} className="me-2" style={{ color: '#8b5cf6' }} />CRM Hub</h6>
                                            <Link to="/crm" className="small" style={{ color: '#8b5cf6' }}>View →</Link>
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div className="p-3 rounded-3" style={{ background: '#faf5ff' }}>
                                                    <p className="small text-muted mb-1">Total Leads</p>
                                                    <h5 className="mb-0 fw-bold" style={{ color: '#8b5cf6' }}>{crm?.totalLeads || 0}</h5>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="p-3 rounded-3" style={{ background: '#f0fdf4' }}>
                                                    <p className="small text-muted mb-1">Conversion</p>
                                                    <h5 className="mb-0 fw-bold" style={{ color: '#10b981' }}>{crm?.conversionRate || 0}%</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HR Summary */}
                                <div className="col-md-6">
                                    <div className="neural-card p-4 h-100">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h6 className="fw-bold mb-0"><Briefcase size={16} className="me-2" style={{ color: '#f59e0b' }} />HR Hub</h6>
                                            <Link to="/hr" className="small" style={{ color: '#f59e0b' }}>View →</Link>
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div className="p-3 rounded-3" style={{ background: '#fffbeb' }}>
                                                    <p className="small text-muted mb-1">Team Size</p>
                                                    <h5 className="mb-0 fw-bold" style={{ color: '#f59e0b' }}>{hr?.totalTeamMembers || 0}</h5>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="p-3 rounded-3" style={{ background: '#f0fdf4' }}>
                                                    <p className="small text-muted mb-1">Retention</p>
                                                    <h5 className="mb-0 fw-bold" style={{ color: '#10b981' }}>{hr?.retentionRate || 0}%</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Marketing Summary */}
                                <div className="col-md-6">
                                    <div className="neural-card p-4 h-100">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h6 className="fw-bold mb-0"><Target size={16} className="me-2" style={{ color: '#ef4444' }} />Marketing Hub</h6>
                                            <Link to="/marketing" className="small" style={{ color: '#ef4444' }}>View →</Link>
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div className="p-3 rounded-3" style={{ background: '#fef2f2' }}>
                                                    <p className="small text-muted mb-1">Campaigns</p>
                                                    <h5 className="mb-0 fw-bold" style={{ color: '#ef4444' }}>{marketing?.activeCampaigns || 0}</h5>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="p-3 rounded-3" style={{ background: '#eff6ff' }}>
                                                    <p className="small text-muted mb-1">Open Rate</p>
                                                    <h5 className="mb-0 fw-bold" style={{ color: '#3b82f6' }}>{marketing?.openRate || 0}%</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Intelligence Module */}
                            <IntelligenceManifesto projectId="GLOBAL" />
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            {/* System Health */}
                            <div className="neural-card p-4 mb-4">
                                <h6 className="fw-bold mb-3"><Server size={16} className="me-2" />System Integration</h6>
                                <div className="d-flex flex-column gap-3">
                                    {[
                                        { name: 'Finance API', status: 'Connected', color: '#10b981' },
                                        { name: 'CRM Sync', status: 'Active', color: '#10b981' },
                                        { name: 'HR Module', status: 'Online', color: '#10b981' },
                                        { name: 'Marketing Engine', status: 'Running', color: '#10b981' },
                                        { name: 'Inventory DB', status: 'Synced', color: '#10b981' },
                                        { name: 'AI Neural Core', status: 'Active', color: '#7DC242' }
                                    ].map((sys, i) => (
                                        <div key={i} className="d-flex justify-content-between align-items-center">
                                            <span className="small">{sys.name}</span>
                                            <span className="badge rounded-pill" style={{ background: `${sys.color}15`, color: sys.color, fontSize: '10px' }}>{sys.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* User Distribution */}
                            <div className="neural-card p-4 mb-4">
                                <h6 className="fw-bold mb-3">User Distribution</h6>
                                <DonutChart data={[
                                    { name: 'Farmers', count: users?.byRole?.farmer || 0 },
                                    { name: 'Investors', count: users?.byRole?.investor || 0 },
                                    { name: 'Admins', count: users?.byRole?.admin || 0 }
                                ]} />
                            </div>

                            {/* Recent Users */}
                            <div className="neural-card p-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0">Recent Users</h6>
                                    <Link to="/admin/users" className="small text-success">View All →</Link>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                    {(users?.recentUsers || []).slice(0, 5).map((u, i) => (
                                        <div key={i} className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: '#f8fafc' }}>
                                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: 'rgba(125, 194, 66, 0.1)' }}>
                                                <span style={{ color: '#7DC242', fontWeight: 'bold', fontSize: '12px' }}>{u.name?.charAt(0) || 'U'}</span>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 small fw-medium">{u.name || 'User'}</p>
                                                <p className="mb-0" style={{ fontSize: '10px', color: '#64748b' }}>{u.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Alerts */}
                            <div className="neural-card p-4 mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#f97316' }}><AlertTriangle size={16} className="me-2" />System Alerts</h6>
                                <div className="d-flex flex-column gap-2">
                                    {userAlerts.map((alert, i) => (
                                        <div key={i} className="p-3 rounded-3" style={{
                                            background: alert.type === 'warning' ? '#fef2f2' : alert.type === 'success' ? '#f0fdf4' : '#eff6ff'
                                        }}>
                                            <p className="mb-1 small fw-bold" style={{
                                                color: alert.type === 'warning' ? '#dc2626' : alert.type === 'success' ? '#16a34a' : '#2563eb'
                                            }}>{alert.title}</p>
                                            <p className="mb-0" style={{ fontSize: '11px', color: '#475569' }}>{alert.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Market Prices */}
                            <div className="neural-card p-4">
                                <h6 className="fw-bold mb-3"><TrendingUp size={16} className="me-2" style={{ color: '#7DC242' }} />Live Market</h6>
                                <div className="d-flex flex-column gap-2">
                                    {prices.slice(0, 4).map((p, i) => (
                                        <div key={i} className="d-flex justify-content-between">
                                            <span className="small">{p.product_name}</span>
                                            <span className="fw-bold" style={{ color: '#7DC242' }}>${p.market_price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== FARMER / INVESTOR DASHBOARD ====================
    return (
        <div className="neural-dashboard">
            <div className="neural-ornament"></div>
            <div className="neural-container">
                <header className="neural-header">
                    <div>
                        <div className="neural-badge"><ShieldCheck size={12} /> {userInfo.role === 'farmer' ? 'Farmer' : 'Investor'} • {userInfo.name}</div>
                        <h1 className="neural-title">Neural <span>Core</span></h1>
                        <p className="neural-subtitle">{userInfo.role === 'farmer' ? 'Your Projects & Operations' : 'Your Portfolio & Opportunities'}</p>
                    </div>
                </header>

                <div className="row g-4 mb-5">
                    {[
                        { label: userInfo.role === 'farmer' ? 'My Projects' : 'My Investments', value: userStats.projectCount, icon: FolderOpen, color: '#7DC242' },
                        { label: userInfo.role === 'farmer' ? 'My Products' : 'Total Invested', value: userInfo.role === 'farmer' ? userStats.productCount : `${userStats.totalInvested.toLocaleString()} DH`, icon: Package, color: '#3b82f6' },
                        { label: userInfo.role === 'farmer' ? 'Total Raised' : 'Est. Returns', value: `${userStats.totalEarnings.toLocaleString()} DH`, icon: DollarSign, color: '#f59e0b' },
                        { label: 'Impact Score', value: 'A+', icon: Leaf, color: '#8b5cf6' }
                    ].map((stat, i) => (
                        <div key={i} className="col-md-3">
                            <div className="neural-card p-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-3 rounded-3" style={{ background: `${stat.color}15` }}><stat.icon size={20} style={{ color: stat.color }} /></div>
                                    <div>
                                        <p className="status-label mb-1">{stat.label}</p>
                                        <h4 className="mb-0 fw-bold">{stat.value}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="neural-grid">
                    <div className="neural-main-col">
                        {activeProjectId ? <IntelligenceManifesto projectId={activeProjectId} /> : (
                            <div className="neural-card p-5 text-center">
                                <Globe size={48} className="mb-3" style={{ color: '#cbd5e1' }} />
                                <p className="text-muted mb-3">{userInfo.role === 'farmer' ? 'Create your first project' : 'Make your first investment'}</p>
                                <Link to={userInfo.role === 'farmer' ? '/projects/create' : '/projects'} className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#cba135' }}>
                                    {userInfo.role === 'farmer' ? 'Create Project' : 'Browse Projects'}
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="neural-side-col">
                        <NeuralFeed />
                        <div className="neural-card p-4 mt-4">
                            <h6 className="fw-bold mb-3" style={{ color: '#f97316' }}><AlertTriangle size={16} className="me-2" />Your Alerts</h6>
                            {userAlerts.map((alert, i) => (
                                <div key={i} className="p-3 rounded-3 mb-2" style={{ background: alert.type === 'warning' ? '#fef2f2' : alert.type === 'success' ? '#f0fdf4' : '#eff6ff' }}>
                                    <p className="mb-1 small fw-bold" style={{ color: alert.type === 'warning' ? '#dc2626' : alert.type === 'success' ? '#16a34a' : '#2563eb' }}>{alert.title}</p>
                                    <p className="mb-0" style={{ fontSize: '11px' }}>{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartFarmDashboard;
