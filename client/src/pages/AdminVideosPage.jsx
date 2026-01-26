import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminVideosPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data } = await axios.get('/api/content/videos');
                setVideos(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching videos:', error);
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete_video', 'Are you sure you want to delete this video?'))) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                await axios.delete(`/api/content/videos/${id}`, config);
                setVideos(videos.filter(v => v._id !== id));
            } catch (error) {
                console.error('Error deleting video:', error);
            }
        }
    };

    return (
        <div className="dashboard-page" dir={currentDir}>
            <div className="dashboard-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="dashboard-title">{t('manage_videos', 'Manage Videos')}</h1>
                            <p className="dashboard-subtitle">{t('manage_videos_subtitle', 'Manage educational videos')}</p>
                        </div>
                        <div className="col-lg-4 text-end">
                            <Link to="/admin" className="btn btn-outline-light">
                                <i className={`fas fa-arrow-${currentDir === 'rtl' ? 'right' : 'left'} me-2`}></i>
                                {t('back_to_dashboard', 'Back to Dashboard')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container dashboard-content">
                <div className="card-header-custom mb-4">
                    <h2 className="section-title">
                        <i className={`fas fa-video ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                        {t('video_list', 'Video List')}
                    </h2>
                    <Link to="/videos/new" className="btn btn-warning text-white">
                        <i className="fas fa-plus me-2"></i>
                        {t('add_new_video', 'Add New Video')}
                    </Link>
                </div>

                <div className="transactions-card">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : videos.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table transaction-table">
                                <thead>
                                    <tr>
                                        <th>{t('video_title', 'Title')}</th>
                                        <th>{t('description', 'Description')}</th>
                                        <th>{t('actions', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videos.map((video) => (
                                        <tr key={video._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {video.thumbnail && (
                                                        <img
                                                            src={video.thumbnail}
                                                            alt={video.title?.en || video.title}
                                                            style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }}
                                                            onError={(e) => { e.target.src = '/img/placeholder.png'; }}
                                                        />
                                                    )}
                                                    <span className="fw-bold">{video.title?.[i18n.language] || video.title?.en || video.title}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {(() => {
                                                    const desc = video.description?.[i18n.language] || video.description?.en || video.description;
                                                    return typeof desc === 'string' ? desc.substring(0, 50) + '...' : '';
                                                })()}
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Link to={`/videos/edit/${video._id}`} className="btn btn-sm btn-warning text-white" title={t('edit', 'Edit')}>
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(video._id)}
                                                        title={t('delete', 'Delete')}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-film fa-3x"></i>
                            <h3>{t('no_videos_found', 'No videos found')}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminVideosPage;
