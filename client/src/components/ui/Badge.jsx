import React from 'react';

/**
 * Neural Badge Component
 * Status indicators and tags.
 * 
 * @param {string} variant - 'success' | 'warning' | 'error' | 'info' | 'neutral'
 */
const Badge = ({ children, variant = 'success', className = '' }) => {

    // Base class from index.css
    const baseClass = "neural-badge";

    let colorStyle = {};

    switch (variant) {
        case 'success':
            colorStyle = { color: '#059669', background: 'rgba(125, 194, 66, 0.1)', borderColor: 'rgba(125, 194, 66, 0.2)' };
            break;
        case 'warning':
            colorStyle = { color: '#d97706', background: 'rgba(253, 188, 63, 0.1)', borderColor: 'rgba(253, 188, 63, 0.2)' };
            break;
        case 'error':
            colorStyle = { color: '#dc2626', background: 'rgba(231, 76, 60, 0.1)', borderColor: 'rgba(231, 76, 60, 0.2)' };
            break;
        case 'info':
            colorStyle = { color: '#2563eb', background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' };
            break;
        default:
            colorStyle = {};
    }

    return (
        <span className={`${baseClass} ${className}`} style={colorStyle}>
            {variant === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />}
            {children}
        </span>
    );
};

export default Badge;
