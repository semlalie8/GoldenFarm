import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../hooks/useSocket';

// Atomic Components
import OrchestrationStream from '../components/Admin/OrchestrationStream';
import AgentActivityCard from '../components/Admin/AgentActivityCard';
import AdminStatCard from '../components/Admin/AdminStatCard';

const AdminDashboardPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({ totalUsers: 0, totalProjects: 0, totalRevenue: 0 });
    const [automation, setAutomation] = useState(null);
    const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    const fetchDashboardData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const [statsRes, autoRes] = await Promise.all([
                axios.get('/api/analytics/admin', config),
                axios.get('/api/automation/logs', config)
            ]);
            setStats(statsRes.data);
            setAutomation(autoRes.data);
        } catch (error) {
            console.error('Admin Dashboard Fetch Error:', error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [userInfo]);

    // WebSocket Listeners
    useSocket({
        'NEW_ORDER': () => fetchDashboardData(),
        'NEW_INVESTMENT': () => fetchDashboardData(),
        'orchestration.update': (updatedTask) => {
            setAutomation(prev => {
                if (!prev) return prev;
                const queue = [...prev.persistenceQueue];
                const index = queue.findIndex(t => t.eventId === updatedTask.eventId);

                if (index !== -1) {
                    queue[index] = updatedTask;
                } else {
                    queue.unshift(updatedTask);
                }

                return {
                    ...prev,
                    persistenceQueue: queue.slice(0, 15)
                };
            });
        },
        'ai_activity.new': (newLog) => {
            setAutomation(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    logs: [newLog, ...prev.logs].slice(0, 20)
                };
            });
        },
        'orchestration.stream': (streamData) => {
            setAutomation(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    cdpFeed: [streamData, ...prev.cdpFeed].slice(0, 15)
                };
            });
        }
    });

    return (
        <div className="dashboard-page" dir={currentDir}>
            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="dashboard-title">
                                {t('dashboard_welcome', 'Welcome back')}, <span className="user-name">{userInfo?.name}</span>!
                            </h1>
                            <p className="dashboard-subtitle">
                                {t('admin_subtitle', 'Manage users, projects, and content efficiently')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container dashboard-content">
                {/* 0. AI ORCHESTRATION & SYSTEM HEALTH */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card-header-custom mb-4" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
                            <h2 className="section-title">
                                <i className={`fas fa-brain ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`} style={{ color: 'var(--accent-purple)' }}></i>
                                {t('system_orchestration', '0. AI ORCHESTRATION & SYSTEM HEALTH')}
                            </h2>
                            <p className="section-subtitle">Real-time connectivity across Finance, IoT, and CRM Hubs</p>
                        </div>
                    </div>

                    <div className="col-lg-8 mb-4">
                        <OrchestrationStream automation={automation} currentDir={currentDir} />
                    </div>

                    <div className="col-lg-4 mb-4">
                        <AgentActivityCard logs={automation?.logs} />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row g-4 mb-5">
                    <div className="col-lg-3 col-md-6">
                        <AdminStatCard
                            label={t('total_users', 'Total Users')}
                            amount={stats.totalUsers}
                            icon="fa-users"
                            colorClass="invested-icon"
                        />
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <AdminStatCard
                            label={t('total_projects', 'Total Projects')}
                            amount={stats.totalProjects}
                            icon="fa-project-diagram"
                            colorClass="projects-icon"
                        />
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <AdminStatCard
                            label={t('total_revenue', 'Total Revenue')}
                            amount={`${stats.totalRevenue.toLocaleString()} MAD`}
                            icon="fa-wallet"
                            colorClass="wallet-icon"
                        />
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <Link to="/smart-farm" className="text-decoration-none">
                            <div className="stat-card h-100 p-4 rounded-4 shadow-sm border-2 border-primary bg-primary text-white d-flex flex-column justify-content-between">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="stat-icon-bg bg-white/20 rounded-3 p-2">
                                        <i className="fas fa-brain fa-lg"></i>
                                    </div>
                                    <span className="badge bg-white/20 text-white uppercase tracking-widest" style={{ fontSize: '8px' }}>Active Core</span>
                                </div>
                                <div>
                                    <h6 className="text-white/70 uppercase tracking-widest mb-1" style={{ fontSize: '10px' }}>Neural Intelligence</h6>
                                    <h4 className="fw-black mb-0">Enter Core</h4>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* 1. MASTER SYSTEMS (CRM & FINANCE) */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card-header-custom mb-4">
                            <h2 className="section-title">
                                <i className={`fas fa-microchip ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                                {t('admin_mastery', 'Administrative Mastery')}
                            </h2>
                            <p className="section-subtitle">{t('core_infrastructure', 'Core CRM and Financial Infrastructure')}</p>
                        </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <Link to="/admin/crm" className="quick-access-card h-100 border-success shadow-sm">
                            <div className="qa-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}>
                                <i className="fas fa-network-wired"></i>
                            </div>
                            <h4>{t('crm_hub', 'CRM & User Management')}</h4>
                            <p>{t('crm_hub_desc', 'Manage users, accounts, leads, orders, and support tickets in one place.')}</p>
                            <span className="badge bg-success mt-2">{t('enterprise_ready', 'Enterprise Ready')}</span>
                        </Link>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <Link to="/admin/finance" className="quick-access-card h-100 border-warning shadow-sm">
                            <div className="qa-icon" style={{ background: 'rgba(253, 188, 63, 0.1)', color: 'var(--secondary-gold)' }}>
                                <i className="fas fa-vault"></i>
                            </div>
                            <h4>{t('finance_hub', 'Finance Hub')}</h4>
                            <p>{t('finance_hub_desc', 'SAP-Inspired Cockpit: CGI 2026 Compliance and Ledger.')}</p>
                            <span className="badge bg-warning text-dark mt-2">{t('audit_grade', 'Audit Grade')}</span>
                        </Link>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <Link to="/admin/marketing" className="quick-access-card h-100 border-primary shadow-sm">
                            <div className="qa-icon" style={{ background: 'rgba(0, 107, 179, 0.1)', color: 'var(--accent-blue)' }}>
                                <i className="fas fa-bullhorn"></i>
                            </div>
                            <h4>{t('growth_hub', 'Growth Hub')}</h4>
                            <p>{t('growth_hub_desc', 'AI-Native Marketing: CDPs, Funnels, and Orchestration.')}</p>
                            <span className="badge bg-primary mt-2">{t('rocket_mode', 'Rocket Mode')}</span>
                        </Link>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <Link to="/admin/inventory" className="quick-access-card h-100 border-info shadow-sm">
                            <div className="qa-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                                <i className="fas fa-boxes"></i>
                            </div>
                            <h4>{t('inventory_hub', 'Inventory Hub')}</h4>
                            <p>{t('inventory_hub_desc', 'Real-time Stock: WMS, Batch Tracking, and Spoilage Control.')}</p>
                            <span className="badge bg-info mt-2">{t('operational_truth', 'Operational Truth')}</span>
                        </Link>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <Link to="/admin/hr" className="quick-access-card h-100 border-danger shadow-sm">
                            <div className="qa-icon" style={{ background: 'rgba(225, 29, 72, 0.1)', color: 'var(--accent-red)' }}>
                                <i className="fas fa-user-tie"></i>
                            </div>
                            <h4>{t('hr_hub', 'HR & Payroll Hub')}</h4>
                            <p>{t('hr_hub_desc', 'Manpower Control: Contracts, IR 2026, and Automated Payslips.')}</p>
                            <span className="badge bg-danger mt-2">{t('legal_grade', 'Legal Grade')}</span>
                        </Link>
                    </div>
                </div>

                {/* 2. CORE SERVICES */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card-header-custom mb-4">
                            <h2 className="section-title">
                                <i className={`fas fa-concierge-bell ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                                {t('services', 'Services')}
                            </h2>
                            <p className="section-subtitle">{t('services_desc', 'Manage core platform services')}</p>
                        </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <Link to="/projects/new" className="quick-access-card">
                            <div className="qa-icon projects-funding-icon">
                                <i className="fas fa-plus"></i>
                            </div>
                            <h4>{t('add_project', 'Add New Project')}</h4>
                        </Link>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <Link to="/marketplace/new" className="quick-access-card">
                            <div className="qa-icon marketplace-icon">
                                <i className="fas fa-store"></i>
                            </div>
                            <h4>{t('add_product', 'Add New Product')}</h4>
                        </Link>
                    </div>
                </div>

                {/* 3. TRAINING & EDUCATION */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card-header-custom mb-4">
                            <h2 className="section-title">
                                <i className={`fas fa-graduation-cap ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                                {t('training_education', 'Training & Education')}
                            </h2>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">
                        <Link to="/videos/new" className="quick-access-card h-100">
                            <div className="qa-icon video-icon"><i className="fas fa-plus"></i></div>
                            <h4>{t('add_video', 'Add Video')}</h4>
                        </Link>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-4">
                        <Link to="/articles/new" className="quick-access-card h-100">
                            <div className="qa-icon articles-icon"><i className="fas fa-plus"></i></div>
                            <h4>{t('add_article', 'Add Article')}</h4>
                        </Link>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-4">
                        <Link to="/books/new" className="quick-access-card h-100">
                            <div className="qa-icon books-icon"><i className="fas fa-plus"></i></div>
                            <h4>{t('add_book', 'Add Book')}</h4>
                        </Link>
                    </div>
                </div>

                {/* 4. PUBLISHED CONTENT */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card-header-custom mb-4">
                            <h2 className="section-title">
                                <i className={`fas fa-globe ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                                {t('published_content', 'Published Content')}
                            </h2>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-4 mb-4">
                        <Link to="/admin/projects" className="quick-access-card text-center p-3 h-100">
                            <i className="fas fa-tasks fa-2x mb-2 text-primary"></i>
                            <h6>{t('projects', 'Projects')}</h6>
                        </Link>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-4">
                        <Link to="/admin/products" className="quick-access-card text-center p-3 h-100">
                            <i className="fas fa-boxes fa-2x mb-2 text-success"></i>
                            <h6>{t('products', 'Products')}</h6>
                        </Link>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-4">
                        <Link to="/admin/videos" className="quick-access-card text-center p-3 h-100">
                            <i className="fas fa-film fa-2x mb-2 text-info"></i>
                            <h6>{t('videos', 'Videos')}</h6>
                        </Link>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-4">
                        <Link to="/admin/articles" className="quick-access-card text-center p-3 h-100">
                            <i className="fas fa-file-alt fa-2x mb-2 text-secondary"></i>
                            <h6>{t('articles', 'Articles')}</h6>
                        </Link>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-4">
                        <Link to="/admin/books" className="quick-access-card text-center p-3 h-100">
                            <i className="fas fa-book-open fa-2x mb-2 text-warning"></i>
                            <h6>{t('books', 'Books')}</h6>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
