import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const ServiceEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');

    const isEdit = id !== 'new';

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                const { data } = await axios.get(`/api/content/services/${id}`);
                setTitle(data.title);
                setDescription(data.description);
                setImage(data.image);
                setPrice(data.price || '');
            };
            fetchData();
        }
    }, [id, isEdit]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const payload = { title, description, image, price: Number(price) };

        try {
            if (isEdit) {
                await axios.put(`/api/content/services/${id}`, payload, config);
            } else {
                await axios.post('/api/content/services', payload, config);
            }
            navigate('/admin'); // Redirect to admin dashboard or services list
        } catch (error) {
            alert('Error saving service');
        }
    };

    return (
        <div className="container section">
            <h1>{isEdit ? t('edit_service', 'Edit Service') : t('create_service', 'Create Service')}</h1>
            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label className="form-label">{t('title', 'Title')}</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('image_url', 'Image URL')}</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('price', 'Price (MAD)')}</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('description', 'Description')}</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows="5" required></textarea>
                </div>
                <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">{t('save', 'Save')}</button>
                    <Link to="/admin" className="btn btn-secondary">
                        {t('back_to_dashboard', 'Back to Dashboard')}
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ServiceEditPage;
