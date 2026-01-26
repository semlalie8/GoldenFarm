import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Globe, Zap, AlertTriangle, Lightbulb, RefreshCw, BarChart3, Coins } from 'lucide-react';

const MarketVision = () => {
    const [synthesis, setSynthesis] = useState(null);
    const [movers, setMovers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('AGRICULTURE');

    const fetchMarketData = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

            const [synthRes, moversRes] = await Promise.all([
                axios.get(`/api/market/synthesis?category=${category}`, config),
                axios.get('/api/market/movers', config)
            ]);

            setSynthesis(synthRes.data);
            setMovers(moversRes.data);
        } catch (error) {
            console.error("Market Vision Synchronization Error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketData();
    }, [category]);

    return (
        <div className="market-vision mt-5">
            <style>{`
                .market-vision { background: #0f172a; border-radius: 24px; padding: 40px; color: #f8fafc; border: 1px solid #1e293b; position: relative; overflow: hidden; }
                .vision-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; }
                .data-panel { background: #1e293b; border-radius: 20px; padding: 25px; border: 1px solid #334155; }
                .ai-insight-panel { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-radius: 20px; padding: 30px; border: 1px solid #4338ca; position: relative; }
                .ticker-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #334155; }
                .ticker-item:last-child { border-bottom: none; }
                .trend-badge { padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.7rem; letter-spacing: 0.5px; }
                .trend-up { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .trend-down { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                
                .glowing-icon { filter: drop-shadow(0 0 8px currentColor); }
                .futurist-header { font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; color: #818cf8; }
            `}</style>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h3 fw-black text-white m-0">Phase 5: <span className="text-primary">Market Vision</span></h2>
                    <p className="text-slate-400 small mb-0">Macro-economic Synthesis & Predictive Modeling</p>
                </div>
                <div className="d-flex gap-2">
                    <select
                        className="form-select bg-slate-800 text-white border-slate-700"
                        style={{ width: '180px', fontSize: '0.85rem' }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="AGRICULTURE">Agricultural Hub</option>
                        <option value="HORTICULTURE">Horticulture Trends</option>
                        <option value="OLIVES">Olive Market index</option>
                    </select>
                    <button className="btn btn-primary btn-sm rounded-3" onClick={fetchMarketData}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="vision-grid">
                <div className="d-flex flex-column gap-3">
                    <div className="ai-insight-panel">
                        <div className="futurist-header">
                            <Zap className="glowing-icon" size={24} />
                            <span>Neural Market <span className="text-white">Futurist</span></span>
                        </div>
                        {loading ? (
                            <div className="p-5 text-center text-slate-500">Decrypting market signals...</div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="ai-content"
                                >
                                    <p className="lead mb-4" style={{ lineHeight: 1.7, fontSize: '1rem', color: '#e2e8f0' }}>
                                        {synthesis?.ai_insight?.analysis}
                                    </p>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="p-3 rounded-4 bg-danger bg-opacity-10 border border-danger border-opacity-20 h-100">
                                                <div className="d-flex align-items-center gap-2 text-danger small fw-bold mb-2">
                                                    <AlertTriangle size={14} /> BLACK SWAN RISK
                                                </div>
                                                <p className="small mb-0 text-slate-300">{synthesis?.ai_insight?.risk}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-20 h-100">
                                                <div className="d-flex align-items-center gap-2 text-success small fw-bold mb-2">
                                                    <Lightbulb size={14} /> GOLDEN OPPORTUNITY
                                                </div>
                                                <p className="small mb-0 text-slate-300">{synthesis?.ai_insight?.opportunity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>

                    <div className="data-panel">
                        <h4 className="h6 text-uppercase fw-bold text-slate-500 mb-3 d-flex align-items-center gap-2">
                            <BarChart3 size={16} /> Structural Benchmarks
                        </h4>
                        <div className="row g-3">
                            <div className="col-4">
                                <div className="p-3 bg-slate-900 rounded-4 border border-slate-700">
                                    <span className="d-block small text-slate-500 text-uppercase">Forex (MAD)</span>
                                    <span className="h4 fw-black">{synthesis?.data?.forex?.rate || '10.15'}</span>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="p-3 bg-slate-900 rounded-4 border border-slate-700">
                                    <span className="d-block small text-slate-500 text-uppercase">Sentiment</span>
                                    <span className="h4 fw-black text-primary">{synthesis?.data?.sentiment?.trend}</span>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="p-3 bg-slate-900 rounded-4 border border-slate-700">
                                    <span className="d-block small text-slate-500 text-uppercase">Volatility</span>
                                    <span className="h4 fw-black text-warning">{synthesis?.data?.sentiment?.volatility}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="data-panel">
                    <h4 className="h6 text-uppercase fw-bold text-slate-500 mb-4 d-flex align-items-center gap-2">
                        <Globe size={16} /> Commodity Ticker (Real-Time)
                    </h4>
                    <div className="ticker-list">
                        {movers.map((m, i) => (
                            <div key={i} className="ticker-item">
                                <div>
                                    <span className="fw-black d-block">{m.symbol.replace('_', ' ')}</span>
                                    <span className="small text-slate-500">{m.unit}</span>
                                </div>
                                <div className="text-end">
                                    <span className="d-block fw-bold">{m.price} {m.currency}</span>
                                    <span className={`trend-badge ${m.change?.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
                                        {m.change?.startsWith('+') ? <TrendingUp size={10} className="me-1" /> : <TrendingDown size={10} className="me-1" />}
                                        {m.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10">
                        <div className="d-flex align-items-center gap-2 text-primary small fw-bold mb-1">
                            <Coins size={14} /> EXCHANGE ADVISORY
                        </div>
                        <p className="small text-slate-400 mb-0">Hedge strategies are recommended for USD-denominated exports due to 2.4% volatility in MAD pairings.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketVision;
