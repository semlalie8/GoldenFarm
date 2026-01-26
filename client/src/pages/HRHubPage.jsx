import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import {
    FaUsers, FaUserPlus, FaCalendarCheck, FaFileInvoiceDollar,
    FaHistory, FaClock, FaCheckCircle, FaExclamationCircle, FaPrint
} from 'react-icons/fa';
import AIAssistant from '../components/AIAssistant';

const HRHubPage = () => {
    const { t } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [empRes, statsRes] = await Promise.all([
                axios.get('/api/hr/employees'),
                axios.get('/api/hr/stats')
            ]);
            setEmployees(empRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching HR data');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-hr">{t('calibrating_workforce', 'Calibrating Workforce Intelligence...')}</div>;

    return (
        <div className="hr-hub">
            <style>{`
                .hr-hub { padding: 40px; background: #fafafa; min-height: 100vh; color: #334155; font-family: 'Outfit', sans-serif; }
                .hr-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
                .hr-title h1 { font-size: 2.2rem; font-weight: 900; color: #0f172a; margin: 0; }
                .hr-title p { color: #64748b; font-size: 0.95rem; }
                
                .hr-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
                .hr-stat-card { background: white; border-radius: 12px; padding: 25px; border-bottom: 4px solid #3b82f6; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .hr-stat-label { color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
                .hr-stat-value { font-size: 2rem; font-weight: 800; color: #0f172a; }
                
                .hr-main-grid { display: grid; grid-template-columns: 2.5fr 1fr; gap: 30px; }
                .hr-card { background: white; border-radius: 16px; padding: 30px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
                .hr-card-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
                
                .emp-table { width: 100%; border-collapse: collapse; }
                .emp-table th { text-align: left; padding: 12px; font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
                .emp-table td { padding: 15px 12px; border-bottom: 1px solid #f8fafc; font-size: 0.85rem; }
                .emp-badge { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; }
                .badge-active { background: #dcfce7; color: #15803d; }
                
                .attendance-item { display: flex; align-items: center; gap: 15px; padding: 12px 0; border-bottom: 1px solid #f8fafc; }
                .a-avatar { width: 35px; height: 35px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #475569; font-size: 0.8rem; }
                
                .payroll-cta { background: linear-gradient(135deg, #1e293b, #0f172a); color: white; border-radius: 12px; padding: 25px; margin-top: 30px; }
            `}</style>

            <div className="hr-header">
                <div className="hr-title">
                    <h1>{t('hr_hub_title', 'Human Capital & Payroll')}</h1>
                    <p>{t('hr_hub_subtitle', 'Moroccan Code du Travail Compliant • ROI Alignment • Trust Infrastructure')}</p>
                </div>
                <div className="hr-actions">
                    <button className="btn btn-primary" style={{ background: '#3b82f6', border: 'none', padding: '12px 25px', fontWeight: 700, borderRadius: '8px' }}>
                        <FaUserPlus style={{ marginRight: '10px' }} /> {t('onboard_employee', 'Onboard Employee')}
                    </button>
                </div>
            </div>

            <div className="hr-stats-grid">
                <div className="hr-stat-card">
                    <div className="hr-stat-label"><FaUsers /> {t('active_staff', 'Active Staff')}</div>
                    <div className="hr-stat-value">{stats?.activeEmployees}</div>
                </div>
                <div className="hr-stat-card" style={{ borderBottomColor: '#f59e0b' }}>
                    <div className="hr-stat-label"><FaCalendarCheck /> {t('pending_leaves', 'Pending Leaves')}</div>
                    <div className="hr-stat-value">{stats?.pendingLeaves}</div>
                </div>
                <div className="hr-stat-card" style={{ borderBottomColor: '#10b981' }}>
                    <div className="hr-stat-label"><FaFileInvoiceDollar /> {t('payroll_ytd', 'Payroll YTD')}</div>
                    <div className="hr-stat-value">{(stats?.totalPayrollYTD / 1000).toFixed(1)}K <span style={{ fontSize: '0.8rem' }}>MAD</span></div>
                </div>
                <div className="hr-stat-card" style={{ borderBottomColor: '#6366f1' }}>
                    <div className="hr-stat-label"><FaClock /> {t('avg_overtime', 'Avg. Overtime')}</div>
                    <div className="hr-stat-value">4.2h <span style={{ fontSize: '0.8rem' }}>/mo</span></div>
                </div>
            </div>

            <div className="hr-main-grid">
                <div className="hr-left">
                    <div className="hr-card">
                        <div className="hr-card-title"><FaUsers /> {t('employee_directory', 'Employee Directory')}</div>
                        <div className="table-responsive">
                            <table className="emp-table">
                                <thead>
                                    <tr>
                                        <th>{t('employee', 'Employee')}</th>
                                        <th>{t('position_dept', 'Position / Dept')}</th>
                                        <th>{t('contract', 'Contract')}</th>
                                        <th>{t('salary_mad', 'Salary (MAD)')}</th>
                                        <th>{t('status', 'Status')}</th>
                                        <th>{t('actions', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map(emp => (
                                        <tr key={emp._id}>
                                            <td>
                                                <div style={{ fontWeight: 700 }}>{emp.firstName} {emp.lastName}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID: {emp.employeeId}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.85rem' }}>{emp.jobTitle}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{emp.department}</div>
                                            </td>
                                            <td><span style={{ fontWeight: 600 }}>{emp.contractType}</span></td>
                                            <td style={{ fontWeight: 800 }}>{emp.baseSalary.toLocaleString()}</td>
                                            <td><span className="emp-badge badge-active">{emp.status}</span></td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary"><FaPrint /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {employees.length === 0 && (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No employees found. Start by onboarding your first team member.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="payroll-cta">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{t('monthly_payroll_cycle', 'Monthly Payroll Cycle')}</h3>
                                <p style={{ margin: '5px 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>{t('payroll_schedule_jan', 'Next run scheduled for January 31, 2026. All attendance logs verified.')}</p>
                            </div>
                            <button className="btn btn-light" style={{ fontWeight: 700, padding: '10px 20px' }}>
                                <FaFileInvoiceDollar style={{ marginRight: '8px' }} /> {t('initiate_run', 'Initiate Run')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hr-right">
                    <AIAssistant
                        agentType="finance"
                        context={{ employeesCount: employees.length, stats }}
                        onAction={(suggestion) => alert('HR Optimization Applied')}
                    />

                    <div className="hr-card" style={{ marginTop: '30px' }}>
                        <div className="hr-card-title"><FaHistory /> {t('live_attendance_feed', 'Live Attendance Feed')}</div>
                        <div className="attendance-list">
                            {stats?.recentAttendance.map((log, i) => (
                                <div key={i} className="attendance-item">
                                    <div className="a-avatar">{log.employee?.firstName[0]}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{log.employee?.firstName} {log.employee?.lastName}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Clock-in at {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800 }}>ON-SITE</div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-link w-100" style={{ fontSize: '0.75rem', marginTop: '15px' }}>{t('view_attendance', 'View Full Attendance')}</button>
                    </div>

                    <div className="hr-card" style={{ marginTop: '30px', background: '#f8fafc' }}>
                        <div className="hr-card-title" style={{ fontSize: '0.9rem' }}><FaExclamationCircle /> {t('compliance_alerts', 'Compliance Alerts')}</div>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                <FaCheckCircle color="#10b981" />
                                <span>{t('tax_brackets_updated', 'CGI 2026 Tax Brackets Updated.')}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                <FaExclamationCircle color="#f59e0b" />
                                <span>{t('cnss_due', 'CNSS Declarations due in 4 days.')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRHubPage;
