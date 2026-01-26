import React from 'react';
import { motion } from 'framer-motion';
import { FaBoxes, FaExclamationTriangle, FaWarehouse, FaSyncAlt } from 'react-icons/fa';

const InventoryKPIs = ({ data }) => {
    const kpis = [
        {
            title: 'Total SKU count',
            value: data?.totalSkus || 0,
            icon: FaBoxes,
            color: '#3b82f6',
            bg: 'rgba(59, 130, 246, 0.1)'
        },
        {
            title: 'Low Stock Alerts',
            value: data?.stockData?.filter(s => s.totalStock < 20).length || 0,
            icon: FaExclamationTriangle,
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.1)'
        },
        {
            title: 'Active Warehouses',
            value: data?.warehouses?.length || 0,
            icon: FaWarehouse,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)'
        },
        {
            title: 'Inventory Turnover',
            value: '4.2x',
            icon: FaSyncAlt,
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.1)'
        }
    ];

    return (
        <div className="row g-3 mb-4">
            {kpis.map((kpi, i) => (
                <div key={i} className="col-lg-3 col-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-4 shadow-sm border-0 h-100 bg-white"
                        style={{ borderLeft: `4px solid ${kpi.color}` }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-3" style={{ background: kpi.bg }}>
                                <kpi.icon size={24} style={{ color: kpi.color }} />
                            </div>
                            <div>
                                <p className="text-muted small mb-1 fw-bold">{kpi.title}</p>
                                <h3 className="mb-0 fw-bold">{kpi.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    );
};

export default InventoryKPIs;
