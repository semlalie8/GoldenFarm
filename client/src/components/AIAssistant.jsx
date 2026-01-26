import React, { useState } from 'react';
import axios from 'axios';
import { FaRobot, FaLightbulb, FaMagic } from 'react-icons/fa';

const AIAssistant = ({ agentType, context, onAction }) => {
    const [suggestion, setSuggestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isFinance = agentType.toUpperCase() === 'FINANCE';
    const isRTL = suggestion && /[\u0600-\u06FF]/.test(suggestion);

    const getSuggestion = async () => {
        try {
            setLoading(true);
            const task = isFinance
                ? `Analyze the following PCM Klassen, current trajectory, and CGI-2026 context. Provide a high-fidelity audit and tax optimization strategy. Context: ${JSON.stringify(context)}`
                : `Analyze the current context and provide a strategic recommendation or draft. Context: ${JSON.stringify(context)}`;

            const { data } = await axios.post('/api/automation/run-agent', {
                agentName: agentType,
                task,
                context
            });
            setSuggestion(data.output);
            setError(null);
        } catch (err) {
            setError('Failed to get AI recommendation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`ai-agent-container ${isFinance ? 'sap-ai-mode' : ''}`}>
            <style>{`
                .ai-agent-container {
                    background: #f8fafc;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                }
                .sap-ai-mode {
                    background: #ffffff;
                    border-color: #0070f2;
                    border-width: 2px;
                    box-shadow: 0 20px 50px rgba(0, 112, 242, 0.1);
                }
                .ai-agent-header {
                    background: #f1f5f9;
                    color: #1e293b;
                    padding: 12px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e2e8f0;
                }
                .sap-ai-mode .ai-agent-header {
                    background: #0070f2;
                    color: white;
                    border-bottom: none;
                }
                .ai-agent-title {
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    display: flex;
                    align-items: center;
                }
                .ai-agent-badge {
                    background: #10b981;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 9999px;
                    font-size: 0.65rem;
                    animation: pulse 2s infinite;
                }
                .sap-ai-mode .ai-agent-badge {
                    background: rgba(255,255,255,0.2);
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .ai-agent-body {
                    padding: 15px;
                }
                .ai-suggestion-text {
                    font-size: 0.875rem;
                    color: #475569;
                    line-height: 1.5;
                }
                .sap-ai-mode .ai-suggestion-text {
                    font-weight: 600;
                    color: #1C2D3D;
                    font-style: italic;
                }
                .ai-btn-gen {
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.2s;
                }
                .sap-ai-mode .ai-btn-gen {
                    background: #0070f2;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .ai-btn-gen:hover { background: #1d4ed8; }
                .ai-btn-apply {
                    background: #059669;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    cursor: pointer;
                }
                .loader-spinner {
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #3498db;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 2s linear infinite;
                    margin: 0 auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            <div className="ai-agent-header">
                <div className="ai-agent-title">
                    <FaRobot style={{ marginRight: '8px' }} /> {agentType.toUpperCase()} {isFinance ? 'EXECUTIVE' : ''} INTELLIGENCE
                </div>
                <div className="ai-agent-badge">Live</div>
            </div>

            <div className="ai-agent-body" dir={isRTL ? 'rtl' : 'ltr'}>
                {!suggestion && !loading && (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                            {isFinance ? 'SAP Oracle monitoring fiscal trajectory.' : 'Agent is monitoring this workspace.'}
                        </p>
                        <button className="ai-btn-gen" onClick={getSuggestion}>
                            <FaMagic style={{ marginRight: '6px' }} /> {isFinance ? 'Generate Audit Strategy' : 'Generate Strategy'}
                        </button>
                    </div>
                )}

                {loading && (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div className="loader-spinner"></div>
                        <p style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '10px' }}>
                            {isFinance ? 'Consulting CGI-2026 & LF-2026...' : 'Processing context...'}
                        </p>
                    </div>
                )}

                {suggestion && (
                    <div>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <FaLightbulb style={{ color: '#f59e0b', marginTop: '4px' }} />
                            <div className="ai-suggestion-text">
                                {suggestion.split('\n').map((line, i) => <p key={i} style={{ marginBottom: '8px' }}>{line}</p>)}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button className="ai-btn-apply" onClick={() => onAction(suggestion)}>Apply</button>
                            <button style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#64748b', cursor: 'pointer' }} onClick={() => setSuggestion(null)}>Dismiss</button>
                        </div>
                    </div>
                )}

                {error && <p style={{ color: '#ef4444', fontSize: '0.75rem', textAlign: 'center' }}>{error}</p>}
            </div>
        </div>
    );
};

export default AIAssistant;
