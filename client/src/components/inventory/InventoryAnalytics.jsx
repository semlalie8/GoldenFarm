import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';

const InventoryAnalytics = ({ stockData }) => {
    // Transform stockData for Pie Chart (Stock by Product)
    const productStats = stockData?.reduce((acc, curr) => {
        const prodName = curr.productInfo?.[0]?.name?.en || 'Unknown';
        if (!acc[prodName]) acc[prodName] = 0;
        acc[prodName] += curr.totalStock;
        return acc;
    }, {});

    const pieData = Object.entries(productStats || {}).map(([name, value]) => ({ name, value }));
    const COLORS = ['#7DC242', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Bar Data (Stock by Warehouse)
    const warehouseStats = stockData?.reduce((acc, curr) => {
        const whName = curr.warehouseInfo?.[0]?.name || 'Unknown';
        if (!acc[whName]) acc[whName] = 0;
        acc[whName] += curr.totalStock;
        return acc;
    }, {});

    const barData = Object.entries(warehouseStats || {}).map(([name, count]) => ({ name, count }));

    return (
        <div className="row g-4 mb-4">
            <div className="col-lg-7">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-4 shadow-sm bg-white h-100"
                >
                    <h5 className="fw-bold mb-4">Stock Distribution by Warehouse</h5>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#7DC242" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
            <div className="col-lg-5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-4 shadow-sm bg-white h-100"
                >
                    <h5 className="fw-bold mb-4">Product Inventory Share</h5>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default InventoryAnalytics;
