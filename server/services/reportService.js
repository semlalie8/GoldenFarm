import crypto from 'crypto';
import Report from '../models/reportModel.js';
import Project from '../models/projectModel.js';
import marketService from './marketService.js';
import { getToolDefinitions } from './toolRegistry.js';

/**
 * ReportService handles the generation of authenticated institutional documents.
 */
class ReportService {
    /**
     * Generates a structural snapshot and signs it.
     */
    async generateInstitutionalSnapshot(userId, projectId = null) {
        let projectData = null;
        if (projectId) {
            projectData = await Project.findById(projectId).populate('owner', 'name email');
        }

        const market = await marketService.getMarketSentiment();
        const tools = getToolDefinitions();

        // 1. Compile the 'Neural Grounding' data
        const snapshot = {
            timestamp: new Date().toISOString(),
            system_version: "Oracle-V6-Stable",
            environment: {
                market_sentiment: market.trend,
                volatility: market.volatility,
            },
            project_context: projectData ? {
                id: projectData._id,
                title: projectData.title,
                status: projectData.status,
                risk_level: projectData.riskLevel || 'MEDIUM'
            } : 'GLOBAL_SCOPE',
            capability_matrix: tools.length
        };

        // 2. Generate the Cryptographic Seal (Proof of Intelligence)
        const sealSource = JSON.stringify(snapshot) + process.env.JWT_SECRET;
        const sealHash = crypto.createHash('sha256').update(sealSource).digest('hex');

        // 3. Persist the report record
        const report = await Report.create({
            reportId: `GF-ORACLE-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: projectData ? `Institutional Audit: ${projectData.title}` : "Global Network Stability Report",
            type: projectData ? 'Project_Audit' : 'Institutional',
            generatedBy: userId,
            projectId: projectId,
            dataSnapshot: snapshot,
            sealHash: sealHash
        });

        return report;
    }

    async getRecentReports(filter = {}) {
        return await Report.find(filter)
            .populate('generatedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);
    }
}

export default new ReportService();
