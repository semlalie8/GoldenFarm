import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AIAssistant from '../components/AIAssistant';

const CRMTicketsPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('/api/crm/tickets', config);
                setTickets(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tickets');
                setLoading(false);
            }
        };
        fetchTickets();
    }, [userInfo]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'resolved': return { background: '#dcfce7', color: '#15803d' };
            case 'open': return { background: '#fee2e2', color: '#b91c1c' };
            default: return { background: '#fef3c7', color: '#92400e' };
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'urgent': return { background: '#1e293b', color: '#fff' };
            case 'high': return { background: '#fff7ed', color: '#c2410c' };
            default: return { background: '#f0f9ff', color: '#0369a1' };
        }
    };

    return (
        <div className="crm-page" dir={currentDir}>
            <style>{`
                .crm-container { display: grid; grid-template-columns: 3fr 1fr; gap: 30px; margin-top: 30px; }
                @media (max-width: 992px) { .crm-container { grid-template-columns: 1fr; } }
                .crm-card { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; }
                .crm-table { width: 100%; border-collapse: collapse; }
                .crm-table th { padding: 15px 20px; background: #f8fafc; text-align: left; font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
                .crm-table td { padding: 15px 20px; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; }
                .badge-custom { padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
                .insight-box { margin-top: 25px; padding: 20px; background: #fff1f2; border-radius: 12px; border: 1px solid #fecaca; }
            `}</style>

            <div className="container py-5">
                <div className="mb-4">
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{t('support_tickets', 'Support Tickets')}</h1>
                </div>

                <div className="crm-container">
                    <div className="crm-card">
                        <div className="table-responsive">
                            <table className="crm-table">
                                <thead>
                                    <tr>
                                        <th>{t('subject', 'Subject')}</th>
                                        <th>{t('user', 'User')}</th>
                                        <th>{t('category', 'Category')}</th>
                                        <th>{t('priority', 'Priority')}</th>
                                        <th>{t('status', 'Status')}</th>
                                        <th>{t('date', 'Date')}</th>
                                        <th>{t('actions', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" className="text-center py-4">{t('loading', 'Loading...')}</td></tr>
                                    ) : tickets.length === 0 ? (
                                        <tr><td colSpan="7" className="text-center py-4">{t('no_tickets', 'No tickets found')}</td></tr>
                                    ) : (
                                        tickets.map((ticket) => (
                                            <tr key={ticket._id}>
                                                <td><strong style={{ color: '#1e293b' }}>{ticket.subject}</strong></td>
                                                <td style={{ color: '#475569' }}>{ticket.user?.name || 'N/A'}</td>
                                                <td><span className="badge-custom" style={{ background: '#f1f5f9', color: '#475569' }}>{ticket.category}</span></td>
                                                <td>
                                                    <span className="badge-custom" style={getPriorityStyle(ticket.priority)}>
                                                        {ticket.priority}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge-custom" style={getStatusStyle(ticket.status)}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td style={{ color: '#64748b' }}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary" style={{ padding: '4px 8px' }}>
                                                        <i className="fas fa-reply"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="crm-sidebar">
                        <AIAssistant
                            agentType="support"
                            context={{ ticketsCount: tickets.length, tickets }}
                            onAction={(suggestion) => alert('Support Suggestion Applied')}
                        />

                        <div className="insight-box">
                            <h6 className="mb-3" style={{ color: '#be123c', fontWeight: 700 }}>
                                <i className="fas fa-exclamation-triangle me-2"></i> Priority Overview
                            </h6>
                            <p className="small mb-2" style={{ color: '#475569' }}>Urgent Tickets: <strong style={{ color: '#1e293b' }}>{tickets.filter(t => t.priority === 'urgent').length}</strong></p>
                            <p className="small mb-2" style={{ color: '#475569' }}>Open Tickets: <strong style={{ color: '#1e293b' }}>{tickets.filter(t => t.status === 'open').length}</strong></p>
                            <p className="small mb-0" style={{ color: '#475569' }}>Avg Response Time: <strong style={{ color: '#1e293b' }}>2.4h</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CRMTicketsPage;
