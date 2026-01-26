import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation();
    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post('/api/auth/forgotpassword', { email });
            setMessage(data.data || 'Password reset email sent! Check your email for the reset link.');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div dir={currentDir} className="auth-wrapper">
            <h1>{t('forgot_password', 'Forgot Password')}</h1>
            <p className="text-muted mb-4">
                {t('forgot_password_subtitle', 'Enter your email address and we will send you a link to reset your password.')}
            </p>

            {message && <div className="alert alert-success">{message}</div>}
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
                        placeholder={t('enter_email', 'Enter your email')}
                    />
                </div>

                <button type="submit" className="btn-gold w-100 mt-3" disabled={loading}>
                    {loading ? t('sending', 'Sending...') : t('send_reset_link', 'Send Reset Link')}
                </button>

                <p className="text-center mt-3">
                    <Link to="/login">{t('back_to_login', 'Back to Login')}</Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
