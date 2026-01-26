import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            if (userInfo.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const loginRequest = async (lat = null, lon = null) => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                const body = { email, password };
                if (lat && lon) {
                    body.latitude = lat;
                    body.longitude = lon;
                }

                const { data } = await axios.post('/api/auth/login', body, config);
                dispatch(setCredentials(data));

                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        // Try to get geolocation before logging in
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Success: Login with coordinates
                    loginRequest(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.log("Geolocation denied or error:", error.message);
                    // Error/Denied: Login without coordinates (fallback to IP)
                    loginRequest();
                },
                { timeout: 5000, enableHighAccuracy: false } // Wait max 5 seconds for location
            );
        } else {
            // Not supported: Login without coordinates
            loginRequest();
        }
    };

    const googleLoginHandler = () => {
        // Placeholder for Google Login logic
        console.log("Google Login Clicked");
    };

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    return (
        <div dir={currentDir} className="auth-wrapper">
            <h1>{t('signin_title', 'Sign In')}</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={submitHandler}>

                <div className="mb-3">
                    <label className="form-label">
                        {t('email_label', 'Email')} <span className="required-star">*</span>
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        {t('password_label', 'Password')} <span className="required-star">*</span>
                    </label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                        </button>
                    </div>
                </div>

                <div className="text-end mb-2">
                    <Link to="/forgotpassword" className="text-muted" style={{ fontSize: '0.9rem', textDecoration: 'none' }}>
                        {t('forgot_password', 'Forgot Password?')}
                    </Link>
                </div>

                <button type="submit" className="btn-gold w-100 mt-3" disabled={loading}>
                    {loading ? t('signing_in', 'Signing in...') : t('signin_btn', 'Sign In')}
                </button>

                <div className="text-center mt-3 mb-3">
                    <span className="text-muted">{t('or_continue_with', 'Or continue with')}</span>
                </div>

                <button
                    type="button"
                    className="btn btn-light w-100 border d-flex align-items-center justify-content-center gap-2"
                    onClick={googleLoginHandler}
                    style={{ padding: '10px' }}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" fillRule="evenodd" />
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" fillRule="evenodd" />
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" fillRule="evenodd" />
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" fillRule="evenodd" />
                    </svg>
                    {t('signin_google', 'Sign in with Google')}
                </button>

                <p className="text-center mt-3">
                    {t('no_account', 'Don’t have an account?')} <Link to="/register">{t('create_one', 'Create one')}</Link>
                </p>

            </form>
        </div>
    );
};

export default LoginPage;
