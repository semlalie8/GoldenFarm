import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Atomic Components
import DashboardHero from '../components/Dashboard/DashboardHero';
import DashboardStats from '../components/Dashboard/DashboardStats';
import DashboardQuickAccess from '../components/Dashboard/DashboardQuickAccess';
import DashboardChart from '../components/Dashboard/DashboardChart';
import DashboardTransactions from '../components/Dashboard/DashboardTransactions';

const DashboardPage = () => {
    const { i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({ walletBalance: 0, totalInvested: 0, investmentCount: 0 });
    const [transactions, setTransactions] = useState([]);

    const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = { withCredentials: true };
                const [statsRes, transRes] = await Promise.all([
                    axios.get('/api/analytics/user', config),
                    axios.get('/api/transactions/my', config)
                ]);
                setStats(statsRes.data);
                setTransactions(transRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        if (userInfo) {
            fetchDashboardData();
        }
    }, [userInfo]);

    return (
        <div className="dashboard-page" dir={currentDir}>
            <DashboardHero userName={userInfo?.name} currentDir={currentDir} />

            <div className="container dashboard-content mt-4">
                <DashboardStats stats={stats} />
                <DashboardQuickAccess currentDir={currentDir} />
                <DashboardChart stats={stats} currentDir={currentDir} />
                <DashboardTransactions transactions={transactions} currentDir={currentDir} />
            </div>
        </div>
    );
};

export default DashboardPage;
