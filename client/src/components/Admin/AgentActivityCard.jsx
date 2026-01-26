import React from 'react';
import { useTranslation } from 'react-i18next';

const AgentActivityCard = ({ logs }) => {
    const { t } = useTranslation();

    return (
        <div className="quick-access-card h-100 border-purple shadow-sm p-4" style={{ borderColor: '#8b5cf6' }}>
            <h5 className="mb-3" style={{ color: '#8b5cf6' }}>
                <i className="fas fa-magic me-2"></i>
                {t('ai_agent_activity', 'AI Agent Activity')}
            </h5>
            <div className="agent-activity" style={{ fontSize: '0.8rem' }}>
                {logs?.slice(0, 4).map((log, i) => (
                    <div key={i} className="mb-3">
                        <div className="d-flex justify-content-between">
                            <strong className="text-primary">{log.agentName}</strong>
                            <small className="text-muted">{new Date(log.createdAt).toLocaleTimeString()}</small>
                        </div>
                        <p className="mb-1 text-truncate" title={log.input}>{log.input}</p>
                        <span className="badge bg-light text-dark p-1">Completed</span>
                    </div>
                ))}
                {(!logs || logs.length === 0) && (
                    <div className="text-center text-muted mt-4">No recent decisions made.</div>
                )}
            </div>
        </div>
    );
};

export default AgentActivityCard;
