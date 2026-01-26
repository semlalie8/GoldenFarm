import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { recordActivity } from '../utils/activityTracker';

const VideoDetailsPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const { data } = await axios.get(`/api/content/videos/${id}`);
                setVideo(data);

                if (userInfo) {
                    recordActivity('watch_video', id, 'Video', `Watched video: ${data.title}`, userInfo.token);
                }
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        };
        fetchVideo();
    }, [id, userInfo]);

    if (!video) return <div>Loading...</div>;

    return (
        <div className="video-details-page min-vh-100 bg-light py-5">
            <div className="container">
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">{t('home', 'Home')}</Link></li>
                        <li className="breadcrumb-item"><Link to="/videos" className="text-decoration-none text-muted">{t('knowledge_center', 'Knowledge Center')}</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{video.title?.[i18n.language] || video.title?.en || video.title}</li>
                    </ol>
                </nav>

                <div className="row g-4 justify-content-center">
                    <div className="col-lg-10">
                        {/* Video Player Section */}
                        <div className="bg-dark rounded-4 shadow-lg overflow-hidden mb-4 p-2 p-md-3">
                            <div className="ratio ratio-16x9">
                                <iframe
                                    src={video.videoUrl}
                                    title={video.title?.[i18n.language] || video.title?.en || video.title}
                                    allowFullScreen
                                    className="rounded-3"
                                ></iframe>
                            </div>
                        </div>

                        {/* Video Info Section */}
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div>
                                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 mb-3 text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                                        {video.category || t('educational_video', 'Educational Video')}
                                    </span>
                                    <h1 className="h2 fw-bold text-dark mb-0">
                                        {video.title?.[i18n.language] || video.title?.en || video.title}
                                    </h1>
                                </div>
                                <div className="text-end">
                                    {video.isFree ? (
                                        <Badge bg="success" className="px-3 py-2 rounded-pill fw-bold text-uppercase">{t('free_access', 'Free Access')}</Badge>
                                    ) : (
                                        <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold text-uppercase">{t('premium_course', 'Premium Content')}</Badge>
                                    )}
                                </div>
                            </div>

                            <hr className="my-4 text-muted opacity-25" />

                            <div className="description">
                                <h3 className="h6 fw-bold text-muted text-uppercase mb-3 ls-wider" style={{ letterSpacing: '0.1em' }}>
                                    {t('course_briefing', 'Course Briefing')}
                                </h3>
                                <p className="text-muted fs-5 leading-relaxed" style={{ lineHeight: '1.8' }}>
                                    {video.description?.[i18n.language] || video.description?.en || video.description}
                                </p>
                            </div>

                            <div className="d-flex gap-3 mt-5">
                                <Link to="/videos" className="btn btn-outline-secondary rounded-pill px-4">
                                    {t('back_to_courses', 'Explore All Courses')}
                                </Link>
                                {!video.isFree && (
                                    <button className="btn btn-primary rounded-pill px-4" style={{ backgroundColor: '#cba135', borderColor: '#cba135' }}>
                                        {t('enroll_now', 'Unlock Certificate')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoDetailsPage;
