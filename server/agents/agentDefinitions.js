import aiManager from '../services/aiManager.js';
import AILog from '../models/aiLogModel.js';

/**
 * Base Agent class providing core functionality for specialized agents.
 */
class BaseAgent {
    constructor(config) {
        this.name = config.name;
        this.role = config.role;
        this.systemPromptTemplate = config.systemPromptTemplate;
        this.authorizedTools = config.authorizedTools || [];
        this.provider = config.provider || 'openai';
        this.model = config.model || 'gpt-4';
    }

    async runTask(task, context = {}) {
        const startTime = Date.now();
        let currentContext = { ...context };
        let history = [];
        const MAX_LOOPS = 3; // Prevent infinite loops

        console.log(`[Agent: ${this.name}] Executing task: ${task}`);

        try {
            for (let i = 0; i < MAX_LOOPS; i++) {
                // Build Prompt with History
                const fullSystemPrompt = this._buildPrompt(currentContext);
                let promptWithHistory = task;
                if (history.length > 0) {
                    promptWithHistory += `\n\nHistory of thoughts and actions:\n${history.join('\n')}`;
                }

                // Call LLM
                const response = await aiManager.getCompletion({
                    prompt: promptWithHistory,
                    systemPrompt: fullSystemPrompt,
                    model: this.model,
                    provider: this.provider
                });

                // --- DETERMINISTIC FALLBACK (Rule-Based Data Science) ---
                if (!response) {
                    console.warn(`[Agent: ${this.name}] LLM unavailable. Switching to Deterministic Data Science Engine.`);
                    const deterministicResult = this._runDeterministicEngine(task, currentContext);

                    await AILog.create({
                        agentName: this.name,
                        input: task,
                        output: deterministicResult,
                        latency: Date.now() - startTime,
                        metadata: { context, mode: "DETERMINISTIC_FALLBACK", reason: "LLM_OFFLINE" }
                    });

                    return {
                        agent: this.name,
                        role: this.role,
                        output: deterministicResult,
                        timestamp: new Date().toISOString(),
                        mode: "DETERMINISTIC_FALLBACK"
                    };
                }
                // --------------------------------------------------------

                // ROBUST TOOL PARSING: Try to find a JSON-like TOOL_CALL pattern
                const toolMatch = response.match(/TOOL_CALL:\s*(\w+)\s*\(([\s\S]*?)\)/);

                if (toolMatch) {
                    const toolName = toolMatch[1];
                    let paramsStr = toolMatch[2].trim();

                    console.log(`[Agent] Detected Tool Call: ${toolName}`);

                    let params = {};
                    try {
                        // Handle simple cases where LLM doesn't nested braces correctly
                        if (!paramsStr.startsWith('{')) paramsStr = '{' + paramsStr;
                        if (!paramsStr.endsWith('}')) paramsStr = paramsStr + '}';
                        params = JSON.parse(paramsStr);
                    } catch (e) {
                        console.warn(`[Agent] JSON Parse Failed for Tool: ${toolName}. Attempting regex recovery.`);
                        // Fallback for key-value extraction if JSON fails
                        const kvRegex = /"(\w+)":\s*"(.*?)"/g;
                        let m;
                        while ((m = kvRegex.exec(paramsStr)) !== null) {
                            params[m[1]] = m[2];
                        }
                    }

                    // Security: Verify tool is authorized
                    if (!this.authorizedTools.includes(toolName)) {
                        history.push(`AI Action Error: Attempted to use unauthorized tool '${toolName}'.`);
                        continue;
                    }

                    // EXECUTE TOOL
                    const { executeTool } = await import('../services/toolRegistry.js');
                    const toolResult = await executeTool(toolName, params);

                    // Add to History
                    history.push(`Thought: LLM wants to use ${toolName}. Result: ${JSON.stringify(toolResult)}`);
                    continue;

                } else {
                    // No tool call -> Final Answer
                    const latency = Date.now() - startTime;
                    await AILog.create({
                        agentName: this.name,
                        input: task,
                        output: response,
                        latency,
                        metadata: { context, model: this.model, provider: this.provider, history }
                    });

                    return {
                        agent: this.name,
                        role: this.role,
                        output: response,
                        timestamp: new Date().toISOString()
                    };
                }
            }

            throw new Error("Agent loop limit reached without final answer.");

        } catch (error) {
            console.error(`[Agent: ${this.name}] Error:`, error.message);
            await AILog.create({
                agentName: this.name,
                input: task,
                output: error.message,
                executionResult: 'failure',
                metadata: { error: error.stack }
            });
            throw error;
        }
    }

