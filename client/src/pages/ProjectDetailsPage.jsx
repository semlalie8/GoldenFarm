import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { recordActivity } from '../utils/activityTracker';
import { Badge } from 'react-bootstrap';
import SEO from '../components/SEO';
import TrustWidget from '../components/TrustWidget';
import IntelligenceManifesto from '../components/IntelligenceManifesto';

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [project, setProject] = useState(null);
    const [amount, setAmount] = useState(100);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/projects/${id}`);
                setProject(data);

                if (userInfo) {
                    recordActivity('view_project', id, 'Project', `Viewed project: ${data.title}`, userInfo.token);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching project:', error);
                setError(error.response?.data?.message || 'Project not found');
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, userInfo]);

    useEffect(() => {
        if (project && amount === 100) {
            setAmount(project.minInvestment || 100);
        }
    }, [project]);

    const handleInvest = async () => {
        if (!userInfo) {
            navigate(`/login?redirect=/projects/${id}`);
            return;
        }

        const investmentAmount = Number(amount);
        if (isNaN(investmentAmount) || investmentAmount <= 0) {
            alert(t('invalid_amount', 'Please enter a valid amount'));
            return;
        }

        if (investmentAmount < (project.minInvestment || 0)) {
            alert(t('min_investment_error', `Minimum investment is ${project.minInvestment} DH`));
            return;
        }

        // Navigate to dedicated investment page
        navigate(`/projects/${id}/invest?amount=${investmentAmount}`);
    };

    if (loading) return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
            <div className="spinner-border text-primary mb-4" role="status"></div>
            <div className="h4 fw-bold text-uppercase ls-wider animate-pulse">Synchronizing Project Data...</div>
        </div>
    );

    if (error || !project) return (
        <div className="container mt-5 pt-5 text-center">
            <div className="alert alert-danger shadow-sm py-4">
                <h4 className="fw-bold mb-3">CONSOLIDATION ERROR</h4>
                <p className="mb-0">{error || 'Project not found'}</p>
                <Link to="/marketplace" className="btn btn-outline-danger mt-3 rounded-pill px-4">Return to Fleet</Link>
            </div>
        </div>
    );

    const projectSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": project.title?.en || project.title,
        "description": project.description?.en || project.description,
        "image": project.images[0],
        "offers": {
            "@type": "Offer",
            "priceCurrency": "MAD",
            "price": project.minInvestment,
            "availability": "https://schema.org/InStock"
        }
    };
    const fundingPercentage = project.targetAmount > 0
        ? Math.min(Math.round((project.raisedAmount / project.targetAmount) * 100), 100)
        : 0;

    return (
        <main className="bg-light min-vh-100 pb-5">
            <SEO
                title={`${project.title?.en || project.title} | Golden Farm`}
                description={project.description?.en || project.description}
                schema={projectSchema}
            />

            <div className="container-fluid pt-4 px-md-5">
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb ms-md-4">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted small fw-bold text-uppercase">Strategic Hub</Link></li>
                        <li className="breadcrumb-item"><Link to="/marketplace" className="text-decoration-none text-muted small fw-bold text-uppercase">Assets</Link></li>
                        <li className="breadcrumb-item active small fw-bold text-uppercase" aria-current="page">{project.title?.en || project.title}</li>
                    </ol>
                </nav>

                {/* TOP HEADER: Horizontal Asset Acquisition Bar (90% Width) */}
                <div className="row justify-content-center mb-5">
                    <div className="col-11">
                        <div className="card border-0 shadow-lg rounded-5 overflow-hidden" style={{ background: '#0f172a' }}>
                            <div className="card-body p-4 p-md-5">
                                <div className="row align-items-center">
                                    {/* Financial Core Stats */}
                                    <div className="col-xl-6 border-end border-secondary border-opacity-10 pe-xl-5">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h2 className="h4 fw-black text-white text-uppercase m-0 ls-wide">Asset Acquisition</h2>
                                            <Badge bg={fundingPercentage >= 100 ? "info" : "success"} className="rounded-pill px-3 py-2 fw-black">
                                                {fundingPercentage}% FUNDED
                                            </Badge>
                                        </div>

                                        <div className="progress bg-secondary bg-opacity-10 rounded-pill mb-4" style={{ height: '8px' }}>
                                            <div
                                                className="progress-bar rounded-pill"
                                                style={{
                                                    width: `${fundingPercentage}%`,
                                                    background: '#2563eb',
                                                    boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)'
                                                }}
                                            />
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-6">
                                                <span className="text-secondary small fw-bold text-uppercase d-block opacity-75 mb-1">RAISED</span>
                                                <span className="h2 fw-black text-white">{project.raisedAmount.toLocaleString()} <small className="h6 text-secondary opacity-50">DH</small></span>
                                            </div>
                                            <div className="col-6 text-end">
                                                <span className="text-secondary small fw-bold text-uppercase d-block opacity-75 mb-1">TARGET</span>
                                                <span className="h4 fw-bold text-secondary opacity-50">{project.targetAmount.toLocaleString()} <small className="small">DH</small></span>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-wrap gap-2 mt-4">
                                            <div className="flex-fill p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5 text-center min-width-0" style={{ flex: '1 1 0' }}>
                                                <span className="text-secondary small fw-bold text-uppercase d-block opacity-50 mb-1" style={{ fontSize: '10px' }}>FIXED ROI</span>
                                                <span className="text-info fw-black">{project.roi}%</span>
                                            </div>
                                            <div className="flex-fill p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5 text-center min-width-0" style={{ flex: '1 1 0' }}>
                                                <span className="text-secondary small fw-bold text-uppercase d-block opacity-50 mb-1" style={{ fontSize: '10px' }}>BACKERS</span>
                                                <span className="text-info fw-black">{project.backerCount || 0}</span>
                                            </div>
                                            <div className="flex-fill p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5 text-center min-width-0" style={{ flex: '1 1 0' }}>
                                                <span className="text-secondary small fw-bold text-uppercase d-block opacity-50 mb-1" style={{ fontSize: '10px' }}>LOCATION</span>
                                                <span className="text-info fw-black text-uppercase small">{project.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Execution & Stake Confirmation */}
                                    <div className="col-xl-6 ps-xl-5 mt-4 mt-xl-0">
                                        <div className="bg-white rounded-5 p-4 shadow-sm">
                                            <div className="row align-items-center">
                                                <div className="col-md-7 border-end-md pe-md-4">
                                                    <p className="small fw-bold text-muted text-uppercase mb-2 ls-1">STAKE CONFIRMATION</p>
                                                    <div className="d-flex align-items-center">
                                                        <input
                                                            type="number"
                                                            value={amount}
                                                            onChange={(e) => setAmount(e.target.value)}
                                                            min={project.minInvestment}
                                                            className="form-control form-control-lg bg-transparent text-dark fw-black border-0 p-0"
                                                            style={{ fontSize: '2.5rem', boxShadow: 'none', width: '150px' }}
                                                        />
                                                        <span className="h4 fw-black text-muted mb-0 ms-2 opacity-50">DH</span>
                                                    </div>
                                                    <div className="d-flex align-items-center mt-2">
                                                        <div className="rounded-circle bg-success shadow-sm me-2" style={{ width: '6px', height: '6px' }}></div>
                                                        <span className="text-dark fw-bold text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>COMPLIANT & AUDIT-READY</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-5 ps-md-4 mt-3 mt-md-0">
                                                    <button
                                                        onClick={handleInvest}
                                                        className="sap-premium-btn w-100 py-4"
                                                    >
                                                        EXECUTE ASSET INVEST
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Main Content: Narrative & Data (90% Width) */}
                    <div className="col-11 mx-auto">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                            <div className="position-relative" style={{ height: '600px' }}>
                                <img
                                    src={project.images?.[0] || '/img/placeholder_project.png'}
                                    alt={project.title?.en || project.title}
                                    className="w-100 h-100 object-fit-cover shadow-inner"
                                />
                                <div className="position-absolute top-0 start-0 m-4">
                                    <Badge bg="dark" className="px-3 py-2 text-uppercase ls-1">
                                        {project.category}
                                    </Badge>
                                </div>
                            </div>
                            <div className="card-body p-4 p-md-5 bg-white">
                                <h1 className="display-3 fw-black text-dark mb-4">{project.title?.en || project.title}</h1>
                                <p className="lead text-secondary opacity-75 mb-5 lh-lg fs-4" style={{ maxWidth: '1200px' }}>
                                    {project.description?.en || project.description}
                                </p>

                                <IntelligenceManifesto projectId={id} />
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white">
                            <h4 className="fw-black text-dark text-uppercase mb-4 ls-1">System Intelligence: Core Trust Widget</h4>
                            <TrustWidget projectId={id} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProjectDetailsPage;
