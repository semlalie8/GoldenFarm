import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Search, Database, Cpu, Filter, ChevronRight, Clock, ShieldCheck } from 'lucide-react';

const NeuralRepository = () => {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('all');

    const fetchMemories = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            };
            let url = '/api/intelligence/memories';
            if (sourceFilter !== 'all') url += `?source=${sourceFilter}`;

            const { data } = await axios.get(url, config);
            setMemories(data);
        } catch (error) {
            console.error('Error fetching neural memories', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemories();
    }, [sourceFilter]);

    const filteredMemories = memories.filter(m =>
        m.content.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="neural-repo mt-4">
            <style>{`
                .neural-repo { background: #0f172a; border-radius: 20px; padding: 30px; color: #f8fafc; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
                .repo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #1e293b; padding-bottom: 15px; }
                .repo-title { font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 12px; }
                .repo-glow { color: #3b82f6; filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5)); }
                
                .search-bar { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 10px 15px; display: flex; align-items: center; gap: 10px; flex: 1; max-width: 400px; }
                .search-bar input { background: transparent; border: none; color: white; outline: none; width: 100%; font-size: 0.9rem; }
                
                .memory-item { background: #1e293b; border-radius: 12px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #3b82f6; transition: all 0.3s ease; }
                .memory-item:hover { transform: translateX(5px); background: #2d3748; }
                .memory-meta { display: flex; gap: 15px; font-size: 0.7rem; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
                .memory-content { font-size: 0.9rem; line-height: 1.6; color: #e2e8f0; }
                
                .source-badge { padding: 2px 8px; border-radius: 4px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
            `}</style>

            <div className="repo-header">
                <div className="repo-title">
                    <Brain className="repo-glow" size={28} />
                    <span>Neural <span className="text-primary">Repository</span></span>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <div className="search-bar">
                        <Search size={18} className="text-slate-400" />
                        <input
                            placeholder="Query knowledge base..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <select
                        className="form-select bg-slate-900 text-white border-slate-700"
                        style={{ width: '150px', fontSize: '0.85rem' }}
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                    >
                        <option value="all">All Sources</option>
                        <option value="strategic_consensus">Strategic</option>
                        <option value="global_consensus">Global</option>
                    </select>
                </div>
            </div>

            <div className="memory-list" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                {loading ? (
                    <div className="text-center p-5">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Cpu size={40} className="text-primary opacity-50" />
                        </motion.div>
                        <p className="mt-3 text-slate-400">Interrogating Vector Memory...</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredMemories.map((mem, i) => (
                            <motion.div
                                key={mem._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="memory-item"
                            >
                                <div className="memory-meta">
                                    <span className="source-badge">
                                        {mem.metadata?.source?.replace('_', ' ') || 'General Knowledge'}
                                    </span>
                                    <span><Clock size={12} className="me-1" /> {new Date(mem.createdAt).toLocaleString()}</span>
                                    {mem.metadata?.confidence && (
                                        <span className="text-success ml-auto">
                                            <ShieldCheck size={12} className="me-1" />
                                            {(mem.metadata.confidence * 100).toFixed(0)}% Confidence
                                        </span>
                                    )}
                                </div>
                                <div className="memory-content">
                                    {mem.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                {!loading && filteredMemories.length === 0 && (
                    <div className="text-center p-5 text-slate-500">
                        <Database size={40} className="mb-3 opacity-20" />
                        <p>No historical narratives match your query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NeuralRepository;
