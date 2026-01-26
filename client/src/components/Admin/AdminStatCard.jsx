import React from 'react';

const AdminStatCard = ({ label, amount, icon, colorClass }) => {
    return (
        <div className="stat-card">
            <div className={`stat-icon ${colorClass}`}>
                <i className={`fas ${icon}`}></i>
            </div>
            <div className="stat-details">
                <h3 className="stat-label">{label}</h3>
                <p className="stat-amount">{amount}</p>
            </div>
        </div>
    );
};

export default AdminStatCard;
