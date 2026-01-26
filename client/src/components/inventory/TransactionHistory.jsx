import React from 'react';
import { FaHistory, FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TransactionHistory = ({ logs }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-4 shadow-sm bg-white"
        >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-3 bg-light text-primary">
                        <FaHistory size={18} />
                    </div>
                    <h5 className="fw-bold mb-0">Inventory Audit Trail</h5>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle custom-inventory-table">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 rounded-start">Timestamp</th>
                            <th className="border-0">Product</th>
                            <th className="border-0">Type</th>
                            <th className="border-0">Quantity</th>
                            <th className="border-0">Warehouse</th>
                            <th className="border-0 rounded-end">Performed By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr key={i}>
                                <td className="small text-muted">{new Date(log.createdAt).toLocaleString()}</td>
                                <td className="fw-bold">{log.product?.name?.en} <br /><small className="text-muted fw-normal">{log.product?.sku}</small></td>
                                <td>
                                    <span className={`badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 ${log.type === 'IN' ? 'bg-success-subtle text-success' :
                                            log.type === 'OUT' ? 'bg-danger-subtle text-danger' :
                                                'bg-primary-subtle text-primary'
                                        }`}>
                                        {log.type === 'IN' && <FaArrowUp size={10} />}
                                        {log.type === 'OUT' && <FaArrowDown size={10} />}
                                        {log.type === 'ADJUSTMENT' && <FaExchangeAlt size={10} />}
                                        {log.type}
                                    </span>
                                </td>
                                <td className={`fw-bold ${log.quantity > 0 ? 'text-success' : 'text-danger'}`}>
                                    {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                                </td>
                                <td><span className="text-muted">{log.warehouse?.name}</span></td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="avatar-xs rounded-circle bg-info text-white d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, fontSize: '10px' }}>
                                            {log.performedBy?.name?.charAt(0)}
                                        </div>
                                        <span className="small">{log.performedBy?.name}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .custom-inventory-table thead th {
                    padding: 1rem;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #64748b;
                }
                .custom-inventory-table tbody td {
                    padding: 1.25rem 1rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .avatar-xs {
                    flex-shrink: 0;
                }
            `}</style>
        </motion.div>
    );
};

export default TransactionHistory;
