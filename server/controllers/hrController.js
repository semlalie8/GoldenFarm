import asyncHandler from 'express-async-handler';
import Employee from '../models/employeeModel.js';
import Attendance from '../models/attendanceModel.js';
import LeaveRequest from '../models/leaveRequestModel.js';
import PayrollRun from '../models/payrollRunModel.js';
import Payslip from '../models/payslipModel.js';
import payrollService from '../services/payrollService.js';
import eventBus from '../utils/eventBus.js';
import { MOROCCAN_TAX_CONFIG_2026 } from '../utils/moroccanFinanceConstants.js';

/**
 * @desc    Get all employees
 * @route   GET /api/hr/employees
 * @access  Private/Admin
 */
export const getEmployees = asyncHandler(async (req, res) => {
    const employees = await Employee.find({});
    res.json(employees);
});

/**
 * @desc    Create new employee
 * @route   POST /api/hr/employees
 * @access  Private/Admin
 */
export const createEmployee = asyncHandler(async (req, res) => {
    const employee = await Employee.create({
        ...req.body,
        createdBy: req.user._id
    });
    res.status(201).json(employee);
});



/**
 * @desc    Generate Payroll Run
 * @route   POST /api/hr/payroll/run
 * @access  Private/Admin
 */
export const runPayroll = asyncHandler(async (req, res) => {
    const { month, year } = req.body;
    const payrollRun = await payrollService.executeMonthlyRun(year, month, req.user._id, req);
    res.status(201).json(payrollRun);
});

/**
 * @desc    Get HR Dashboard Stats
 * @route   GET /api/hr/stats
 * @access  Private/Admin
 */
export const getHRStats = asyncHandler(async (req, res) => {
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const pendingLeaves = await LeaveRequest.countDocuments({ status: 'Pending' });
    const totalPayrollYTD = await PayrollRun.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: null, total: { $sum: "$totalGross" } } }
    ]);

    res.json({
        activeEmployees,
        pendingLeaves,
        totalPayrollYTD: totalPayrollYTD[0]?.total || 0,
        recentAttendance: await Attendance.find().sort('-date').limit(10).populate('employee', 'firstName lastName')
    });
});
