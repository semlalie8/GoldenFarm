import { PayrollRun, Payslip } from '../models/hrModel.js';
import Employee from '../models/employeeModel.js';
import auditService from './auditService.js';

/**
 * PayrollService - The source-deduction and labor compliance engine.
 * Specifically tuned for the Moroccan Code du Travail.
 */
class PayrollService {
    constructor() {
        // Moroccan Tax Config 2026
        this.CNSS_RATE = 0.0448; // 4.48%
        this.CNSS_CAP = 6000;
        this.AMO_RATE = 0.0226; // 2.26%
        this.PROFESSIONAL_EXPENSE_RATE = 0.20; // 20% flat abatement for IR
        this.PROFESSIONAL_EXPENSE_CAP = 2500;
    }

    /**
     * Calculate IR (Income Tax) based on current Moroccan brackets.
     * @param {number} netTaxable - The taxable salary after CNSS, AMO, and basic abatement.
     */
    calculateIR(netTaxable) {
        if (netTaxable <= 2500) return 0;
        if (netTaxable <= 4166) return (netTaxable * 0.10) - 250;
        if (netTaxable <= 5000) return (netTaxable * 0.20) - 666.67;
        if (netTaxable <= 6666) return (netTaxable * 0.30) - 1166.67;
        if (netTaxable <= 15000) return (netTaxable * 0.34) - 1433.33;
        return (netTaxable * 0.38) - 2033.33;
    }

    /**
     * Execute a precision payroll run for all active employees.
     */
    async executeMonthlyRun(year, month, processedBy, req = null) {
        const Attendance = (await import('../models/attendanceModel.js')).default;

        // 1. Initialize Record
        const run = await PayrollRun.create({
            year,
            month,
            processedBy,
            status: 'draft'
        });

        const activeEmployees = await Employee.find({ status: 'Active' });
        let totalGross = 0;
        let totalNet = 0;
        let totalTax = 0;
        let totalSS = 0;

        for (const emp of activeEmployees) {
            // A. Fetch Attendance Bridging
            const attendance = await Attendance.find({
                employee: emp._id,
                date: {
                    $gte: new Date(year, month - 1, 1),
                    $lte: new Date(year, month, 0)
                }
            });

            const totalOvertimeHours = attendance.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);
            const hourlyRate = emp.baseSalary / 191; // Standard Moroccan legal divisor
            const overtimePay = totalOvertimeHours * hourlyRate * 1.25;

            // B. Salaire Brut Global (SBG)
            const gross = emp.baseSalary + overtimePay;

            // C. Social Security (CNSS)
            const cnss = Math.min(gross, this.CNSS_CAP) * this.CNSS_RATE;

            // D. Health Insurance (AMO)
            const amo = gross * this.AMO_RATE;

            // E. Taxable Base Calculation
            const flatAbatement = Math.min(gross * this.PROFESSIONAL_EXPENSE_RATE, this.PROFESSIONAL_EXPENSE_CAP);
            const netTaxable = gross - cnss - amo - flatAbatement;

            // F. Income Tax (IR)
            const ir = Math.max(0, this.calculateIR(netTaxable));

            // G. Net Pay
            const netPay = gross - cnss - amo - ir;

            // Save Payslip
            await Payslip.create({
                payrollRun: run._id,
                employee: emp._id,
                month,
                year,
                basicSalary: emp.baseSalary,
                overtimePay,
                grossSalary: gross,
                cnss,
                amo,
                taxIR: ir,
                netPay
            });

            totalGross += gross;
            totalNet += netPay;
            totalTax += ir;
            totalSS += (cnss + amo);
        }

        // Update Run Totals
        run.totalGross = totalGross;
        run.totalNet = totalNet;
        run.totalTax = totalTax;
        run.totalSocialSecurity = totalSS;
        await run.save();

        // Forensic Audit
        await auditService.log({
            user: processedBy,
            action: 'PAYROLL_RUN_EXECUTE',
            module: 'HR',
            details: { month, year, totalPayout: totalNet },
            req
        });

        return run;
    }
}

export default new PayrollService();
