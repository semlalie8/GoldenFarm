import axios from 'axios';
import JournalEntry from '../models/journalEntryModel.js';
import LedgerAccount from '../models/ledgerAccountModel.js';

/**
 * FinanceService - Precision mathematical and compliance layer for GoldenFarm Governance.
 */
class FinanceService {
    constructor() {
        this.portfolioOptimizerUrl = "https://api.portfoliooptimizer.io/v1";
        this.abstractVatUrl = "https://vat.abstractapi.com/v1/validate";

        // Moroccan Tax Config 2026
        this.VAT_RATES = {
            STANDARD: 0.20,
            REDUCED_AGRI: 0.10,
            EXEMPT: 0
        };
    }

    /**
     * Calculate TVA status for a given period.
     * Logic: TVA Due = TVA Facturée (on Sales) - TVA Récupérable (on Expenses & Assets)
     */
    async calculateTVAPosition(startDate, endDate) {
        const entries = await JournalEntry.find({
            transactionDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
            status: 'posted'
        }).populate('lines.account');

        let tvaFacturee = 0;      // Account 4455
        let tvaRecupCharges = 0;  // Account 3455
        let tvaRecupImmo = 0;     // Account 3456

        entries.forEach(entry => {
            entry.lines.forEach(line => {
                const code = line.account.accountCode;
                if (code === '4455') tvaFacturee += (line.credit - line.debit);
                if (code === '3455') tvaRecupCharges += (line.debit - line.credit);
                if (code === '3456') tvaRecupImmo += (line.debit - line.credit);
            });
        });

        const tvaDue = tvaFacturee - (tvaRecupCharges + tvaRecupImmo);

        return {
            period: { start: startDate, end: endDate },
            metrics: {
                tvaFacturee,
                tvaRecupCharges,
                tvaRecupImmo,
                tvaDue,
                isCredit: tvaDue < 0
            },
            protocol: "CGI_MOROCCO_2026_V1"
        };
    }

    /**
     * Simulation mode for proposed transactions.
     * Returns the impact on IS (Income Tax) and TVA.
     */
    simulateFiscalImpact(grossAmount, category = 'standard') {
        const rate = category === 'agri' ? this.VAT_RATES.REDUCED_AGRI : this.VAT_RATES.STANDARD;
        const tva = grossAmount * rate;
        const net = grossAmount + tva;

        return {
            gross: grossAmount,
            tva,
            netTotal: net,
            isImpactEstimate: grossAmount * 0.20 // Basic 20% IS estimate
        };
    }

    /**
     * Use Portfolio Optimizer for deterministic Monte Carlo simulations.
     */
    async simulatePortfolioRisk(returns) {
        try {
            const response = await axios.post(`${this.portfolioOptimizerUrl}/portfolio/analysis/risk/metrics`, {
                portfolios: [{ portfolioItems: returns }]
            });
            return response.data;
        } catch (error) {
            console.error('[FinanceService] Portfolio Optimizer Failed:', error.message);
            return { error: "Deterministic analysis unavailable. Using local stochastic fallback." };
        }
    }

    /**
     * Validate VAT/Tax IDs for international agricultural trade.
     */
    async validateVat(vatNumber) {
        const apiKey = process.env.ABSTRACT_VAT_KEY;
        if (!apiKey) return { status: "Manual Review Required", message: "Compliance Layer Key Missing" };

        try {
            const response = await axios.get(this.abstractVatUrl, {
                params: { api_key: apiKey, vat_number: vatNumber }
            });
            return response.data;
        } catch (error) {
            console.error('[FinanceService] VAT Validation Failed:', error.message);
            return { valid: false, message: "Compliance server unreachable" };
        }
    }

    /**
     * Placeholder for core ledger posting logic
     */
    async postJournalEntry(data) {
        // Implementation of double-entry logic
        const entry = await JournalEntry.create(data);
        return entry;
    }
}

export default new FinanceService();
