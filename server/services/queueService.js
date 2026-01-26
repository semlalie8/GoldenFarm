import JobQueue from '../models/jobQueueModel.js';

class QueueService {
    constructor() {
        this.isProcessing = false;
        this.interval = null;
        this.handlers = new Map();
    }

    /**
     * Register a task handler for a specific task type.
     */
    registerHandler(taskType, handler) {
        this.handlers.set(taskType, handler);
        console.log(`[QueueService] Handler registered for: ${taskType}`);
    }

    /**
     * Enqueue a task for later processing.
     */
    async enqueue(taskType, payload, priority = 0) {
        const job = await JobQueue.create({
            taskType,
            payload,
            priority
        });
        console.log(`[QueueService] Task Enqueued: ${taskType} (${job._id})`);
        return job;
    }

    /**
     * Start the worker loop.
     */
    start(pollInterval = 5000) {
        if (this.interval) return;

        console.log(`[QueueService] Background worker ignited. Polling every ${pollInterval}ms.`);
        this.interval = setInterval(() => this.processNext(), pollInterval);
    }

    async processNext() {
        if (this.isProcessing) return;

        const job = await JobQueue.findOneAndUpdate(
            { status: { $in: ['queued', 'retrying'] }, scheduledAt: { $lte: new Date() } },
            { status: 'processing', processedAt: new Date() },
            { sort: { priority: -1, createdAt: 1 }, new: true }
        );

        if (!job) return;

        this.isProcessing = true;
        try {
            const handler = this.handlers.get(job.taskType);
            if (!handler) {
                throw new Error(`No handler registered for task type: ${job.taskType}`);
            }

            console.log(`[QueueService] Executing Job: ${job.taskType} (${job._id})`);
            await handler(job.payload);

            job.status = 'completed';
            job.completedAt = new Date();
            await job.save();
        } catch (error) {
            console.error(`[QueueService] Job Failed: ${job._id}`, error.message);
            job.attempts += 1;
            job.errorLog.push(`${new Date().toISOString()}: ${error.message}`);

            if (job.attempts >= job.maxAttempts) {
                job.status = 'failed';
            } else {
                job.status = 'retrying';
                // Exponential backoff: retry in (attempts^2) minutes
                const backoffMinutes = Math.pow(job.attempts, 2);
                job.scheduledAt = new Date(Date.now() + backoffMinutes * 60000);
            }
            await job.save();
        } finally {
            this.isProcessing = false;
        }
    }
}

export default new QueueService();
