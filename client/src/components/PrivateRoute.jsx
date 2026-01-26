import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    if (!userInfo) return <Navigate to="/login" replace />;

    // Check if admin is trying to access user dashboard specifically
    if (userInfo.role === 'admin' && window.location.pathname === '/dashboard') {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
