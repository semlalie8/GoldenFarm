import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import ProfileAvatar from '../components/ProfileAvatar';

const ProfilePage = () => {
    const { t } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [profession, setProfession] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const defaultAvatar = '/img/farmer-avatar.png';
    const oldDefaultUrl = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';

    const getInitialAvatar = () => {
        if (userInfo?.avatar && userInfo.avatar !== oldDefaultUrl) {
            return userInfo.avatar;
        }
        return defaultAvatar;
    };

    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(getInitialAvatar());
    const [message, setMessage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (userInfo) {
            // Filter out empty strings to handle potential leading/trailing spaces or double spaces
            const names = userInfo.name ? userInfo.name.split(' ').filter(n => n) : [''];

            // Special handling for names starting with "El" (e.g., "El Mehdi")
            if (names.length >= 2 && names[0].toLowerCase() === 'el') {
                setFirstName(`${names[0]} ${names[1]}`);
                setLastName(names.slice(2).join(' ') || '');
            } else {
                setFirstName(names[0] || '');
                setLastName(names.slice(1).join(' ') || '');
            }

            setEmail(userInfo.email);
            setPhone(userInfo.phone || '');
            setCity(userInfo.city || '');
            setProfession(userInfo.profession || '');

            if (!avatar) {
                setAvatarPreview(userInfo.avatar && userInfo.avatar !== oldDefaultUrl ? userInfo.avatar : defaultAvatar);
            }
        }
    }, [userInfo, avatar]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
                setAvatarPreview(reader.result);
                setUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (!userInfo || !userInfo.token) {
            setMessage('Authentication error. Please logout and login again.');
            return;
        }

        // Trim individual names to ensure clean data
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const payload = {
                name: fullName,
                email,
                phone,
                city,
                profession,
                password
            };

            if (avatar) {
                payload.avatar = avatar;
            }

            const { data } = await axios.put(
                '/api/users/profile',
                payload,
                config
            );
            // Preserve the token as the backend update response might not include it
            const updatedUserInfo = { ...data, token: userInfo.token };
            dispatch(setCredentials(updatedUserInfo));
            setMessage('Profile Updated Successfully');
            setAvatar(''); // Clear upload state to reflect server data
            setPassword('');
            setConfirmPassword('');

            // Reload page to ensure all changes are reflected correctly
            setTimeout(() => {
                window.location.reload();
            }, 1500);

            window.scrollTo(0, 0);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating profile');
        }
    };

    return (
        <div className="centered-container section">
            <h2 className="text-center mb-4">{t('user_profile', 'User Profile')}</h2>

            <div className="profile-card mx-auto p-5" style={{ maxWidth: '800px' }}>
                <div className="text-end mb-3">
                    <button
                        onClick={() => navigate(userInfo?.role === 'admin' ? '/admin' : '/dashboard')}
                        className="btn btn-outline-secondary btn-sm"
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        {t('back_to_dashboard', 'Back to Dashboard')}
                    </button>
                </div>

                {message && (
                    <div className={`alert ${message.toLowerCase().includes('error') ? 'alert-danger' : 'alert-success'} text-center d-flex align-items-center justify-content-center gap-2 mb-4`}>
                        {!message.toLowerCase().includes('error') && <i className="fas fa-check-circle"></i>}
                        {message}
                    </div>
                )}

                <ProfileAvatar
                    avatarPreview={avatarPreview}
                    handleImageUpload={handleImageUpload}
                    uploading={uploading}
                />

                {/* Form Fields */}
                <form onSubmit={submitHandler} autoComplete="off">

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label" htmlFor="firstName">{t('first_name', 'First Name')} <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label" htmlFor="lastName">{t('last_name', 'Last Name')} <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="phone">{t('phone', 'Phone Number')} <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+212 6 00 00 00 00"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">{t('email', 'Email')} <span className="text-danger">*</span></label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="city">{t('city', 'City / Address')}</label>
                        <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Casablanca, Morocco"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label" htmlFor="profession">{t('profession', 'Profession / Notes')}</label>
                        <textarea
                            rows="3"
                            className="form-control"
                            id="profession"
                            name="profession"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>

                    <hr className="my-4" />

                    <h5 className="mb-3 text-muted">{t('change_password', 'Change Password (Optional)')}</h5>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label" htmlFor="newPassword">{t('new_password', 'New Password')}</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="newPassword"
                                    name="newPassword"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" htmlFor="confirmPassword">{t('confirm_password', 'Confirm Password')}</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-gold btn-lg text-white px-5" style={{ background: 'var(--gold-gradient)' }}>
                            {t('save_changes', 'Save Changes')}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default ProfilePage;
