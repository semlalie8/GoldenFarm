import React from 'react';
import { useTranslation } from 'react-i18next';
import AboutHero from '../components/About/AboutHero';
import AboutStory from '../components/About/AboutStory';
import AboutServices from '../components/About/AboutServices';

const AboutPage = () => {
    const { i18n } = useTranslation();
    const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    return (
        <div className="about-page-body" dir={currentDir}>
            <AboutHero currentDir={currentDir} />

            <div className="container py-5">
                <AboutStory currentDir={currentDir} />
            </div>

            <AboutServices currentDir={currentDir} />
        </div>
    );
};

export default AboutPage;
