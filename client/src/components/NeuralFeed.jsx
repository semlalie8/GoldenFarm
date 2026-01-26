import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Zap, Globe, Cpu } from 'lucide-react';

const NeuralFeed = () => {
    const events = [
        { id: 1, type: 'simulation', text: 'Crop Yield Model P95 updated: +2.1% expected gain for Sector 4.', time: '2m ago' },
        { id: 2, type: 'iot', text: 'IoT Gateway sync complete. Soil moisture normalized in Sector 12.', time: '14m ago' },
        { id: 3, type: 'consensus', text: 'Consensus achieved between Agronomist and Risk agents on Q1 Pivot.', time: '45m ago' },
        { id: 4, type: 'ledger', text: 'Monetary layer audit: $42,100 accrued for institutional stakeholders.', time: '1h ago' }
    ];

    return (
        <div className="neural-card" style={{ background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(226, 232, 240, 0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h3 className="neural-badge" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <Radio size={16} /> Real-time Feed
                </h3>
                <div style={{ width: '8px', height: '8px', background: '#7DC242', borderRadius: '50%', animation: 'pulse-green 2s infinite' }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{ display: 'flex', gap: '16px', paddingBottom: '20px', borderBottom: index < events.length - 1 ? '1px solid rgba(241, 245, 249, 0.5)' : 'none' }}
                    >
                        <div style={{ padding: '8px', background: 'white', borderRadius: '12px', border: '1px solid #f1f5f9', height: 'fit-content' }}>
                            {event.type === 'simulation' && <Cpu size={14} style={{ color: '#3b82f6' }} />}
                            {event.type === 'iot' && <Zap size={14} style={{ color: '#eab308' }} />}
                            {event.type === 'consensus' && <Radio size={14} style={{ color: '#7DC242' }} />}
                            {event.type === 'ledger' && <Globe size={14} style={{ color: '#8b5cf6' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '12px', color: '#334155', fontWeight: 600, lineHeight: 1.4, margin: '0 0 4px 0' }}>
                                {event.text}
                            </p>
                            <span className="status-label" style={{ fontSize: '8px', opacity: 0.6 }}>{event.time}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default NeuralFeed;
