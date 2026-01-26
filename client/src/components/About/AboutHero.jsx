import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutHero = ({ currentDir }) => {
    return (
        <section className="hero" dir={currentDir}>
            <img src="/img/funding_overview.png" alt="Moroccan Farm Landscape" />
            <div className="hero-overlay"></div>
        </section>
    );
};

export default AboutHero;
