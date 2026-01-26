import React from 'react';

/**
 * Status Indicator Component
 * Used in the top status bar to show key metrics (e.g. "System Status: Online").
 */
const StatusIndicator = ({ label, value, active = true, color = '#7DC242' }) => {
    return (
        <div className="status-item">
            <span className="status-label">{label}</span>
            <div className="status-value">
                {active && (
                    <div
                        className="status-indicator"
                        style={{ backgroundColor: color, boxShadow: active ? `0 0 0 0 ${color}` : 'none' }}
                    />
                )}
                {value}
            </div>
        </div>
    );
};

export default StatusIndicator;
