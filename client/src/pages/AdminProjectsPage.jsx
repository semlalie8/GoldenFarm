import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminProjectsPage = () => {
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('/api/projects', config);
                setProjects(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setLoading(false);
            }
        };

        fetchProjects();
    }, [userInfo]);

    const handleApprove = async (id) => {
        if (window.confirm(t('confirm_approve_project', 'Are you sure you want to approve this project?'))) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                await axios.put(`/api/projects/${id}/approve`, {}, config);
                // Refresh list
                setProjects(projects.map(p => p._id === id ? { ...p, status: 'approved' } : p));
            } catch (error) {
                console.error('Error approving project:', error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete_project', 'Are you sure you want to delete this project?'))) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                await axios.delete(`/api/projects/${id}`, config);
                setProjects(projects.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    return (
        <div className="dashboard-page" dir={currentDir}>
            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="dashboard-title">
                                {t('manage_projects', 'Manage Projects')}
                            </h1>
                            <p className="dashboard-subtitle">
                                {t('manage_projects_subtitle', 'Review, approve, and manage all platform projects')}
                            </p>
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
                        <i className={`fas fa-list ${currentDir === 'rtl' ? 'ms-2' : 'me-2'}`}></i>
                        {t('project_list', 'Project List')}
                    </h2>
                    <Link to="/projects/new" className="btn btn-warning text-white">
                        <i className="fas fa-plus me-2"></i>
                        {t('add_new_project', 'Add New Project')}
                    </Link>
                </div>

                <div className="transactions-card">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table transaction-table">
                                <thead>
                                    <tr>
                                        <th>{t('project_title', 'Title')}</th>
                                        <th>{t('project_creator', 'Creator')}</th>
                                        <th>{t('project_goal', 'Goal')}</th>
                                        <th>{t('completion', 'Completion')}</th>
                                        <th>{t('project_status', 'Status')}</th>
                                        <th>{t('actions', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {project.images && project.images[0] && (
                                                        <img
                                                            src={project.images[0]}
                                                            alt={project.title?.en || project.title}
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }}
                                                            onError={(e) => { e.target.src = '/img/placeholder.png'; }}
                                                        />
                                                    )}
                                                    <span className="fw-bold">{project.title?.[i18n.language] || project.title?.en || project.title}</span>
                                                </div>
                                            </td>
                                            <td>{project.user?.name || 'Unknown'}</td>
                                            <td>{project.targetAmount?.toLocaleString()} MAD</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <span className="me-2">{Math.round((project.raisedAmount / project.targetAmount) * 100)}%</span>
                                                    <div className="progress flex-grow-1" style={{ height: '5px', width: '50px' }}>
                                                        <div className="progress-bar bg-success" style={{ width: `${Math.min(100, (project.raisedAmount / project.targetAmount) * 100)}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${project.status?.toLowerCase() || 'pending'}`}>
                                                    {project.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    {project.status !== 'approved' && (
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handleApprove(project._id)}
                                                            title={t('approve', 'Approve')}
                                                        >
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                    )}
                                                    <Link to={`/projects/${project._id}`} className="btn btn-sm btn-info text-white" title={t('view', 'View')}>
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    <Link to={`/projects/edit/${project._id}`} className="btn btn-sm btn-warning text-white" title={t('edit', 'Edit')}>
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(project._id)}
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
                            <i className="fas fa-folder-open fa-3x"></i>
                            <h3>{t('no_projects_found', 'No projects found')}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProjectsPage;
