import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomeProjectsCarousel = ({ projects, currentDir }) => {
    const { t, i18n } = useTranslation();

    if (projects.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted fs-5">{t('no_projects_found', 'No projects found.')}</p>
            </div>
        );
    }

    const ProjectCard = ({ project }) => {
        const title = project.title?.[i18n.language] || project.title?.en || project.title;
        const desc = project.description?.[i18n.language] || project.description?.en || project.description;
        const progress = project.targetAmount > 0 ? (project.raisedAmount / project.targetAmount) * 100 : 0;

        return (
            <div className="project-card h-100">
                <img
                    className="project-img"
                    src={project.images && project.images.length > 0 ? project.images[0] : '/img/placeholder.png'}
                    alt={title}
                    style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                />
                <div className="project-body">
                    <h4 className="project-title">{title}</h4>
                    <p className="project-desc">{desc ? desc.substring(0, 100) + '...' : ''}</p>
                    <div className="fund-row">
                        <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                            <div className="bar" style={{ width: `${progress}%`, background: 'var(--accent-green)' }}></div>
                        </div>
                        <div className="project-meta">{Math.round(progress)}%</div>
                    </div>
                    <div className="project-cta mt-3">
                        <Link to={`/projects/${project._id}`} className="fund-btn text-center text-decoration-none w-100" style={{ background: 'var(--gold-gradient)' }}>
                            {t('proj_view', 'View Project')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    if (projects.length <= 4) {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    {projects.map((project) => (
                        <div key={project._id} className="col-lg-3 col-md-6 mb-4">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const chunks = [];
    for (let i = 0; i < projects.length; i += 4) {
        chunks.push(projects.slice(i, i + 4));
    }

    return (
        <div className="carousel-fullwidth carousel-projects">
            <div id="farmCarousel" className="carousel slide" data-bs-ride="false">
                <div className="carousel-inner">
                    {chunks.map((chunk, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <div className="slide-row d-flex justify-content-center gap-3 px-2">
                                {chunk.map((project) => (
                                    <div key={project._id} className="card-col" style={{ flex: '0 0 23%', maxWidth: '300px' }}>
                                        <ProjectCard project={project} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#farmCarousel" data-bs-slide="prev">
                    <span className="arrow" aria-hidden="true" style={{ background: 'var(--bg-white)', color: 'var(--text-main)', borderRadius: '50%', padding: '10px' }}><i className="fa-solid fa-chevron-left"></i></span>
                    <span className="visually-hidden">{t('prev', 'Previous')}</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#farmCarousel" data-bs-slide="next">
                    <span className="arrow" aria-hidden="true" style={{ background: 'var(--bg-white)', color: 'var(--text-main)', borderRadius: '50%', padding: '10px' }}><i className="fa-solid fa-chevron-right"></i></span>
                    <span className="visually-hidden">{t('next', 'Next')}</span>
                </button>
            </div>
        </div>
    );
};

export default HomeProjectsCarousel;
