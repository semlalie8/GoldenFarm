import React from 'react';
import { FaBoxes, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StockMatrix = ({ stockData, language }) => {
    return (
        <div className="bg-white rounded-4 shadow-sm p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-3">
                <div className="p-2 rounded-3 bg-light text-primary">
                    <FaBoxes size={18} />
                </div>
                <h5 className="fw-bold mb-0">Current Stock Matrix</h5>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle custom-inventory-table">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 rounded-start">Product / SKU</th>
                            <th className="border-0">Warehouse</th>
                            <th className="border-0">On Hand</th>
                            <th className="border-0">Available</th>
                            <th className="border-0 rounded-end">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockData?.map((stock, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div className="fw-bold">
                                        {stock.productInfo[0]?.name?.[language] || stock.productInfo[0]?.name?.en || stock.productInfo[0]?.name}
                                    </div>
                                    <div className="small text-muted">{stock.productInfo[0]?.sku}</div>
                                </td>
                                <td><span className="badge bg-light text-dark px-2 py-1">{stock.warehouseInfo[0]?.name}</span></td>
                                <td className="fw-bold">{stock.totalStock}</td>
                                <td className="text-primary fw-bold">{stock.totalStock}</td>
                                <td>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: stock.totalStock > 0 ? '#10b981' : '#ef4444',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>
                                        {stock.totalStock > 0 ? '● In Stock' : '○ Out of Stock'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {(!stockData || stockData.length === 0) && (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">
                                    No stock records found. Start by receiving goods.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                .custom-inventory-table thead th {
                    padding: 0.75rem 1rem;
                    font-size: 11px;
                    text-transform: uppercase;
                    color: #64748b;
                }
                .custom-inventory-table tbody td {
                    padding: 1rem;
                }
            `}</style>
        </div>
    );
};

export default StockMatrix;
