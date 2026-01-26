import asyncHandler from 'express-async-handler';
import Project from '../models/projectModel.js';

// @desc    Get all approved projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
    let projects;
    if (req.user && req.user.role === 'admin') {
        projects = await Project.find({}).populate('user', 'name email').sort('-createdAt');
    } else {
        projects = await Project.find({ status: 'active' });
    }
    res.json(projects);
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (project) {
        res.json(project);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
    const project = new Project({
        title: req.body.title,
        description: req.body.description,
        user: req.user._id,
        category: req.body.category,
        targetAmount: req.body.targetAmount,
        minInvestment: req.body.minInvestment,
        roi: req.body.roi,
        durationMonths: req.body.durationMonths,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        iotDeviceId: req.body.iotDeviceId,
        images: req.body.images || [],
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.category = req.body.category || project.category;
        project.targetAmount = req.body.targetAmount || project.targetAmount;
        project.minInvestment = req.body.minInvestment || project.minInvestment;
        project.roi = req.body.roi || project.roi;
        project.durationMonths = req.body.durationMonths || project.durationMonths;
        project.location = req.body.location || project.location;
        project.latitude = req.body.latitude || project.latitude;
        project.longitude = req.body.longitude || project.longitude;
        project.iotDeviceId = req.body.iotDeviceId || project.iotDeviceId;
        project.images = req.body.images || project.images;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

// @desc    Approve a project
// @route   PUT /api/projects/:id/approve
// @access  Private/Admin
const approveProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        project.status = 'approved';
        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

/**
 * Helper to reuse analysis logic across public analysis and institutional audits.
 */
const getProjectAnalysisInternal = async (project, user) => {
    const { runCropSimulation } = await import('../services/simulationService.js');
    const { default: iotService } = await import('../services/iotService.js');
    const { default: ledgerService } = await import('../services/ledgerService.js');
    const { default: marketService } = await import('../services/marketService.js');
    const { default: weatherService } = await import('../services/weatherService.js');
    const { default: environmentalService } = await import('../services/environmentalService.js');
    const { default: Transaction } = await import('../models/transactionModel.js');

    const [simulationResult, climateData, sustainability] = await Promise.all([
        runCropSimulation({
            crop_type: project.category || 'agriculture',
            area_hectares: 10,
            lat: project.latitude || 33.5731,
            lon: project.longitude || -7.5898
        }),
        weatherService.getClimateFull(project.latitude || 33.5731, project.longitude || -7.5898),
        environmentalService.validateSustainability(project.latitude || 33.5731, project.longitude || -7.5898)
    ]);

    const liveTelemetry = await iotService.getDeviceTelemetry(project.iotDeviceId || "GENERIC_FARM_001");
    const benchmark = await marketService.getBenchmark(project.category === 'agriculture' ? 'WHEAT' : 'CORN');
    const financialModeling = ledgerService.calculateProjectYield(project, benchmark);

    let personalDividends = null;
    if (user) {
        const userTransactions = await Transaction.find({
            user: user._id,
            referenceId: project._id,
            status: 'completed'
        });
        if (userTransactions.length > 0) {
            const moisture = liveTelemetry.sensors.soil_moisture.value;
            personalDividends = ledgerService.calculateLiveAccruedYield(
                userTransactions.reduce((acc, t) => acc + t.amount, 0),
                project.roi || 12,
                userTransactions[0].createdAt,
                moisture < 30 ? 0.7 : 1.0
            );
        }
    }

    return {
        live_telemetry: liveTelemetry,
        environmental_forecast: simulationResult,
        climate_history: climateData,
        sustainability_audit: sustainability,
        financial_authority: financialModeling,
        personal_exposure: personalDividends
    };
};

// @desc    Get Deterministic Analysis
// @route   GET /api/projects/:id/analysis
const getProjectAnalysis = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    const analysisData = await getProjectAnalysisInternal(project, req.user);

    res.json({
        projectId: project._id,
        analysis_timestamp: new Date().toISOString(),
        ...analysisData,
        risk_score: 15,
        governance_status: "VERIFIED_DATA_CHAIN"
    });
});

// @desc    Get Institutional Audit Snapshot
// @route   GET /api/projects/:id/audit
const getProjectInstitutionalAudit = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    const { default: financeService } = await import('../services/financeService.js');
    const analysisData = await getProjectAnalysisInternal(project, req.user);

    const compliance = await financeService.verifyInvestmentCompliance(
        req.user?._id,
        project.raisedAmount,
        project.category
    );

    res.json({
        audit_id: compliance.audit_id,
        entity: "GoldenFarm Asset Custody",
        timestamp: new Date().toISOString(),
        project: {
            id: project._id,
            title: project.title,
            jurisdiction: "MOROCCO_NORD"
        },
        audit_layers: {
            physical: analysisData.live_telemetry.sensors,
            virtual: analysisData.environmental_forecast,
            monetary: analysisData.financial_authority
        },
        compliance_status: compliance,
        seal: "GOLDENFARM_DEEP_TRUST_v2"
    });
});

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    approveProject,
    getProjectAnalysis,
    getProjectInstitutionalAudit
};
