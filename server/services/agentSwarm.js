import { emitEvent } from '../utils/socket.js';
import FinanceService from './financeService.js';
import IoTService from './iotService.js';
import InventoryService from './inventoryService.js';
import auditService from './auditService.js';

/**
 * AgentSwarm - The Autonomic Operator.
 * Manages specialized sub-agents that run entirely on the server.
 */
class AgentSwarm {
    constructor() {
        this.agents = {
            COMPLIANCE_OFFICER: this.runComplianceCheck,
            ENVIRONMENTAL_RISK: this.assessRisk,
            INVENTORY_OPTIMIZER: this.optimizeStock
        };
    }

    /**
     * Dispatch a task to the swarm.
     */
    async dispatch(agentName, context) {
        console.log(`[AgentSwarm] Dispatching ${agentName}...`);

        if (!this.agents[agentName]) {
            throw new Error(`Agent ${agentName} not provisioned.`);
        }

        const result = await this.agents[agentName].call(this, context);

        emitEvent('AGENT_ACTIVITY', {
            agent: agentName,
            status: 'COMPLETED',
            result
        });

        return result;
    }

    // --- SPECIALIZED AGENT LOGIC ---

    /**
     * Agent 1: Compliance Officer
     * Scans transactions for regulatory breaches.
     */
    async runComplianceCheck(context) {
        const { transactionId, amount, category } = context;

        // Use Finance Service Simulation
        const fiscalImpact = FinanceService.simulateFiscalImpact(amount, category);

        let decision = "APPROVED";
        let reason = "Within thresholds.";

        if (amount > 50000 && !context.kycVerified) {
            decision = "FLAGGED";
            reason = "AML Warning: High Value Unverified";
        }

        // Auto-Audit
        await auditService.log({
            action: 'AGENT_DECISION',
            module: 'FINANCE',
            details: { agent: 'COMPLIANCE_OFFICER', decision, reason, amount }
        });

        return { decision, reason, fiscalImpact };
    }

    /**
     * Agent 2: Environmental Risk
     * Analyzes IoT streams to predict yield loss.
     */
    async assessRisk(context) {
        const { deviceId, moisture, temperature } = context;
        let riskLevel = "LOW";
        let action = "NONE";

        if (temperature > 35 && moisture < 20) {
            riskLevel = "CRITICAL";
            action = "ACTIVATE_IRRIGATION";

            // Proactive Trigger
            // In a real system, this would call MQTT to open valves
            console.log(`[Environmental Risk] AUTO-TRIGGER: Opening Valves for Zone ${deviceId}`);
        }

        return { riskLevel, recommendedAction: action };
    }

    /**
     * Agent 3: Inventory Optimizer
     * Recommends restocking based on burn rate.
     */
    async optimizeStock(context) {
        const { productId, currentStock, burnRate } = context;
        const daysRemaining = currentStock / (burnRate || 1);

        return {
            status: daysRemaining < 7 ? "RESTOCK_URGENT" : "STABLE",
            daysRemaining: Math.round(daysRemaining),
            recommendedOrder: daysRemaining < 7 ? 1000 : 0
        };
    }
}

export default new AgentSwarm();
