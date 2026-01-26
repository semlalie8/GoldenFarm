import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/dashboard');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (password !== confirmPassword) {
            setError(t('passwords_do_not_match', 'Passwords do not match'));
            return;
        }

        try {
            const { data } = await axios.post('/api/auth/register', {
                name: `${firstName} ${lastName}`,
                email,
                password,
                phone,
                language: i18n.language
            });
            dispatch(setCredentials(data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const googleLoginHandler = () => {
        // Placeholder for Google Login logic
        console.log("Google Signup Clicked");
    };

    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    return (
        <div dir={currentDir} className="auth-wrapper">
            <h1>{t('signup_title', 'Create Account')}</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={submitHandler}>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">
                            {t('first_name', 'First Name')} <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">
                            {t('last_name', 'Last Name')} <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        {t('phone_number', 'Phone Number')} <span className="required-star">*</span>
                    </label>
                    <input
                        type="tel"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

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
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        {t('confirm_password_label', 'Confirm Password')} <span className="required-star">*</span>
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-gold w-100 mt-3">{t('signup_btn', 'Create Account')}</button>

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
                    {t('signup_google', 'Sign up with Google')}
                </button>

                <p className="text-center mt-3">
                    {t('have_account', 'Already have an account?')} <Link to="/login">{t('signin_link', 'Sign In')}</Link>
                </p>

            </form>
        </div>
    );
};

export default RegisterPage;
