import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Atomic Components
import UserDetailsHero from '../components/Admin/UserDetailsHero';
import UserDetailsStats from '../components/Admin/UserDetailsStats';
import UserDetailsTabs from '../components/Admin/UserDetailsTabs';

const AdminUserDetailsPage = () => {
    const { id } = useParams();
    const { i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`/api/users/${id}`, config);
                setUser(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setLoading(false);
            }
        };

        if (userInfo && userInfo.isAdmin) {
            fetchUserDetails();
        } else {
            navigate('/login');
        }
    }, [id, userInfo, navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <div className="container mt-5 text-center">User not found</div>;
    }

    return (
        <div className="dashboard-page" dir={currentDir}>
            <UserDetailsHero user={user} currentDir={currentDir} />

            <div className="container dashboard-content mt-4">
                <UserDetailsStats user={user} />
                <UserDetailsTabs user={user} />
            </div>
        </div>
    );
};

export default AdminUserDetailsPage;
