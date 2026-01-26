import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MultilingualInput from '../components/MultilingualInput';

const BookEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const { t } = useTranslation();

    const [title, setTitle] = useState({ en: '', fr: '', ar: '' });
    const [description, setDescription] = useState({ en: '', fr: '', ar: '' });
    const [author, setAuthor] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');

    const isEdit = id !== 'new';

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                const { data } = await axios.get(`/api/content/books/${id}`);
                setTitle(typeof data.title === 'string' ? { en: data.title, fr: '', ar: '' } : data.title);
                setDescription(typeof data.description === 'string' ? { en: data.description, fr: '', ar: '' } : data.description);
                setAuthor(data.author);
                setCoverImage(data.coverImage);
                setDownloadUrl(data.downloadUrl);
            };
            fetchData();
        }
    }, [id, isEdit]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        try {
            const bookData = { title, description, author, coverImage, downloadUrl };
            if (isEdit) {
                await axios.put(`/api/content/books/${id}`, bookData, config);
            } else {
                await axios.post('/api/content/books', bookData, config);
            }
            navigate('/admin/books');
        } catch (error) {
            alert('Error saving book');
        }
    };

    return (
        <div className="container section">
            <h1>{isEdit ? 'Edit Book' : 'Add Book'}</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" required />
                </div>
                <div className="form-group">
                    <label>Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Cover Image URL</label>
                    <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Download URL</label>
                    <input type="text" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows="5" required></textarea>
                </div>
                <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">Save</button>
                    <Link to="/admin/books" className="btn btn-secondary">
                        Back to Dashboard
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default BookEditPage;
