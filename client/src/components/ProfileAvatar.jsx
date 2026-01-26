import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfileAvatar = ({ avatarPreview, handleImageUpload, uploading }) => {
    const { t } = useTranslation();

    return (
        <div className="profile-section text-center mb-5">
            <div className="profile-pic-container mx-auto mb-3" style={{ border: '5px solid var(--bg-light)' }}>
                <img
                    src={avatarPreview}
                    id="profilePreview"
                    alt="User Photo"
                    className="img-fluid"
                />
            </div>
            <label htmlFor="uploadPhotoInput" className="btn btn-warning text-white" style={{ cursor: 'pointer', background: 'var(--gold-gradient)' }}>
                <i className="fas fa-camera me-2"></i>
                {uploading ? 'Processing...' : t('upload_photo', 'Upload Photo')}
            </label>
            <input
                type="file"
                id="uploadPhotoInput"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ProfileAvatar;
