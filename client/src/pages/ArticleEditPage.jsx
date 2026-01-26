import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MultilingualInput from '../components/MultilingualInput';
import '../styles/article-editor.css';

const ArticleEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { t } = useTranslation();

    const [title, setTitle] = useState({ en: '', fr: '', ar: '' });
    const [content, setContent] = useState({ en: '', fr: '', ar: '' });
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);

    const isEdit = id !== 'new';

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                const { data } = await axios.get(`/api/content/articles/${id}`);
                setTitle(typeof data.title === 'string' ? { en: data.title, fr: '', ar: '' } : data.title);
                setContent(typeof data.content === 'string' ? { en: data.content, fr: '', ar: '' } : data.content);
                setImage(data.image);
            };
            fetchData();
        }
    }, [id, isEdit]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validate that at least English title and content are provided
        if (!title.en || !title.en.trim()) {
            alert(t('error_title_required', 'English title is required'));
            return;
        }

        if (!content.en || !content.en.trim()) {
            alert(t('error_content_required', 'English content is required'));
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const payload = {
            title,
            content,
            image,
            author: userInfo.name
        };

        console.log('Submitting article:', payload);

        try {
            if (isEdit) {
                const response = await axios.put(`/api/content/articles/${id}`, payload, config);
                console.log('Article updated:', response.data);
            } else {
                const response = await axios.post('/api/content/articles', payload, config);
                console.log('Article created:', response.data);
            }
            navigate('/admin/articles');
        } catch (error) {
            console.error('Error saving article:', error);
            console.error('Error response:', error.response?.data);
            alert(`Error saving article: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="editor-container">
            <h1 className="editor-title">{isEdit ? t('edit_article', 'Edit Article') : t('create_article', 'Create Article')}</h1>

            <form onSubmit={submitHandler}>
                <MultilingualInput
                    label={t('article_title', 'Article Title')}
                    value={title}
                    onChange={setTitle}
                    required
                />

                <div className="mb-4 text-center">
                    <label htmlFor="image-upload" className="upload-label">
                        📸 {uploading ? t('uploading', 'Uploading...') : t('upload_cover_image', 'Upload Cover Image')}
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        className="image-upload-input"
                        onChange={uploadFileHandler}
                        accept="image/*"
                    />
                    {image && (
                        <div className="mt-2">
                            <img src={image} alt="Cover" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px' }} />
                        </div>
                    )}
                </div>

                <MultilingualInput
                    label={t('article_content', 'Article Content')}
                    value={content}
                    onChange={setContent}
                    required
                    isTextarea
                />


                <button
                    type="submit"
                    className="publish-btn"
                    onClick={(e) => {
                        console.log('Button clicked!');
                        console.log('Title:', title);
                        console.log('Content:', content);
                    }}
                >
                    ✍️ {isEdit ? t('update_article', 'Update Article') : t('publish_article', 'Publish Article')}
                </button>

            </form>
        </div>
    );
};

export default ArticleEditPage;
