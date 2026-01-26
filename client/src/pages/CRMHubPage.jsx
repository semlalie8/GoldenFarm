import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CRMHubPage = () => {
    const { t, i18n } = useTranslation();
    const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    return (
        <div className="crm-hub-page py-5" dir={currentDir}>
            <div className="container">
                <div className="card-header-custom mb-5">
                    <h1 className="fw-bold text-success mb-2">
                        <i className="fas fa-network-wired me-3"></i>
                        {t('crm_hub', 'CRM Hub')}
                    </h1>
                    <p className="text-muted fs-5">{t('crm_hub_desc', 'Enterprise-grade lead and client management')}</p>
                </div>

                <div className="row g-4">
                    {/* Section 1: User & Relationship Management */}
                    <div className="col-12 mt-2">
                        <h3 className="h4 fw-bold border-bottom pb-2 mb-4">
                            <i className="fas fa-users-cog me-2"></i> {t('user_account_mgmt', 'User & Account Management')}
                        </h3>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <Link to="/admin/users" className="quick-access-card h-100">
                            <div className="qa-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                                <i className="fas fa-user-friends"></i>
                            </div>
                            <h4>{t('manage_users', 'Manage Users')}</h4>
                            <p>{t('manage_users_desc', 'View and manage user accounts')}</p>
                        </Link>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <Link to="/admin/user-info" className="quick-access-card h-100">
                            <div className="qa-icon" style={{ background: '#f1f8e9', color: '#558b2f' }}>
                                <i className="fas fa-info-circle"></i>
                            </div>
                            <h4>{t('user_information', 'User Information')}</h4>
                            <p>{t('user_information_desc', 'View detailed user activity and location')}</p>
                        </Link>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <Link to="/admin/logins" className="quick-access-card h-100">
                            <div className="qa-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
                                <i className="fas fa-history"></i>
                            </div>
                            <h4>{t('login_history', 'Login History')}</h4>
                            <p>{t('login_history_desc', 'View login logs and stats')}</p>
                        </Link>
                    </div>

                    {/* Section 2: Pipeline & Commerce */}
                    <div className="col-12 mt-5">
                        <h3 className="h4 fw-bold border-bottom pb-2 mb-4">
                            <i className="fas fa-funnel-dollar me-2"></i> {t('pipeline_commerce', 'Pipeline & Commerce')}
                        </h3>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <Link to="/admin/crm/leads" className="quick-access-card h-100">
                            <div className="qa-icon" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>
                                <i className="fas fa-users-viewfinder"></i>
                            </div>
                            <h4>{t('manage_leads', 'Manage Leads')}</h4>
                            <p>{t('manage_leads_desc', 'Track potential investors and partners')}</p>
                        </Link>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <Link to="/admin/crm/orders" className="quick-access-card h-100">
                            <div className="qa-icon" style={{ background: '#fff3e0', color: '#ef6c00' }}>
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <h4>{t('manage_orders', 'Order Management')}</h4>
                            <p>{t('manage_orders_desc', 'Track marketplace sales and fulfillment')}</p>
                        </Link>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <Link to="/admin/crm/tickets" className="quick-access-card h-100">
                            <div className="qa-icon" style={{ background: '#ffebee', color: '#c62828' }}>
                                <i className="fas fa-headset"></i>
                            </div>
                            <h4>{t('support_tickets', 'Support Tickets')}</h4>
                            <p>{t('support_tickets_desc', 'Customer success and dispute handling')}</p>
                        </Link>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <Link to="/admin/crm/messages" className="quick-access-card h-100">
                            <div className="qa-icon" style={{ background: '#e0f2f1', color: '#00695c' }}>
                                <i className="fas fa-inbox"></i>
                            </div>
                            <h4>{t('message_inbox', 'Message Inbox')}</h4>
                            <p>{t('message_inbox_desc', 'Manage public contact form inquiries')}</p>
                        </Link>
                    </div>

                    {/* Section 3: Growth & Intelligence */}
                    <div className="col-12 mt-5">
                        <h3 className="h4 fw-bold border-bottom pb-2 mb-4">
                            <i className="fas fa-brain me-2"></i> {t('growth_intelligence', 'Growth & Marketing Intelligence')}
                        </h3>
                    </div>

                    <div className="col-lg-6 col-md-6">
                        <Link to="/admin/marketing" className="quick-access-card h-100">
                            <div className="qa-icon" style={{ background: '#e3f2fd', color: '#0d47a1' }}>
                                <i className="fas fa-bullhorn"></i>
                            </div>
                            <h4>{t('growth_hub_title', 'Growth Analytics & CDPs')}</h4>
                            <p>{t('growth_hub_desc_detail', 'Track funnels, segments, and multi-channel campaign performance.')}</p>
                        </Link>
                    </div>

                    <div className="col-lg-6 col-md-6">
                        <Link to="/admin/automation" className="quick-access-card h-100">
                            <div className="qa-icon" style={{ background: '#fff9c4', color: '#fbc02d' }}>
                                <i className="fas fa-robot"></i>
                            </div>
                            <h4>{t('ai_audit_hub', 'AI Agent Audit Hub')}</h4>
                            <p>{t('ai_audit_hub_desc', 'Monitor and approve AI decisions across CRM and Marketing layers.')}</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CRMHubPage;
