import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Send, X, Database, Zap, User, Terminal, Cpu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const AegisChatWidget = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Admin Systems Online. I am Aegis (حارس), your Governance Intelligence. How shall we optimize the platform today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { userInfo } = useSelector((state) => state.auth);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Instant Response for Simulations to manage latency expectation
            if (input.toLowerCase().includes('audit') || input.toLowerCase().includes('simulation')) {
                setMessages(prev => [...prev, { role: 'assistant', content: "[PRECISION KERNEL ACTIVATED] Accessing deterministic data layer. Performing cross-reference analysis between IoT telemetry and historical benchmarks. This will require increased compute cycles..." }]);
            }

            const { data } = await axios.post('/api/ai/chat',
                { message: input, agent: 'Sales & Partnerships Agent' },
                {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                    timeout: 300000
                }
            );

            setMessages(prev => [...prev, { role: 'assistant', content: data.output }]);
        } catch (error) {
            console.error(error);
            const statusMsg = error.response ? `[System Error ${error.response.status}]` : "[Link Timeout]";
            setMessages(prev => [...prev, {
                role: 'error',
                content: `Governance Link Interrupted. ${statusMsg} Check if AI Kernel (Ollama) is running and Llama3 is loaded.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
        }}>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                        style={{
                            width: '420px',
                            maxWidth: 'calc(100vw - 60px)',
                            height: '620px',
                            backgroundColor: '#0f172a',
                            borderRadius: '32px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            marginBottom: '20px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            color: '#f1f5f9'
                        }}
                    >
                        {/* Admin Header */}
                        <div style={{
                            padding: '24px',
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            position: 'relative'
                        }}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                                            <ShieldCheck size={28} className="text-blue-400" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-[#0f172a] shadow-sm"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-lg tracking-tight m-0">Aegis <span className="text-blue-400 font-mono text-xs ml-1">حارس 2.0</span></h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Governance Overlink Active</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Admin Telemetry */}
                        <div style={{ padding: '8px 24px', backgroundColor: '#1e293b', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '15px' }}>
                            <div className="flex items-center gap-1.5">
                                <Terminal size={10} className="text-blue-400" />
                                <span className="text-[9px] font-bold text-blue-400/70 uppercase tracking-tighter">Kernel: Secure</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Cpu size={10} className="text-blue-400" />
                                <span className="text-[9px] font-bold text-blue-400/70 uppercase tracking-tighter">ACCESS: LEVEL_10</span>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#0f172a' }} className="scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-start gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-slate-800 border-slate-700' : 'bg-blue-500/10 border-blue-500/20'}`}>
                                            {msg.role === 'user' ? <User size={14} className="text-slate-400" /> : <Zap size={14} className="text-blue-400" />}
                                        </div>
                                        <div style={{
                                            padding: '14px 18px',
                                            borderRadius: msg.role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                                            backgroundColor: msg.role === 'user' ? '#3b82f6' : 'rgba(30, 41, 59, 0.7)',
                                            color: msg.role === 'user' ? '#ffffff' : '#e2e8f0',
                                            fontSize: '14px',
                                            lineHeight: '1.6',
                                            boxShadow: msg.role === 'user' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)',
                                            border: 'none'
                                        }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-blue-500/20">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        </div>
                                        <span className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest">Executing Logic...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Admin Input Area */}
                        <div style={{ padding: '24px', backgroundColor: '#0f172a', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div className="relative flex items-center gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Issue System Command..."
                                    style={{ flex: 1, padding: '16px 20px', backgroundColor: '#1e293b', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', color: 'white', fontSize: '14px', outline: 'none' }}
                                />
                                <button onClick={handleSend} disabled={isLoading || !input.trim()} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', opacity: (isLoading || !input.trim()) ? 0.5 : 1 }}>
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.1, y: -4 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative w-20 h-20 bg-[#1e293b] rounded-[28px] flex items-center justify-center shadow-2xl border border-blue-500 shadow-blue-500/20">
                        {isOpen ? <X size={32} className="text-white" /> : <ShieldCheck size={42} className="text-blue-400" />}
                    </div>
                </div>
            </motion.button>
        </div>
    );
};

export default AegisChatWidget;