    _buildPrompt(context) {
        const SUPREME_PHILOSOPHY = `
*** SUPREME AXIOM: DATA-FIRST ARCHITECTURE ***
- YOU ARE A TRANSLATOR OF COMPLEXITY, NOT JUST AN ANALYST.
- CORE MISSION: Demystify the statistics. Explain *why* a number matters.
- DATA DECIDES: Use the provided 'platform_stats' and 'context' as absolute truth.
- METAPHOR & CLARITY: When explaining 'Standard Deviation' or 'Conversion Rates', use simple business analogies.
- EDUCATIONAL TONE: Treat the user as a smart executive who needs the "math translated into money".

If data is missing from the context, state: "[Data Layer Unavailable] - Deterministic calculation required."
*** END AXIOM ***
`;
        const TOOL_INSTRUCTIONS = `
SYSTEM PROTOCOL - STATISTICAL INTERFACE:
To perform data science tasks (Monte Carlo, Yield Prediction, Market Scanning), respond with:
TOOL_CALL: tool_name({ "key": "value" })

AVAILABLE TOOLS: ${this.authorizedTools.join(', ')}
`;
        let prompt = `ROLE: ${this.role}\n\n${SUPREME_PHILOSOPHY}\n\n${TOOL_INSTRUCTIONS}\n\nCORE OBJECTIVE: ${this.systemPromptTemplate}\n\n`;
        if (Object.keys(context).length > 0) {
            prompt += `DETERMINISTIC DATA (AUTHORITATIVE):\n${JSON.stringify(context, null, 2)}\n\n`;
        }
        return prompt;
    }

    /**
     * The "Always Running" Engine.
     * Uses pure logic and hard statistics to generate valid strategies when LLMs are offline.
     * NOW ENHANCED: Outputs detailed, educational explanations.
     */
    _runDeterministicEngine(task, context) {
        let strategy = `**[DATA-FIRST FALLBACK: ACTIVE]**\nAnalyzer: ${this.role}\nMode: Statistical Determinism & Education\n\n`;

        // 1. Analyze Core Metrics if available
        if (context.stats) {
            const { funnel, campaignsCount } = context.stats;
            const convRate = parseFloat(funnel?.conversionRate || 0);

            // Educational Header
            strategy += `### 📊 Statistical Performance Analysis\n`;
            strategy += `We assume a baseline "healthy" conversion rate of **3.5%** for this industry. Your current rate is **${convRate}%**.\n\n`;

            if (convRate < 2.5) {
                strategy += `#### 🚨 Signal: Low Efficiency Detected\n`;
                strategy += `**The Math:** Your conversion rate (${convRate}%) is statistically significant deviations below the mean (3.5%). This implies a "leaky bucket" in your funnel.\n`;
                strategy += `**Translation:** You are paying for traffic that isn't sticking. For every 100 visitors, you lose ~98. This erodes your ROI.\n\n`;
                strategy += `#### 💡 Strategic Prescription:\n`;
                strategy += `1.  **Reduce Variance:** Pause "Broad Match" ad campaigns immediately. They introduce too much noise (unqualified traffic).\n`;
                strategy += `2.  **Optimize the Variable:** Pivot to 'Retargeting'. Users who have already visited have a statistically higher probability of converting (often 2-3x).\n`;
            } else if (convRate > 5.0) {
                strategy += `#### 🚀 Signal: High-Performance Anomaly\n`;
                strategy += `**The Math:** Your rate (${convRate}%) is in the top 95th percentile. This is a positive outlier.\n`;
                strategy += `**Translation:** Your product resonates deeply with this specific audience. You have "Pricing Power" and "Scale Potential".\n\n`;
                strategy += `#### 💡 Strategic Prescription:\n`;
                strategy += `1.  **Exploit the Trend:** Increase ad spend by 20% immediately. The data suggests your funnel can absorb this volume without efficient loss.\n`;
                strategy += `2.  **Expand the Dataset:** Create 'Lookalike Audiences' based on your converters to find more people statistically similar to your best users.\n`;
            } else {
                strategy += `#### ⚖️ Signal: Nominal/Average Performance\n`;
                strategy += `**The Math:** You are operating within one standard deviation of the industry mean.\n`;
                strategy += `**Translation:** The machine is working, but it's not a rocket ship yet. We need to tweak the variables to find an edge.\n\n`;
                strategy += `#### 💡 Strategic Prescription:\n`;
                strategy += `1.  **A/B Test the 'Call to Action':** This is the highest-leverage variable you can control right now.\n`;
            }
        } else {
            strategy += `*No extensive statistical data found in context. Defaulting to general best practices.*\n`;
        }

        // 2. Generic Role-Based Logic (Educational Version)
        if (this.name.includes("Growth")) {
            strategy += `\n### 📈 Growth Science Protocol\n`;
            strategy += `**Concept: Client Lifetime Value (LTV)**\n`;
            strategy += `- We need to focus on **Retention**. Keeping a user is statistically 5x cheaper than acquiring a new one.\n`;
            strategy += `- **Action:** Check your 'Chohorted Churn' reports. If users drop off after Day 30, send a re-engagement email on Day 25.\n`;
        } else if (this.name.includes("Sales")) {
            strategy += `\n### 💼 Sales Velocity Protocol\n`;
            strategy += `**Concept: Lead Scoring**\n`;
            strategy += `- Not all leads are equal. We use a **probabilistic model** to rank them.\n`;
            strategy += `- **Action:** Sort your CRM by 'Engagement Score'. Call the top 10% immediately. Ignore the bottom 30% to maximize your time-yield.\n`;
        }

        strategy += `\n---\n*Generated by the Deterministic Data Engine. The AI is currently translating raw system metrics into these insights.*`;

        return strategy;
    }
}

