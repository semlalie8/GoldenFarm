import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MultilingualInput from '../components/MultilingualInput';

const VideoEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const { t } = useTranslation();

    const [title, setTitle] = useState({ en: '', fr: '', ar: '' });
    const [description, setDescription] = useState({ en: '', fr: '', ar: '' });
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnail, setThumbnail] = useState('');

    const isEdit = id !== 'new';

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                const { data } = await axios.get(`/api/content/videos/${id}`);
                setTitle(typeof data.title === 'string' ? { en: data.title, fr: '', ar: '' } : data.title);
                setDescription(typeof data.description === 'string' ? { en: data.description, fr: '', ar: '' } : data.description);
                setVideoUrl(data.videoUrl);
                setThumbnail(data.thumbnail);
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
            const videoData = { title, description, videoUrl, thumbnail };
            if (isEdit) {
                await axios.put(`/api/content/videos/${id}`, videoData, config);
            } else {
                await axios.post('/api/content/videos', videoData, config);
            }
            navigate('/admin/videos');
        } catch (error) {
            alert('Error saving video');
        }
    };

    return (
        <div className="container section">
            <h1>{isEdit ? 'Edit Video' : 'Add Video'}</h1>
            <form onSubmit={submitHandler}>
                <MultilingualInput
                    label={t('title', 'Title')}
                    value={title}
                    onChange={setTitle}
                    required
                />
                <div className="form-group">
                    <label>Video URL (Embed/Source)</label>
                    <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="form-control" required />
                </div>
                <div className="form-group">
                    <label>Thumbnail URL</label>
                    <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="form-control" />
                </div>
                <MultilingualInput
                    label={t('description', 'Description')}
                    value={description}
                    onChange={setDescription}
                    required
                    isTextarea
                />
                <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">Save</button>
                    <Link to="/admin/videos" className="btn btn-secondary">
                        Back to Dashboard
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default VideoEditPage;
