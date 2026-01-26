import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MultilingualInput from '../components/MultilingualInput';

const ProjectEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { t } = useTranslation();

    const [title, setTitle] = useState({ en: '', fr: '', ar: '' });
    const [description, setDescription] = useState({ en: '', fr: '', ar: '' });
    const [category, setCategory] = useState('agriculture');
    const [targetAmount, setTargetAmount] = useState('');
    const [minInvestment, setMinInvestment] = useState('');
    const [roi, setRoi] = useState('');
    const [durationMonths, setDurationMonths] = useState('');
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState(33.5731);
    const [longitude, setLongitude] = useState(-7.5898);
    const [iotDeviceId, setIotDeviceId] = useState('GENERIC_FARM_001');
    const [image, setImage] = useState('');

    const isEdit = id !== 'new';

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                const { data } = await axios.get(`/api/projects/${id}`);
                setTitle(typeof data.title === 'string' ? { en: data.title, fr: '', ar: '' } : data.title);
                setDescription(typeof data.description === 'string' ? { en: data.description, fr: '', ar: '' } : data.description);
                setCategory(data.category);
                setTargetAmount(data.targetAmount);
                setMinInvestment(data.minInvestment);
                setRoi(data.roi);
                setDurationMonths(data.durationMonths);
                setLocation(data.location);
                setLatitude(data.latitude || 33.5731);
                setLongitude(data.longitude || -7.5898);
                setIotDeviceId(data.iotDeviceId || 'GENERIC_FARM_001');
                setImage(data.images && data.images[0] ? data.images[0] : '');
            };
            fetchData();
        }
    }, [id, isEdit]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const payload = {
            title,
            description,
            category,
            targetAmount: Number(targetAmount),
            minInvestment: Number(minInvestment),
            roi: Number(roi),
            durationMonths: Number(durationMonths),
            location,
            latitude: Number(latitude),
            longitude: Number(longitude),
            iotDeviceId,
            images: [image]
        };

        try {
            if (isEdit) {
                await axios.put(`/api/projects/${id}`, payload, config);
            } else {
                await axios.post('/api/projects', payload, config);
            }
            navigate('/admin/projects');
        } catch (error) {
            alert('Error saving project');
        }
    };

    return (
        <div className="container section">
            <h1>{isEdit ? t('edit_project', 'Edit Project') : t('create_project', 'Create New Project')}</h1>
            <form onSubmit={submitHandler}>
                <MultilingualInput
                    label={t('title', 'Title')}
                    value={title}
                    onChange={setTitle}
                    required
                />
                <MultilingualInput
                    label={t('description', 'Description')}
                    value={description}
                    onChange={setDescription}
                    required
                    isTextarea
                />
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">{t('category', 'Category')}</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control">
                            <option value="agriculture">Agriculture</option>
                            <option value="livestock">Livestock</option>
                            <option value="equipment">Equipment</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">{t('location', 'Location')}</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="form-control" required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">{t('target_amount', 'Target Amount (MAD)')}</label>
                        <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">{t('min_investment', 'Min Investment (MAD)')}</label>
                        <input type="number" value={minInvestment} onChange={(e) => setMinInvestment(e.target.value)} className="form-control" required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">{t('roi', 'ROI (%)')}</label>
                        <input type="number" value={roi} onChange={(e) => setRoi(e.target.value)} className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">{t('duration', 'Duration (Months)')}</label>
                        <input type="number" value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)} className="form-control" required />
                    </div>
                </div>
                <div className="reality-grounding-section p-4 bg-slate-50 rounded-3xl border border-slate-200 mb-4">
                    <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Phase 2: Reality Grounding</h5>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">{t('latitude', 'Latitude')}</label>
                            <input type="number" step="0.0001" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="form-control" />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">{t('longitude', 'Longitude')}</label>
                            <input type="number" step="0.0001" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="form-control" />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">{t('iot_device_id', 'IoT Device ID')}</label>
                            <input type="text" value={iotDeviceId} onChange={(e) => setIotDeviceId(e.target.value)} className="form-control" placeholder="e.g. SMART_FARM_01" />
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">{t('image_url', 'Image URL')}</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="form-control" />
                </div>
                <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">{t('save', 'Save Project')}</button>
                    <Link to="/admin/projects" className="btn btn-secondary">
                        {t('back_to_dashboard', 'Back to Dashboard')}
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ProjectEditPage;
