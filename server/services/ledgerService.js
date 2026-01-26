/**
 * Ledger Service - Strictly mathematical financial engine for Crowdfunding ROI.
 * Philosophy: "Revenue is fixed by math, not predicted by AI."
 */
class LedgerService {
    /**
     * Calculate deterministic project health and expected payouts.
     */
    calculateProjectYield(project, marketBenchmark) {
        const principal = project.raisedAmount || 0;
        const target = project.targetAmount;
        const baseRoi = project.roi / 100; // Expected annual ROI

        // Crowdfunding Health Ratio
        const tractionScore = target > 0 ? (principal / target) * 100 : 0;

        // P5 (Pessimistic) vs P95 (Optimistic) ROI
        // Influenced by market benchmark volatility
        const marketVolatilityShift = marketBenchmark?.volatility || 0.05;

        const yieldP5 = baseRoi * (1 - (marketVolatilityShift * 2)); // 95% confidence lower bound
        const yieldP50 = baseRoi;
        const yieldP95 = baseRoi * (1 + (marketVolatilityShift * 1.5));

        return {
            traction_percentage: tractionScore.toFixed(1),
            yield_analysis: {
                annual_p5: `${(yieldP5 * 100).toFixed(2)}%`,
                annual_p50: `${(yieldP50 * 100).toFixed(2)}%`,
                annual_p95: `${(yieldP95 * 100).toFixed(2)}%`,
                currency: "MAD"
            },
            payout_velocity: principal > (target * 0.8) ? "HIGH" : "INITIAL_PHASE",
            risk_premium: marketVolatilityShift > 0.1 ? "ELEVATED" : "STANDARD"
        };
    }

    /**
     * Calculate Live Accrued Dividends for an investment.
     * Factors in elapsed time and high-fidelity IoT health status.
     */
    calculateLiveAccruedYield(investmentAmount, annualRoi, startDate, iotHealthScore = 1.0) {
        const now = new Date();
        const start = new Date(startDate);
        const diffYears = (now - start) / (1000 * 60 * 60 * 24 * 365.25);

        // Base Yield = Principal * Rate * Time
        // Biological Multiplier: If iotHealthScore is < 0.8 (e.g. drought), yield accrual slows down.
        const bioMultiplier = Math.max(0.2, Math.min(1.2, iotHealthScore));
        const totalAccrued = investmentAmount * (annualRoi / 100) * diffYears * bioMultiplier;

        return {
            accrued_amount: totalAccrued.toFixed(4),
            currency: "MAD",
            bio_health_factor: bioMultiplier.toFixed(2),
            time_elapsed_years: diffYears.toFixed(4)
        };
    }
}

export default new LedgerService();
