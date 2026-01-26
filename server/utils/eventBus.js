import EventEmitter from 'events';
import {
    growthStrategistAgent,
    marketingContentAgent,
    supportAgent,
    financeAgent,
    marketplaceAgent
} from '../agents/agentDefinitions.js';
import JournalEntry from '../models/journalEntryModel.js';
import Product from '../models/productModel.js';
import AILog from '../models/aiLogModel.js';
import MarketingEvent from '../models/marketingEventModel.js';
import Orchestration from '../models/orchestrationModel.js';
import {
    recordOrchestration,
    completeOrchestration,
    logAIAction,
    logStreamEvent
} from '../services/orchestrationService.js';

class GlobalEventBus extends EventEmitter { }

const eventBus = new GlobalEventBus();

// --- AUTOMATION LISTENERS ---

// --- AUTOMATION LISTENERS ---

// 1. Transaction Automation: Dynamic Hub Sync
eventBus.on('transaction.completed', async (data) => {
    console.log('[Orchestrator] Event: transaction.completed');
    const job = await recordOrchestration('transaction.completed', data);

    try {
        // A. CDP Integration
        await MarketingEvent.create({
            user: data.userId,
            distinctId: data.userId ? data.userId.toString() : 'ANONYMOUS_TX',
            event: 'TRANSACTION_COMPLETED',
            properties: data
        });
        logStreamEvent('TRANSACTION_COMPLETED', data);

        // B. Inventory Integration (Real-time stock deduction)
        if (data.type === 'purchase' && data.productId) {
            const product = await Product.findById(data.productId);
            if (product) {
                product.stock -= (data.quantity || 1);
                await product.save();

                if (product.stock <= product.lowStockThreshold) {
                    eventBus.emit('inventory.low_stock', { productId: product._id, name: product.name.en, stock: product.stock });
                }
            }
        }

        // C. Growth Intelligence
        const advice = await growthStrategistAgent.runTask(
            `Positive cash flow detected. Value: ${data.amount} MAD. Recalculate LTV and suggest reinvestment.`,
            { transaction: data }
        );
        await logAIAction('Growth Strategist', 'Revenue Reinvestment Analysis', advice);

        await completeOrchestration(job);
    } catch (error) {
        job.status = 'failed';
        job.lastError = error.message;
        await job.save();
        console.error('[Orchestrator] Error in transaction flow:', error);
    }
});

// 2. Sensor & IoT Orchestration
eventBus.on('sensor.alert', async (data) => {
    console.log('[Orchestrator] Event: sensor.alert');
    const job = await recordOrchestration('sensor.alert', data);

    try {
        await MarketingEvent.create({
            distinctId: data.deviceId || 'INTERNAL_SENSORS',
            event: 'SYSTEM_ANOMALY',
            properties: data
        });
        logStreamEvent('SYSTEM_ANOMALY', data);

        const triage = await supportAgent.runTask(
            `IoT sensor ${data.sensorType} reported ${data.value} in ${data.location}. Determine operational risk.`,
            { sensor: data }
        );

        await logAIAction('Support Agent', 'IoT Triage', triage);
        await completeOrchestration(job);
    } catch (error) {
        job.status = 'failed';
        job.lastError = error.message;
        await job.save();
        console.error('[Orchestrator] Error in sensor flow:', error);
    }
});

// 3. Behavioral Hyper-Personalization
eventBus.on('activity.recorded', async (data) => {
    try {
        await MarketingEvent.create({
            user: data.userId,
            distinctId: data.userId ? data.userId.toString() : 'ANONYMOUS_ACTIVITY',
            event: `USER_${data.type.toUpperCase()}`,
            properties: data.details
        });
        logStreamEvent(`USER_${data.type.toUpperCase()}`, data.details);

        if (data.type === 'view_project') {
            const activityCount = await MarketingEvent.countDocuments({
                user: data.userId,
                event: 'USER_VIEW_PROJECT'
            });

            if (activityCount > 5) {
                await growthStrategistAgent.runTask(
                    `Target a 'High Intensity Prospect' (User ID: ${data.userId}) with a personalized investment proposal.`,
                    { userId: data.userId }
                );
            }
        }
    } catch (error) {
        console.error('[Orchestrator] Error in behavior flow:', error);
    }
});

// 4. Workforce & Productivity Sync
eventBus.on('hr.attendance.recorded', async (data) => {
    try {
        await marketplaceAgent.runTask(
            `Staff capacity increased. Should we lift order limits for perishable goods?`,
            { activeStaffCount: data.totalActive }
        );
    } catch (error) {
        console.error('[Orchestrator] Error in HR/Stock sync:', error);
    }
});

export default eventBus;
