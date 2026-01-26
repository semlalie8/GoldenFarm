import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { resetToken } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentDir = i18n.language === 'ar' || i18n.language === 'zgh' ? 'rtl' : 'ltr';

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios.put(
                `/api/auth/resetpassword/${resetToken}`,
                { password }
            );
            setMessage(data.data || 'Password reset successful!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div dir={currentDir} className="auth-wrapper">
            <h1>{t('reset_password', 'Reset Password')}</h1>
            <p className="text-muted mb-4">
                {t('reset_password_subtitle', 'Enter your new password below.')}
            </p>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label className="form-label">
                        {t('new_password', 'New Password')} <span className="required-star">*</span>
                    </label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder={t('enter_new_password', 'Enter new password')}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                        </button>
                    </div>
                    <small className="text-muted">
                        {t('password_requirements', 'At least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character')}
                    </small>
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        {t('confirm_password', 'Confirm Password')} <span className="required-star">*</span>
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder={t('confirm_new_password', 'Confirm new password')}
                    />
                </div>

                <button type="submit" className="btn-gold w-100 mt-3" disabled={loading}>
                    {loading ? t('resetting', 'Resetting...') : t('reset_password_btn', 'Reset Password')}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
