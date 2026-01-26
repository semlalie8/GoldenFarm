import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    FaBullhorn, FaRocket, FaMagic, FaHistory
} from 'react-icons/fa';
import AIAssistant from '../components/AIAssistant';
import MarketingKPIs from '../components/marketing/MarketingKPIs';
import MarketingAnalytics from '../components/marketing/MarketingAnalytics';
import CampaignList from '../components/marketing/CampaignList';

import { Modal, Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';

const MarketingHubPage = () => {
    const { t } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [showLogModal, setShowLogModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'email',
        targetSegment: '',
        content: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    // Socket.io for real-time updates
    useSocket({
        'NEW_ORDER': (data) => {
            toast.success(`🛒 ${t('new_order_toast', 'New Order!')}: ${data.customer} - ${data.amount} MAD`);
            fetchData();
        },
        'NEW_INVESTMENT': (data) => {
            toast.success(`💰 ${t('new_invest_toast', 'New Investment!')}: ${data.amount} MAD in ${data.projectTitle}`);
            fetchData();
        }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, campaignRes] = await Promise.all([
                axios.get('/api/marketing/stats'),
                axios.get('/api/marketing/campaigns')
            ]);
            setStats(statsRes.data);
            setCampaigns(campaignRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching marketing data');
            setLoading(false);
            toast.error(t('error_loading_data', 'Failed to load marketing data'));
        }
    };

    const handleLaunchCampaign = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            // Using the MARKETING campaign routes for creation
            const { data } = await axios.post('/api/marketing/campaigns', formData, config);

            setCampaigns([data, ...campaigns]);
            setShowCampaignModal(false);
            setFormData({ name: '', type: 'email', targetSegment: '', content: '' });
            toast.success(t('campaign_launched', 'Campaign launched successfully!'));

            // Refresh stats to ensure consistency
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || t('error_launching_campaign', 'Failed to launch campaign'));
        }
    };

    const handleApplyStrategy = (suggestion) => {
        // Simple NLP to extract intent from the AI strategy
        let type = 'email';
        let segment = 'General Audience';
        let name = `Growth Protocol - ${new Date().toLocaleDateString()}`;

        const lower = suggestion.toLowerCase();
        if (lower.includes('retargeting') || lower.includes('social') || lower.includes('ad spend')) {
            type = 'social';
            segment = 'High Intent Visitors (Retargeting)';
        } else if (lower.includes('push') || lower.includes('notification')) {
            type = 'push';
            segment = 'Active Mobile Users';
        } else if (lower.includes('churn') || lower.includes('retention')) {
            type = 'email';
            segment = 'At-Risk Customers (30d Inactive)';
        }

        setFormData({
            name,
            type,
            targetSegment: segment,
            content: suggestion // Use the AI strategy as the initial brief/content
        });

        setShowCampaignModal(true);
        toast.success(t('strategy_applied', 'Strategy applied to Campaign Draft'));
    };

    const funnelData = stats ? [
        { value: stats.funnel.visits, name: t('visits', 'Visits'), fill: '#cbd5e1' },
        { value: stats.funnel.leads, name: t('leads', 'Leads'), fill: '#94a3b8' },
        { value: stats.funnel.investors, name: t('investors', 'Investors'), fill: '#2563eb' },
    ] : [];

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-3">{t('initializing_marketing_brain', 'Initializing Marketing Brain...')}</span>
        </div>
    );

    return (
        <div className="marketing-hub">
            <style>{`
                .marketing-hub { padding: 40px; background: #f8fafc; min-height: 100vh; color: #1e293b; font-family: 'Inter', sans-serif; }
                .m-header { margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                .m-title h1 { font-size: 2.2rem; font-weight: 900; color: #1e293b; margin: 0; }
                .m-title p { color: #64748b; font-size: 1rem; margin-top: 5px; }
                
                .m-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
                @media (max-width: 992px) { .m-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 576px) { .m-grid { grid-template-columns: 1fr; } }

                .m-kpi-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; position: relative; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .m-kpi-card::after { content: ''; position: absolute; top: 0; right: 0; width: 4px; height: 100%; background: #0f4c36; }
                .m-kpi-label { color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; gap: 10px; }
                .m-kpi-value { font-size: 2rem; font-weight: 800; margin: 10px 0; color: #1e293b; }
                .m-kpi-sub { font-size: 0.8rem; color: #10b981; }

                .m-dashboard-body { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
                @media (max-width: 992px) { .m-dashboard-body { grid-template-columns: 1fr; } }

                .m-section { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .m-section-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 25px; display: flex; align-items: center; gap: 12px; color: #334155; }
                
                .campaign-list { list-style: none; padding: 0; }
                .campaign-item { background: #f8fafc; border-radius: 8px; padding: 15px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
                .c-info h4 { font-size: 0.95rem; font-weight: 600; margin: 0; color: #334155; }
                .c-info p { font-size: 0.75rem; color: #64748b; margin: 4px 0 0; }
                .c-status { font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; }
                .status-active { background: #d1fae5; color: #047857; }
                
                .event-feed { font-size: 0.8rem; }
                .event-item { display: flex; gap: 15px; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
                .e-dot { width: 8px; height: 8px; border-radius: 50%; background: #0f4c36; margin-top: 5px; }
                .e-time { color: #64748b; min-width: 60px; }
            `}</style>

            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div className="m-header">
                    <div className="m-title">
                        <h1>{t('marketing_command_center', 'Growth & Marketing')}</h1>
                        <p>{t('marketing_subtitle', 'AI-Driven Performance • ROI Attribution • Identity Logic')}</p>
                    </div>
                    <div className="m-actions">
                        <button
                            className="btn btn-primary"
                            style={{ background: '#0f4c36', border: 'none', padding: '12px 24px', fontWeight: 700, boxShadow: '0 4px 6px -1px rgba(15, 76, 54, 0.4)' }}
                            onClick={() => setShowCampaignModal(true)}
                        >
                            <FaRocket style={{ marginRight: '10px' }} /> {t('launch_campaign', 'Launch New Campaign')}
                        </button>
                    </div>
                </div>

                <MarketingKPIs stats={stats} t={t} />

                <MarketingAnalytics stats={stats} t={t} />

                <div className="m-dashboard-body">
                    <CampaignList
                        campaigns={campaigns}
                        onLaunchNew={() => setShowCampaignModal(true)}
                        t={t}
                    />

                    <div className="m-sidebar">
                        <AIAssistant
                            agentType="growth strategist"
                            context={{ stats, activeCampaigns: campaigns.length }}
                            onAction={handleApplyStrategy}
                        />

                        <div className="m-section" style={{ marginTop: '30px' }}>
                            <div className="m-section-title"><FaHistory /> {t('cdp_feed', 'Real-time CDP Feed')}</div>
                            <div className="event-feed">
                                {stats?.recentEvents.map(ev => (
                                    <div key={ev._id} className="event-item">
                                        <div className="e-dot"></div>
                                        <div className="e-time">{new Date(ev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div className="e-content">
                                            <strong style={{ color: '#1e293b' }}>{ev.event.replace('_', ' ')}</strong>
                                            <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.75rem' }}>
                                                {ev.properties.url?.split('/').pop() || 'Anonymous User'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="btn btn-outline-primary btn-sm w-100 mt-3 fw-bold"
                                onClick={() => setShowLogModal(true)}
                            >
                                {t('view_activity_log', 'View Full Activity Log')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Modal */}
            <Modal show={showCampaignModal} onHide={() => setShowCampaignModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t('launch_new_campaign', 'Launch New Campaign')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLaunchCampaign}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('campaign_name', 'Campaign Name')}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Summer Sale 2026"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('campaign_type', 'Campaign Type')}</Form.Label>
                            <Form.Select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="email">Email Blast</option>
                                <option value="social">Social Media Ad</option>
                                <option value="push">Push Notification</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('target_segment', 'Target Audience Segment')}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. High Value Leads"
                                value={formData.targetSegment}
                                onChange={(e) => setFormData({ ...formData, targetSegment: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" style={{ background: '#0f4c36', border: 'none' }}>
                            {t('launch_robot', 'Launch Campaign Agent')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Log Modal */}
            <Modal show={showLogModal} onHide={() => setShowLogModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t('activity_log', 'Full Activity Log')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Event</th>
                                    <th>Properties</th>
                                    <th>IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentEvents.map(ev => (
                                    <tr key={ev._id}>
                                        <td>{new Date(ev.createdAt).toLocaleString()}</td>
                                        <td><span className="badge bg-light text-dark">{ev.event}</span></td>
                                        <td><small className="text-muted">{JSON.stringify(ev.properties)}</small></td>
                                        <td className="text-secondary small">{ev.ip || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLogModal(false)}>
                        {t('close', 'Close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MarketingHubPage;
