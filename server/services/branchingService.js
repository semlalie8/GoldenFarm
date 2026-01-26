import aiManager from './aiManager.js';
import Scenario from '../models/scenarioModel.js';
import Project from '../models/projectModel.js';
import { v4 as uuidv4 } from 'uuid';

class StrategicBranchingService {
    /**
     * Generates divergent strategic timelines for a project.
     */
    async generateDivergentTimelines(projectId, context = {}) {
        const project = await Project.findById(projectId);
        if (!project) throw new Error("Project not found");

        const batchId = `BRANCH-${uuidv4().substr(0, 8)}`;

        // Define the two divergent archetypes
        const archetypes = [
            {
                id: 'PROFIT_MAXIMIZATION',
                title: 'Aggressive Capital Expansion',
                focus: 'Maximizing immediate ROI and cash flow. Risk tolerance: HIGH.',
                tone: 'Aggressive, market-oriented, high-yield.'
            },
            {
                id: 'SUSTAINABILITY_RESILIENCE',
                title: 'Ecological Resilience Protocol',
                focus: 'Long-term soil health, water preservation, and bio-diversity. Risk tolerance: LOW.',
                tone: 'Conservative, environmental, stable.'
            }
        ];

        const scenarios = [];

        for (const arch of archetypes) {
            const prompt = `
                Generate a strategic management timeline for the project: "${project.title?.en || project.title}".
                
                STRATEGIC FOCUS: ${arch.focus}
                TONE: ${arch.tone}
                CONTEXT: ${JSON.stringify(context)}

                Provide a detailed narrative, risk score (1-10), financial impact, and sustainability impact.
                Also propose 3 specific actions for the agents (Agronomist, Futurist, Architect).

                RETURN ONLY VALID JSON:
                {
                    "narrative": "...",
                    "riskScore": 7,
                    "financialImpact": "+18% ROI",
                    "sustainabilityImpact": "-2% Resource Health",
                    "proposedActions": [
                        { "agent": "Agronomist", "action": "...", "params": {} },
                        { "agent": "Futurist", "action": "...", "params": {} },
                        { "agent": "Architect", "action": "...", "params": {} }
                    ]
                }
            `;

            const responseText = await aiManager.getCompletion({
                prompt,
                systemPrompt: "You are the GoldenFarm Deep Logic Engine. You specialize in generating divergent strategic simulations."
            });

            try {
                // Simplified cleaning for this context
                const cleaned = responseText.match(/\{[\s\S]*\}/)[0];
                const data = JSON.parse(cleaned);

                const scenario = await Scenario.create({
                    projectId,
                    batchId,
                    title: arch.title,
                    narrative: data.narrative,
                    riskScore: data.riskScore,
                    financialImpact: data.financialImpact,
                    sustainabilityImpact: data.sustainabilityImpact,
                    proposedActions: data.proposedActions,
                    generatedBy: { name: 'Neural Core', version: 'Phase 10-Deep-Logic' }
                });

                scenarios.push(scenario);
            } catch (err) {
                console.error(`Failed to generate scenario for ${arch.id}`, err);
            }
        }

        return { batchId, scenarios };
    }

    async authorizeTimeline(scenarioId, userId) {
        const scenario = await Scenario.findById(scenarioId);
        if (!scenario) throw new Error("Scenario not found");

        // Archive other scenarios in the same batch
        await Scenario.updateMany(
            { batchId: scenario.batchId, _id: { $ne: scenarioId } },
            { status: 'archived' }
        );

        scenario.status = 'authorized';
        await scenario.save();

        return scenario;
    }
}

export default new StrategicBranchingService();
