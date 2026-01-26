/**
 * Circuit Breaker Pattern - Prevents cascading failures in the AI/IoT pipeline.
 */
class CircuitBreaker {
    constructor(name, options = {}) {
        this.name = name;
        this.failureThreshold = options.failureThreshold || 5;
        this.resetTimeout = options.resetTimeout || 30000; // 30 seconds

        this.failures = 0;
        this.status = 'CLOSED'; // CLOSED (working), OPEN (halted), HALF_OPEN (testing)
        this.nextAttempt = Date.now();
    }

    async execute(action) {
        if (this.status === 'OPEN') {
            if (Date.now() > this.nextAttempt) {
                this.status = 'HALF_OPEN';
            } else {
                throw new Error(`Circuit [${this.name}] is OPEN. Resilience active.`);
            }
        }

        try {
            const result = await action();
            this.success();
            return result;
        } catch (error) {
            this.failure(error);
            throw error;
        }
    }

    success() {
        this.failures = 0;
        this.status = 'CLOSED';
    }

    failure(error) {
        this.failures++;
        console.warn(`[CircuitBreaker] Failure in ${this.name} (${this.failures}/${this.failureThreshold})`);

        if (this.failures >= this.failureThreshold) {
            this.status = 'OPEN';
            this.nextAttempt = Date.now() + this.resetTimeout;
            console.error(`[CircuitBreaker] Circuit ${this.name} is now OPEN. Cooling down.`);
        }
    }
}

export default CircuitBreaker;
