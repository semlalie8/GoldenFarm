import Orchestration from '../models/orchestrationModel.js';
import AILog from '../models/aiLogModel.js';
import { emitEvent } from '../utils/socket.js';

/**
 * Record a new orchestration job in the outbox
 */
export const recordOrchestration = async (type, payload) => {
    const eventId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const job = await Orchestration.create({
        eventId,
        eventType: type,
        payload,
        status: 'processing'
    });

    // Notify UI via WebSocket
    emitEvent('orchestration.update', job);

    return job;
};

/**
 * Mark an orchestration job as completed
 */
export const completeOrchestration = async (orchestration) => {
    orchestration.status = 'completed';
    orchestration.completedAt = new Date();
    await orchestration.save();

    // Notify UI via WebSocket
    emitEvent('orchestration.update', orchestration);
};

/**
 * Log AI decisions for auditing
 */
export const logAIAction = async (agentName, task, result) => {
    const log = await AILog.create({
        agentName,
        task,
        result: typeof result === 'string' ? result : JSON.stringify(result),
        status: 'completed'
    });

    // Notify UI via WebSocket
    emitEvent('ai_activity.new', log);

    return log;
};

/**
 * Log a generic stream event for the UI
 */
export const logStreamEvent = (event, properties) => {
    emitEvent('orchestration.stream', {
        event,
        properties,
        createdAt: new Date()
    });
};

/**
 * AI Orchestration Execution Engine (Phase 4)
 * This function takes a log entry or specific task and attempts to execute it via the Tool Registry.
 */
export const processQueuedTask = async (orchestrationId) => {
    const { executeTool } = await import('./toolRegistry.js');
    const job = await Orchestration.findOne({ eventId: orchestrationId });

    if (!job || job.status === 'completed') return;

    try {
        job.status = 'processing';
        await job.save();
        emitEvent('orchestration.update', job);

        const { task, agent, params } = job.payload;
        console.log(`[Orchestrator] Executing task for ${agent}: ${task}`);

        // Mapping simple human tasks to high-precision tools if params are missing
        // This is where "Intelligent Routing" happens
        let toolName = params?.tool || 'statistical_analysis';
        let toolParams = params?.args || {};

        // Auto-routing logic based on task keywords (Phase 4 Logic)
        if (task.toLowerCase().includes('water') || task.toLowerCase().includes('moisture')) {
            toolName = 'iot_actuator_adjust';
            toolParams = { actuator: 'smart_valve', value: 'open', ...toolParams };
        } else if (task.toLowerCase().includes('payout') || task.toLowerCase().includes('liquid')) {
            toolName = 'ledger_milestone_payout';
        } else if (task.toLowerCase().includes('restock') || task.toLowerCase().includes('replenish')) {
            toolName = 'inventory_auto_replenish';
        }

        const result = await executeTool(toolName, toolParams);

        job.status = 'completed';
        job.completedAt = new Date();
        job.payload.execution_result = result;
        await job.save();

        // Final notification
        emitEvent('orchestration.update', job);
        emitEvent('orchestration.stream', {
            event: 'TASK_COMPLETED',
            properties: { task, agent, result: 'SUCCESS' }
        });

        return result;
    } catch (error) {
        job.status = 'failed';
        job.lastError = error.message;
        await job.save();
        emitEvent('orchestration.update', job);
        throw error;
    }
};

export default {
    recordOrchestration,
    completeOrchestration,
    logAIAction,
    logStreamEvent,
    processQueuedTask
};
