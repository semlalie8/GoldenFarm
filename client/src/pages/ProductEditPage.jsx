import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MultilingualInput from '../components/MultilingualInput';

const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { t } = useTranslation();

    const [name, setName] = useState({ en: '', fr: '', ar: '' });
    const [description, setDescription] = useState({ en: '', fr: '', ar: '' });
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [stock, setStock] = useState('');

    const isEdit = id !== 'new';

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                const { data } = await axios.get(`/api/products/${id}`);
                setName(typeof data.name === 'string' ? { en: data.name, fr: '', ar: '' } : data.name);
                setDescription(typeof data.description === 'string' ? { en: data.description, fr: '', ar: '' } : data.description);
                setPrice(data.price);
                setCategory(data.category);
                setImage(data.image);
                setStock(data.stock);
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
            name,
            description,
            price: Number(price),
            category,
            image,
            stock: Number(stock)
        };

        try {
            if (isEdit) {
                await axios.put(`/api/products/${id}`, payload, config);
            } else {
                await axios.post('/api/products', payload, config);
            }
            navigate('/admin/products');
        } catch (error) {
            alert('Error saving product');
        }
    };

    return (
        <div className="container section">
            <h1>{isEdit ? t('edit_product', 'Edit Product') : t('create_product', 'Create New Product')}</h1>
            <form onSubmit={submitHandler}>
                <MultilingualInput
                    label={t('product_name', 'Product Name')}
                    value={name}
                    onChange={setName}
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
                        <label className="form-label">{t('price', 'Price (MAD)')}</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">{t('stock', 'Stock Count')}</label>
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="form-control" required />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('category', 'Category')}</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('image_url', 'Image URL')}</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="form-control" />
                </div>
                <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">{t('save', 'Save Product')}</button>
                    <Link to="/admin/products" className="btn btn-secondary">
                        {t('back_to_dashboard', 'Back to Dashboard')}
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ProductEditPage;
