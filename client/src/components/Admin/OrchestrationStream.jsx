import React from 'react';
import { useTranslation } from 'react-i18next';

const OrchestrationStream = ({ automation, currentDir }) => {
    const { t } = useTranslation();

    return (
        <div className="quick-access-card h-100 bg-dark text-white p-4" style={{ borderRadius: '16px', border: '1px solid #334155' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">
                    <i className="fas fa-microchip me-2 text-info"></i>
                    {t('autonomous_orchestrator', 'Autonomous Orchestrator')}
                </h5>
                <span className="badge bg-success">
                    <i className="fas fa-check-circle me-1"></i>
                    {automation?.systemHealth?.status || 'Active'}
                </span>
            </div>

            <div className="event-stream" style={{ fontSize: '0.8rem', height: '180px', overflowY: 'auto', background: '#0f172a', padding: '15px', borderRadius: '10px' }}>
                {automation?.cdpFeed?.map((ev, i) => (
                    <div key={i} className="mb-2 pb-2 border-bottom border-secondary d-flex justify-content-between">
                        <span>
                            <i className="fas fa-chevron-right text-purple me-2" style={{ color: '#8b5cf6' }}></i>
                            <span className="text-info">{ev.event}</span>:
                            <span className="text-secondary ml-2">{JSON.stringify(ev.properties).substring(0, 50)}...</span>
                        </span>
                        <small className="text-muted">{new Date(ev.createdAt).toLocaleTimeString()}</small>
                    </div>
                ))}
                {(!automation?.cdpFeed || automation.cdpFeed.length === 0) && (
                    <div className="text-center text-muted mt-4">Waiting for system signals...</div>
                )}
            </div>

            <div className="mt-4 pt-3 border-top border-secondary d-flex gap-4">
                <div>
                    <small className="d-block text-muted">{t('last_sync', 'Last Sync')}</small>
                    <span className="text-info">{automation?.systemHealth?.lastSync ? new Date(automation.systemHealth.lastSync).toLocaleTimeString() : '--:--'}</span>
                </div>
                <div>
                    <small className="d-block text-muted">{t('nodes_connected', 'Nodes Connected')}</small>
                    <span className="text-success">{automation?.systemHealth?.connectedNodes || 0} Subsystems</span>
                </div>
                <div>
                    <small className="d-block text-muted">{t('persistence_status', 'Persistence')}</small>
                    <span className="text-warning">
                        <i className="fas fa-layer-group me-1"></i>
                        {automation?.persistenceQueue?.length || 0} Jobs
                    </span>
                </div>
                <div>
                    <small className="d-block text-muted">{t('automation_mode', 'Automation Mode')}</small>
                    <span style={{ color: '#8b5cf6' }}><i className="fas fa-robot me-1"></i> Hyper-Connected</span>
                </div>
            </div>
        </div>
    );
};

export default OrchestrationStream;
