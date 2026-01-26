import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const VideosPage = () => {
    const { t, i18n } = useTranslation();
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data } = await axios.get('/api/content/videos');
                setVideos(data);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };
        fetchVideos();
    }, []);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    return (
        <div dir={currentDir}>
            {/* PAGE HEADER */}
            <section className="funding-header">
                <h1 data-translate="video_courses_title">{t('video_courses_title', 'Video Courses')}</h1>
                <p data-translate="video_courses_sub">
                    {t('video_courses_sub', 'Watch practical, step-by-step video lessons guided by field experts and agricultural mentors.')}
                </p>
            </section>

            {/* PROJECTS WRAPPER */}
            <div className="projects-wrapper">
                <div className="row g-4 justify-content-center">
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <div key={video._id} className="col-md-6 col-lg-3 col-xl-3 col-xxl-3 d-flex">
                                <div className="project-card w-100">
                                    <img
                                        src={video.thumbnail || '/img/placeholder.png'}
                                        alt={video.title?.[i18n.language] || video.title?.en || video.title}
                                    />
                                    <div className="p-3">
                                        <h5>{video.title?.[i18n.language] || video.title?.en || video.title}</h5>
                                        <p>{(() => {
                                            const desc = video.description?.[i18n.language] || video.description?.en || video.description;
                                            return desc ? desc.substring(0, 100) + '...' : '';
                                        })()}</p>
                                        <a
                                            href={video.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="fund-btn text-center text-decoration-none"
                                        >
                                            {t('watch_course_btn', 'Watch Course')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center">
                            <p>{t('no_videos_found', 'No video courses found.')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideosPage;
