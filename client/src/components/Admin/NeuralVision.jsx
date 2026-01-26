import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Upload, Image as ImageIcon, Search, ShieldCheck, Zap, AlertTriangle, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const NeuralVision = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("CROP_HEALTH");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const runAnalysis = async () => {
        if (!previewUrl) return;
        setLoading(true);
        setAnalysis(null);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const promptMap = {
                "CROP_HEALTH": "Analyze this crop photo for pests, diseases, or nutrient deficiencies. Provide a specific management recommendation.",
                "INVOICE_AUDIT": "Extract the vendor name, total amount, and date from this invoice. Flag any suspicious line items.",
                "IOT_DIAGNOSTIC": "Identify the irrigation hardware in this photo and evaluate its physical condition (leaks, rust, or blockage)."
            };

            const { data } = await axios.post('/api/vision/analyze', {
                image: previewUrl,
                prompt: promptMap[category],
                category
            }, {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });

            setAnalysis(data.analysis);
            toast.success("Visual Cortex Analysis Complete");
        } catch (error) {
            toast.error("Vision Signal Disrupted");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="neural-vision mt-5">
            <style>{`
                .neural-vision { background: #0f172a; border-radius: 24px; padding: 40px; color: #f8fafc; border: 1px solid #334155; }
                .vision-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                .upload-zone { border: 2px dashed #334155; border-radius: 20px; height: 350px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; overflow: hidden; position: relative; }
                .upload-zone:hover { border-color: #3b82f6; background: #1e293b; }
                .analysis-panel { background: #1e293b; border-radius: 20px; padding: 30px; border: 1px solid #334155; position: relative; min-height: 350px; }
                .type-selector { display: flex; gap: 10px; margin-bottom: 25px; }
                .type-btn { background: #0f172a; border: 1px solid #334155; color: #94a3b8; padding: 8px 16px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; transition: all 0.2s; }
                .type-btn.active { border-color: #3b82f6; color: white; background: #1d4ed8; }
                
                .scanline { position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: rgba(59, 130, 246, 0.5); box-shadow: 0 0 10px #3b82f6; z-index: 10; pointer-events: none; }
                .analysis-content { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; line-height: 1.6; color: #10b981; }
            `}</style>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h3 fw-black m-0 d-flex align-items-center gap-3 text-white">
                        <Eye className="text-primary" size={32} />
                        Neural <span className="text-primary">Vision</span> Hub
                    </h2>
                    <p className="text-slate-400 small mb-0 mt-1">Multi-Modal context for crop health and document auditing</p>
                </div>
                <div className="type-selector">
                    <button className={`type-btn ${category === 'CROP_HEALTH' ? 'active' : ''}`} onClick={() => setCategory('CROP_HEALTH')}>
                        <Zap size={14} className="me-2" /> Crop Health
                    </button>
                    <button className={`type-btn ${category === 'INVOICE_AUDIT' ? 'active' : ''}`} onClick={() => setCategory('INVOICE_AUDIT')}>
                        <FileText size={14} className="me-2" /> Audit Docs
                    </button>
                    <button className={`type-btn ${category === 'IOT_DIAGNOSTIC' ? 'active' : ''}`} onClick={() => setCategory('IOT_DIAGNOSTIC')}>
                        <AlertTriangle size={14} className="me-2" /> IoT Diagnostic
                    </button>
                </div>
            </div>

            <div className="vision-grid">
                <div className="upload-section">
                    <label className="upload-zone">
                        <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {loading && (
                                    <motion.div
                                        className="scanline"
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                <Upload className="text-slate-500 mb-3" size={48} />
                                <span className="fw-bold text-slate-400">Inject Visual Data</span>
                                <span className="small text-slate-500 mt-1">Accepts JPG, PNG, WEBP</span>
                            </>
                        )}
                    </label>
                    <button
                        className="btn btn-primary w-100 mt-4 py-3 fw-bold rounded-4 shadow-lg border-0"
                        disabled={!selectedImage || loading}
                        onClick={runAnalysis}
                        style={{ background: 'linear-gradient(45deg, #2563eb, #7c3aed)' }}
                    >
                        {loading ? 'Decrypting Visual Features...' : 'Execute Neural Scan'}
                    </button>
                </div>

                <div className="analysis-panel">
                    <div className="d-flex align-items-center gap-2 mb-3 text-slate-400 small fw-bold">
                        <Search size={14} /> AI PERSPECTIVE: {category.replace("_", " ")}
                    </div>

                    <AnimatePresence mode="wait">
                        {analysis ? (
                            <motion.div
                                key="analysis"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="analysis-content"
                            >
                                {analysis}
                                <div className="mt-4 pt-4 border-top border-slate-700 d-flex gap-3">
                                    <div className="d-flex align-items-center gap-2 text-success small">
                                        <ShieldCheck size={14} /> CERTIFIED_ANALYSIS
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-primary small">
                                        <Zap size={14} /> NO_THREAT_DETECTED
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-slate-500 text-center opacity-50">
                                <ImageIcon size={48} className="mb-3" />
                                <p className="small">Visual cortex idle.<br />Upload an image to start neural inference.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default NeuralVision;
