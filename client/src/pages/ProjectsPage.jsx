import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ProjectsPage = () => {
    const { t, i18n } = useTranslation();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await axios.get('/api/projects');
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    return (
        <div dir={currentDir}>
            {/* PAGE HEADER */}
            <section className="funding-header">
                <h1 data-translate="funding_projects_title">{t('funding_projects_title', 'Funding Projects')}</h1>
                <p data-translate="funding_projects_sub">
                    {t('funding_projects_sub', 'Support real Moroccan rural families building sustainable livestock livelihoods.')}
                </p>
            </section>

            {/* PROJECT GRID */}
            <div className="projects-wrapper">
                <div className="row g-4 justify-content-center">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project._id} className="col-md-6 col-lg-3 col-xl-3 col-xxl-3 d-flex">
                                <div className="project-card w-100">
                                    <img
                                        src={project.images && project.images.length > 0 ? project.images[0] : '/img/goat.png'}
                                        alt={project.title}
                                    />
                                    <div className="p-3">
                                        <h5>{project.title?.[i18n.language] || project.title?.en || project.title}</h5>
                                        <p>{(() => {
                                            const desc = project.description?.[i18n.language] || project.description?.en || project.description;
                                            return desc ? desc.substring(0, 100) + '...' : '';
                                        })()}</p>

                                    </div>
                                    <div className="p-3 pt-0">
                                        <Link to={`/projects/${project._id}`} className="sap-premium-btn w-100 text-center text-decoration-none">
                                            {t('view_project_btn', 'View Project')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center">
                            <p>{t('no_projects_found', 'No projects found.')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;
