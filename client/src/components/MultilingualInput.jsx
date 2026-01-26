import React from 'react';
import { useTranslation } from 'react-i18next';

const MultilingualInput = ({ label, type = 'text', value, onChange, required = false, isTextarea = false }) => {
    const { i18n } = useTranslation();
    const [activeTab, setActiveTab] = React.useState('en');

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'ar', label: 'العربية', flag: '🇲🇦' }
    ];

    const handleChange = (lang, val) => {
        onChange({
            ...value,
            [lang]: val
        });
    };

    return (
        <div className="mb-3">
            <label className="form-label fw-bold">
                {label} {required && <span className="text-danger">*</span>}
            </label>

            {/* Language Tabs */}
            <ul className="nav nav-tabs mb-2">
                {languages.map(lang => (
                    <li className="nav-item" key={lang.code}>
                        <button
                            type="button"
                            className={`nav-link ${activeTab === lang.code ? 'active' : ''}`}
                            onClick={() => setActiveTab(lang.code)}
                            style={{
                                backgroundColor: activeTab === lang.code ? '#cba135' : 'transparent',
                                color: activeTab === lang.code ? 'white' : '#666',
                                border: activeTab === lang.code ? '1px solid #cba135' : '1px solid #ddd'
                            }}
                        >
                            {lang.flag} {lang.label}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Input Fields */}
            <div className="tab-content">
                {languages.map(lang => (
                    <div
                        key={lang.code}
                        className={`tab-pane fade ${activeTab === lang.code ? 'show active' : ''}`}
                        style={{ display: activeTab === lang.code ? 'block' : 'none' }}
                    >
                        {isTextarea ? (
                            <textarea
                                className="form-control"
                                value={value?.[lang.code] || ''}
                                onChange={(e) => handleChange(lang.code, e.target.value)}
                                required={required && lang.code === 'en'}
                                rows={12}
                                placeholder={`Enter ${label.toLowerCase()} in ${lang.label}${lang.code === 'en' ? ' (required)' : ' (optional)'}`}
                                dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                            />
                        ) : (
                            <input
                                type={type}
                                className="form-control"
                                value={value?.[lang.code] || ''}
                                onChange={(e) => handleChange(lang.code, e.target.value)}
                                required={required && lang.code === 'en'}
                                placeholder={`Enter ${label.toLowerCase()} in ${lang.label}${lang.code === 'en' ? ' (required)' : ' (optional)'}`}
                                dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                            />
                        )}
                        {lang.code === 'en' && required && (
                            <small className="text-muted d-block mt-1">English is required</small>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultilingualInput;
