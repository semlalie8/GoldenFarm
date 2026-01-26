import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Brain, Send, X, Sparkles, Database, Activity, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const BaidarChatWidget = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "أهلاً بك. I am Baidar (بيدر), your agricultural intelligence engine. How can I grow your success today?" }
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
            const { data } = await axios.post('/api/ai/chat',
                { message: input, agent: 'Farmer Support & Success Agent' },
                {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                    timeout: 300000
                }
            );

            setMessages(prev => [...prev, { role: 'assistant', content: data.output }]);
        } catch (error) {
            console.error(error);
            const errorMsg = error.code === 'ECONNABORTED'
                ? "The Neural Link timed out. Baidar is deep in thought."
                : "Neural Link Interrupted. Ensure Baidar is online.";
            setMessages(prev => [...prev, { role: 'error', content: errorMsg }]);
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
                            backgroundColor: '#fdfcf0',
                            borderRadius: '32px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            marginBottom: '20px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                            color: '#334155'
                        }}
                    >
                        {/* Premium Header */}
                        <div style={{
                            padding: '24px',
                            background: 'linear-gradient(135deg, #fdfcf0 0%, #fef9c3 100%)',
                            borderBottom: '1px solid #e2e8f0',
                            position: 'relative'
                        }}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="p-3 bg-white rounded-2xl border border-[#d4a017]/20 shadow-sm">
                                            <Brain className="w-7 h-7 text-[#d4a017]" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#fdfcf0] shadow-sm"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[#1e293b] text-lg tracking-tight m-0">Baidar <span className="text-[#d4a017] font-mono text-xs ml-1">بيدر 2.0</span></h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Harvest Wisdom Online</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200/50 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Telemetry Bar */}
                        <div style={{ padding: '8px 24px', backgroundColor: '#fafaf2', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '15px' }}>
                            <div className="flex items-center gap-1.5">
                                <Activity size={10} className="text-[#d4a017]" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Wisdom Link: Active</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Database size={10} className="text-[#d4a017]" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Sync: 100%</span>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'white' }} className="scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-start gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-slate-100 border-slate-200' : 'bg-[#fef9c3] border-[#fde047]'}`}>
                                            {msg.role === 'user' ? <User size={14} className="text-slate-600" /> : <Brain size={14} className="text-[#d4a017]" />}
                                        </div>
                                        <div style={{
                                            padding: '14px 18px',
                                            borderRadius: msg.role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                                            backgroundColor: msg.role === 'user' ? '#d4a017' : '#f8fafc',
                                            color: msg.role === 'user' ? '#ffffff' : '#334155',
                                            fontSize: '14px',
                                            lineHeight: '1.6',
                                            boxShadow: msg.role === 'user' ? '0 4px 12px rgba(212, 160, 23, 0.2)' : '0 2px 6px rgba(0,0,0,0.02)',
                                            border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0'
                                        }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-[#d4a017] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                                <span className="w-1.5 h-1.5 bg-[#d4a017] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                <span className="w-1.5 h-1.5 bg-[#d4a017] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consulting Wisdom...</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: '24px', backgroundColor: '#fdfcf0', borderTop: '1px solid #e2e8f0' }}>
                            <div className="relative flex items-center gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask Baidar anything..."
                                    style={{ flex: 1, padding: '16px 20px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#334155', fontSize: '14px', outline: 'none' }}
                                />
                                <button onClick={handleSend} disabled={isLoading || !input.trim()} style={{ backgroundColor: '#d4a017', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', opacity: (isLoading || !input.trim()) ? 0.5 : 1 }}>
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.1, y: -4 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
                <div className="relative">
                    <div className="absolute inset-0 bg-[#d4a017]/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-[#fef9c3] to-[#d4a017] rounded-[28px] flex items-center justify-center shadow-2xl border border-white/20">
                        {isOpen ? <X size={32} className="text-[#1a1a1a]" /> : <Brain size={42} className="text-[#000000]" />}
                    </div>
                </div>
            </motion.button>
        </div>
    );
};

export default BaidarChatWidget;
