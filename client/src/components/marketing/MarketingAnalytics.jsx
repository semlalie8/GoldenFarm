import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { FaChartPie, FaStream } from 'react-icons/fa';

const MarketingAnalytics = ({ stats, t }) => {
    return (
        <div className="row mb-4">
            <div className="col-lg-8">
                <div className="m-section h-100">
                    <div className="m-section-title d-flex justify-content-between">
                        <span><FaChartPie /> {t('growth_trends', 'Growth Trends (30 Days)')}</span>
                        <select className="form-select form-select-sm w-auto">
                            <option>Visits vs Leads</option>
                            <option>Sales Revenue</option>
                        </select>
                    </div>
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer>
                            <AreaChart data={stats?.trends}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Area type="monotone" dataKey="visits" stroke="#8884d8" fillOpacity={1} fill="url(#colorVisits)" name={t('visits', 'Visits')} />
                                <Area type="monotone" dataKey="leads" stroke="#82ca9d" fillOpacity={1} fill="url(#colorLeads)" name={t('leads', 'Leads')} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="col-lg-4">
                <div className="m-section h-100">
                    <div className="m-section-title"><FaStream /> {t('traffic_sources', 'Traffic Sources')}</div>
                    <div style={{ width: '100%', height: '250px' }}>
                        <ResponsiveContainer>
                            <BarChart layout="vertical" data={stats?.sources || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4">
                        <h6 className="text-muted text-uppercase small fw-bold mb-3">{t('top_content', 'Top Content')}</h6>
                        <ul className="list-group list-group-flush small">
                            {stats?.topPages?.map((page, idx) => (
                                <li key={idx} className="list-group-item px-0 d-flex justify-content-between align-items-center bg-transparent border-bottom-0 py-1">
                                    <span className="text-truncate" style={{ maxWidth: '200px' }}>{page.url}</span>
                                    <span className="badge bg-light text-dark border">{page.count}</span>
                                </li>
                            ))}
                            {(!stats?.topPages || stats.topPages.length === 0) && (
                                <li className="list-group-item px-0 text-muted">No page data yet.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingAnalytics;
