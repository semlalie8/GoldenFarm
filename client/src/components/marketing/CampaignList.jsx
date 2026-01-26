import React from 'react';
import { FaBullhorn } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

const CampaignList = ({ campaigns, onLaunchNew, t }) => {
    return (
        <div className="m-section">
            <div className="m-section-title">
                <FaBullhorn /> {t('active_campaigns', 'Active Growth Campaigns')}
                <span className="badge bg-primary ms-2 rounded-pill" style={{ fontSize: '0.7em', verticalAlign: 'middle' }}>{campaigns.length}</span>
            </div>
            <div className="campaign-list">
                {campaigns.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-3 text-muted" style={{ opacity: 0.5 }}>
                            <FaBullhorn size={40} />
                        </div>
                        <h5 style={{ color: '#334155' }}>{t('no_campaigns_title', 'No Active Campaigns')}</h5>
                        <p style={{ color: '#64748b' }}>{t('no_active_campaigns', 'Launch a new AI-driven campaign to start generating leads.')}</p>
                        <Button variant="outline-primary" size="sm" onClick={onLaunchNew}>
                            {t('launch_first', 'Launch First Campaign')}
                        </Button>
                    </div>
                ) : (
                    campaigns.map(camp => (
                        <div key={camp._id} className="campaign-item">
                            <div className="c-info">
                                <h4>{camp.name}</h4>
                                <p>{camp.type.toUpperCase()} • {camp.targetSegment?.name || 'All Users'}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '30px', textAlign: 'right' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{camp.metrics.opened}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>OPEN RATE</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{camp.metrics.converted}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>CONVERSIONS</div>
                                </div>
                                <span className="c-status status-active">{camp.status}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CampaignList;