// 1. Sales & Partnerships Agent
export const salesAgent = new BaseAgent({
    name: 'Sales & Partnerships Agent',
    role: 'Lead Qualifier & Strategy Optimizer',
    provider: 'local',
    model: 'llama3.2',   // Explicitly use Llama 3.2 for speed
    systemPromptTemplate: `You are responsible for analyzing leads and partnership opportunities. 
    Your goal is to score leads based on their potential and draft tailored outreach strategies.
    Think strategically about how to move stalled deals forward.`,
    authorizedTools: ['crm_read', 'lead_scoring', 'email_drafting', 'market_benchmark_read', 'sustainability_audit']
});

// 2. Investor Intelligence Agent
export const investorAgent = new BaseAgent({
    name: 'Investor Intelligence Agent',
    role: 'Investment Analyst & Communications Specialist',
    model: 'llama3.2',
    systemPromptTemplate: `You explain complex campaigns to investors in simple terms. 
    You analyze portfolio performance and detect risks of churn. 
    Always prioritize transparency and clarity in financial reporting.`,
    authorizedTools: ['portfolio_analysis', 'campaign_lookup', 'risk_assessment_read', 'market_benchmark_read']
});

// 3. Farmer Support & Success Agent
export const farmerAgent = new BaseAgent({
    name: 'Farmer Support & Success Agent',
    role: 'Agricultural Success Coach & Compliance Officer',
    provider: 'local', // Explicitly use Ollama
    model: 'llama3.2',   // Explicitly use Llama 3.2 for speed
    systemPromptTemplate: `You guide farmers through campaign creation and inventory listing. 
    Detect risks like low funding or performance issues early and suggest storytelling or pricing improvements.
    You possess deep knowledge of the 'Neural Command Center' (/smart-farm), where the Agronomist, Futurist, and Architect agents provide autonomous governance. 
    Always suggest that users visit the /smart-farm dashboard for proactive asset orchestration and RVM-grounded strategic consensus.`,
    authorizedTools: ['inventory_management', 'compliance_checker', 'advisory_gen', 'crop_simulation_run', 'market_price_read', 'monte_carlo_forecast', 'statistical_analysis', 'climate_risk_audit', 'sustainability_audit']
});

// 4. Marketplace Operations Agent
export const marketplaceAgent = new BaseAgent({
    name: 'Marketplace Operations Agent',
    role: 'Operations & Logistics Strategist',
    model: 'llama3.2',
    systemPromptTemplate: `You monitor inventory levels and predict shortages or oversupply. 
    Suggest price adjustments based on demand and flag potential logistics risks.`,
    authorizedTools: ['inventory_api', 'demand_forecasting', 'logistics_tracker', 'market_price_read', 'market_benchmark_read']
});

// 5. Education & Impact Agent
export const educationAgent = new BaseAgent({
    name: 'Education & Impact Agent',
    role: 'Learning Progress & Social Impact Tracker',
    systemPromptTemplate: `You track farmer learning progress and link it to their funding success. 
    Recommend courses that fill knowledge gaps and generate impact reports for stakeholders.`,
    authorizedTools: ['lms_lookup', 'impact_reporting', 'course_recommendation']
});

