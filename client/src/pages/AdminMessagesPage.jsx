import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Search,
    RefreshCcw,
    Archive,
    User,
    Link as LinkIcon,
    ShieldCheck,
    Inbox,
    CheckCircle2,
    Clock,
    Zap,
    ChevronRight,
    MessageSquare,
    Filter,
    Trash2,
    Mail,
    ArrowLeft
} from "lucide-react";

const AdminMessagesPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
    const currentDir = isRTL ? 'rtl' : 'ltr';

    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async (isManual = false) => {
        if (isManual) setRefreshing(true);
        try {
            const { data } = await axios.get("/api/crm/messages", { withCredentials: true });
            setMessages(data);
            if (selectedMessage) {
                const refreshed = data.find(m => m._id === selectedMessage._id);
                if (refreshed) setSelectedMessage(refreshed);
            }
        } catch {
            toast.error(t('telemetry_error', "Telemetry Sync Failed"));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        const tid = toast.loading(t('sending_reply', "Broadcasting Uplink..."));
        try {
            const { data } = await axios.put(
                `/api/crm/messages/${selectedMessage._id}/reply`,
                { replyText },
                { withCredentials: true }
            );
            toast.success(t('reply_sent', "Packet Delivered"), { id: tid });
            setSelectedMessage(data);
            setReplyText("");
            loadMessages();
        } catch {
            toast.error(t('reply_error', "Broadcast Interrupted"), { id: tid });
        }
    };

    const handleUpdateStatus = async (status, msgId = null) => {
        const id = msgId || selectedMessage?._id;
        if (!id) return;
        try {
            const { data } = await axios.put(
                `/api/crm/messages/${id}/status`,
                { status },
                { withCredentials: true }
            );
            if (selectedMessage?._id === id) {
                if (status === 'archived') {
                    setSelectedMessage(null);
                } else {
                    setSelectedMessage(data);
                }
            }
            loadMessages();
            toast.success(`${t('entity_marked', 'Entity Marked')}: ${status}`);
        } catch {
            toast.error(t('status_update_error', "State Update Failed"));
        }
    };

    const filtered = messages.filter((m) => {
        const fMatch = filter === "all" || m.status === filter;
        const sMatch =
            (m.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (m.subject?.toLowerCase() || "").includes(search.toLowerCase());
        return fMatch && sMatch;
    });

    const getInitials = (name) =>
        name ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "??";

    return (
        <div className="admin-messages-page bg-light min-vh-100" dir={currentDir}>
            <style>{`
                .messages-hero {
                    background: var(--gold-gradient);
                    padding: 40px 0;
                    margin-bottom: 30px;
                    color: #1e293b;
                }
                .messages-hero h1 { font-weight: 800; text-transform: uppercase; margin: 0; color: #0f172a; }
                .messages-hero p { color: #334155; margin: 5px 0 0 0; font-weight: 600; }
                
                .messages-container {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 20px;
                    height: calc(100vh - 250px);
                    min-height: 500px;
                }
                
                @media (max-width: 992px) {
                    .messages-container { grid-template-columns: 1fr; height: auto; }
                }

                /* Sidebar List */
                .inbox-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: var(--shadow-sm);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                }
                
                .inbox-header {
                    padding: 20px;
                    border-bottom: 1px solid #f1f5f9;
                    background: #fff;
                }
                
                .status-filters {
                    display: flex;
                    gap: 8px;
                    padding: 10px 20px;
                    background: #f8fafc;
                    border-bottom: 1px solid #f1f5f9;
                    overflow-x: auto;
                }
                
                .filter-pill {
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #64748b;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                }
                
                .filter-pill.active {
                    background: var(--accent-green);
                    border-color: var(--accent-green);
                    color: white;
                }

                .message-item {
                    padding: 15px 20px;
                    border-bottom: 1px solid #f1f5f9;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                
                .message-item:hover { background: #f8fafc; }
                .message-item.active { 
                    background: rgba(125, 194, 66, 0.05); 
                    border-left: 4px solid var(--accent-green);
                }
                
                .msg-name { font-weight: 700; color: #1e293b; font-size: 0.9rem; }
                .msg-time { font-size: 10px; color: #94a3b8; }
                .msg-subject { font-size: 0.85rem; color: #64748b; margin: 4px 0; }
                
                /* Detail View */
                .detail-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: var(--shadow-sm);
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                }
                
                .detail-header {
                    padding: 25px;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .avatar-gold {
                    width: 45px;
                    height: 45px;
                    background: var(--gold-gradient);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 800;
                }
                
                .detail-scroll {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                }
                
                .msg-subject-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #1e293b;
                    margin-bottom: 20px;
                    color: var(--accent-blue);
                }
                
                .msg-content-text {
                    font-size: 1.05rem;
                    line-height: 1.7;
                    color: #475569;
                    background: #f8fafc;
                    padding: 25px;
                    border-radius: 12px;
                    border: 1px solid #f1f5f9;
                }

                .reply-box {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 20px;
                    margin-top: 30px;
                }
                
                .reply-textarea {
                    width: 100%;
                    border: 1px solid #f1f5f9;
                    border-radius: 12px;
                    padding: 15px;
                    min-height: 120px;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                
                .reply-textarea:focus { border-color: var(--secondary-gold); }

                .thread-item {
                    margin-top: 20px;
                    padding-left: 30px;
                    border-left: 2px solid #e2e8f0;
                }
                
                .reply-bubble {
                    background: #f1f5f9;
                    padding: 15px 20px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    color: #1e293b;
                }
                
                .badge-status {
                    font-size: 10px;
                    font-weight: 800;
                    padding: 2px 10px;
                    border-radius: 100px;
                    text-transform: uppercase;
                }
                .badge-new { background: rgba(0, 107, 179, 0.1); color: var(--accent-blue); }
                .badge-replied { background: rgba(125, 194, 66, 0.1); color: var(--accent-green); }
                .badge-read { background: #f1f5f9; color: #64748b; }
            `}</style>

            <div className="messages-hero">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1>{t('message_inbox', 'Message Inbox')}</h1>
                            <p>{t('crm_hub_desc', 'Enterprise-grade lead and client management')}</p>
                        </div>
                        <Link to="/admin/crm" className="btn btn-light btn-sm rounded-pill px-3">
                            <ArrowLeft size={16} className={isRTL ? 'ms-1' : 'me-1'} />
                            {t('back_to_crm', 'Back to CRM')}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container pb-5">
                <div className="messages-container">
                    {/* List Card */}
                    <div className="inbox-card">
                        <div className="inbox-header">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="m-0 fw-bold">{t('messages', 'Messages')}</h5>
                                <button
                                    onClick={() => loadMessages(true)}
                                    className="btn btn-sm text-muted p-0"
                                    title={t('refresh', 'Refresh')}
                                >
                                    <RefreshCcw size={16} className={refreshing ? 'animate-spin' : ''} />
                                </button>
                            </div>
                            <div className="position-relative">
                                <Search className="position-absolute translate-middle-y top-50 start-0 ms-3 text-muted" size={16} />
                                <input
                                    type="text"
                                    className="form-control form-control-sm ps-5 bg-light border-0"
                                    placeholder={t('search_messages', 'Search signals...')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="status-filters">
                            <button className={`filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                                {t('all_filter', 'All')}
                            </button>
                            <button className={`filter-pill ${filter === 'new' ? 'active' : ''}`} onClick={() => setFilter('new')}>
                                {t('pending_filter', 'New')} ({messages.filter(m => m.status === 'new').length})
                            </button>
                            <button className={`filter-pill ${filter === 'replied' ? 'active' : ''}`} onClick={() => setFilter('replied')}>
                                {t('resolved_filter', 'Replied')}
                            </button>
                        </div>

                        <div className="flex-grow-1 overflow-auto">
                            {loading ? (
                                <div className="p-5 text-center text-muted">
                                    <div className="spinner-border spinner-border-sm text-primary mb-3" role="status"></div>
                                    <div className="small fw-bold">{t('initialising', 'Initialising...')}</div>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="p-5 text-center text-muted opacity-50">
                                    <Mail size={40} className="mb-3" />
                                    <p className="small fw-bold">{t('no_messages', 'No Signals Detected')}</p>
                                </div>
                            ) : (
                                filtered.map((m) => (
                                    <div
                                        key={m._id}
                                        onClick={() => setSelectedMessage(m)}
                                        className={`message-item ${selectedMessage?._id === m._id ? 'active' : ''}`}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <span className="msg-name text-truncate">{m.name}</span>
                                            <span className="msg-time">{format(new Date(m.createdAt), 'HH:mm')}</span>
                                        </div>
                                        <p className="msg-subject text-truncate mb-2">{m.subject}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className={`badge-status badge-${m.status}`}>
                                                {t(`status_${m.status}`, m.status)}
                                            </span>
                                            {m.replies?.length > 0 && <MessageSquare size={12} className="text-muted" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Detail Card */}
                    <div className="detail-card">
                        {selectedMessage ? (
                            <>
                                <div className="detail-header">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-gold">{getInitials(selectedMessage.name)}</div>
                                        <div>
                                            <h5 className="m-0 fw-bold">{selectedMessage.name}</h5>
                                            <small className="text-muted">{selectedMessage.email}</small>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-outline-danger btn-sm rounded-pill"
                                            onClick={() => handleUpdateStatus('archived')}
                                            title={t('archive', 'Archive')}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="detail-scroll">
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <span className="badge bg-light text-muted border py-1 px-3 rounded-pill small fw-bold">
                                            <Clock size={12} className="me-1" />
                                            {format(new Date(selectedMessage.createdAt), 'PPpp')}
                                        </span>
                                        <span className={`badge-status badge-${selectedMessage.status}`}>
                                            {t(`status_${selectedMessage.status}`, selectedMessage.status)}
                                        </span>
                                    </div>

                                    <h1 className="msg-subject-title">{selectedMessage.subject}</h1>

                                    <div className="msg-content-text mb-5">
                                        {selectedMessage.message}
                                    </div>

                                    {/* History */}
                                    {selectedMessage.replies?.length > 0 && (
                                        <div className="resolution-history mt-5">
                                            <h6 className="text-muted text-uppercase small fw-bold mb-4 ls-widest">{t('resolution_history', 'Resolution History')}</h6>
                                            {selectedMessage.replies.map((r, i) => (
                                                <div key={i} className="thread-item">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="small fw-bold text-success">{t('command_response', 'Command Response')}</span>
                                                        <span className="msg-time">{format(new Date(r.createdAt), 'PPpp')}</span>
                                                    </div>
                                                    <div className="reply-bubble">
                                                        {r.replyText}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reply Box */}
                                    <div className="reply-box shadow-sm border-top border-5" style={{ borderTopColor: 'var(--secondary-gold) !important' }}>
                                        <div className="d-flex align-items-center gap-2 mb-3 text-muted">
                                            <Zap size={14} className="text-warning" />
                                            <span className="small fw-bold text-uppercase ls-wide">{t('manual_override', 'Manual Broadcast Override')}</span>
                                        </div>
                                        <form onSubmit={handleReply}>
                                            <textarea
                                                className="reply-textarea mb-3"
                                                placeholder={t('reply_placeholder', "Formulate command response...")}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex gap-2">
                                                    <button type="button" className="btn btn-sm btn-light border rounded-pill small text-muted px-3" style={{ fontSize: '10px' }} onClick={() => setReplyText("Synchronisation confirmed. Sector 4 operational.")}>Fast_Sync</button>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={!replyText.trim()}
                                                    className="btn btn-gold rounded-pill px-4"
                                                    style={{ background: 'var(--gold-gradient)' }}
                                                >
                                                    {t('send', 'Broadcast')} <Send size={14} className="ms-2" />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center opacity-25 p-5">
                                <Inbox size={80} className="mb-4 text-muted" />
                                <h3 className="fw-black text-uppercase ls-widest">{t('awaiting_uplink', 'Awaiting Uplink')}</h3>
                                <p className="text-center">{t('select_message_desc', 'Select a signal from the inbound feed to interrogation its content.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessagesPage;
