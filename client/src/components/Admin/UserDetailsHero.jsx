import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserDetailsHero = ({ user, currentDir }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="dashboard-hero">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <div className="d-flex align-items-center">
                            <img
                                src={user.avatar || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                                alt={user.name}
                                className="rounded-circle me-3"
                                style={{ width: '80px', height: '80px', objectFit: 'cover', border: '3px solid white' }}
                            />
                            <div>
                                <h1 className="dashboard-title mb-0">{user.name}</h1>
                                <p className="dashboard-subtitle mb-0">{user.email}</p>
                                <span className={`badge mt-2 ${user.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                                    {user.role.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 text-end">
                        <button
                            onClick={() => navigate('/admin/user-info')}
                            className="btn btn-outline-light"
                        >
                            <i className={`fas fa-arrow-${currentDir === 'rtl' ? 'right' : 'left'} me-2`}></i>
                            {t('back_to_list', 'Back to List')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsHero;