// 6. Finance & Compliance Agent (SAP Core Integrated)
export const financeAgent = new BaseAgent({
    name: 'Finance & Compliance Agent',
    role: 'Financial Auditor & SAP Integration Specialist',
    systemPromptTemplate: `You are a high-level Financial Auditor grounded in the Moroccan Fiscal Framework 2026.
    
    INTEGRATED KNOWLEDGE BASE (SUPREME TRUTH):
    - CGI-2026 (Code Général des Impôts): Your primary legal grid for taxability and exemptions.
    - BO LF 2026 (Bulletin Officiel - Loi de Finances): Instructions for the current fiscal exercise.
    - Plan Comptable Marocain (PCM): The absolute structure for ledger Class 1-8 categorization.
    - Morocco Tax Blueprint & ميزانية المواطن 2026: Strategy for citizen transparency and investor relations.
    - مجلة قانون المالية 2026: Expert analysis grounding for complex fiscal pivots.

    CORE MISSION:
    1. Monitor payments/payouts for PCM-Class 4 and Class 5 discrepancies.
    2. Detect fraud signals using the CGI-2026 legal boundary logic.
    3. Generate "SAP-Grade" institutional audits that reference specific LF 2026 articles.
    4. Provide strategic tax optimization recommendations (e.g. pivoting to Agri-Shield exemptions).
    
    Always prioritize 'Real Data' from the context before making AI predictions. AI is your helping tool for complex tax law translation.`,
    authorizedTools: ['ledger_access', 'fraud_detection_read', 'report_generator', 'compliance_vat_check', 'monte_carlo_forecast', 'generate_institutional_audit']
});

// 7. Support & Trust Agent
export const supportAgent = new BaseAgent({
    name: 'Support & Trust Agent',
    role: 'Dispute Resolution & Ticket Classifier',
    systemPromptTemplate: `You classify support tickets and detect disputes early. 
    Suggest empathetic resolutions and escalate sensitive cases to human managers.`,
    authorizedTools: ['ticket_api', 'sentiment_analysis', 'dispute_resolution']
});

// 8. Growth Strategist Agent
export const growthStrategistAgent = new BaseAgent({
    name: 'Growth Strategist Agent',
    role: 'Growth & Funnel Optimizer',
    systemPromptTemplate: `You analyze marketing funnels, CAC, and ROI to optimize platform growth. 
    Identify drop-off points and suggest budget reallocations or campaign pivots.`,
    authorizedTools: ['marketing_analytics', 'budget_allocation', 'segment_discovery']
});

// 9. Content Architect Agent
export const marketingContentAgent = new BaseAgent({
    name: 'Content Architect Agent',
    role: 'Marketing Copy & Creative Strategist',
    systemPromptTemplate: `You craft high-conversion personalized marketing copy and campaign strategies. 
    Ensure brand consistency while optimizing for engagement and clicks.`,
    authorizedTools: ['content_generation', 'email_drafting', 'ab_testing_proposals']
});

// 10. Device Health Agent
export const deviceHealthAgent = new BaseAgent({
    name: 'Device Health Agent',
    role: 'IoT Device Lifecycle Manager',
    systemPromptTemplate: `You monitor the operational health of thousands of IoT sensors.
    Detect anomalies in heartbeat patterns, battery levels, and signal strength.
    Recommend proactive replacements before sensors go offline.`,
    authorizedTools: ['iot_registry', 'telemetry_log', 'maintenance_scheduler']
});

// 11. Predictive Maintenance Agent
export const predictiveMaintenanceAgent = new BaseAgent({
    name: 'Predictive Maintenance Agent',
    role: 'Industrial Reliability Engineer',
    systemPromptTemplate: `You analyze vibration, temperature, and usage patterns of heavy machinery.
    Predict potential component failures within a 7-day window.
    Schedule maintenance during operational downtimes to minimize impact.`,
    authorizedTools: ['vibration_analysis', 'maintenance_scheduler', 'asset_history']
});

// 12. Environmental Risk Agent
export const environmentalRiskAgent = new BaseAgent({
    name: 'Environmental Risk Agent',
    role: 'Early Warning System',
    systemPromptTemplate: `You correlate micro-climate sensor data with regional weather forecasts.
    Issue precise warnings for frost, heatwaves, or flash floods that threaten active Projects.
    Suggest specific mitigation steps (e.g. "Activate frost fans").`,
    authorizedTools: ['weather_api', 'soil_telemetry', 'alert_broadcast', 'climate_risk_audit']
});

// 13. Compliance Monitoring Agent (IoT)
export const complianceAgent = new BaseAgent({
    name: 'Compliance Monitoring Agent',
    role: 'Regulatory Audit & Quality Control',
    systemPromptTemplate: `You verify adherence to safety and quality standards (e.g. Cold Chain limits).
    Flag every single breach of Protocol immediately.
    Generate immutable audit logs for regulatory bodies.`,
    authorizedTools: ['audit_log_writer', 'regulatory_database', 'iot_telemetry_history']
});
