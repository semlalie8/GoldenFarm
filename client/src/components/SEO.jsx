import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ title, description, keywords, image, url, type = 'website', schema }) => {
    const { t } = useTranslation();
    const siteTitle = "GoldenFarm - Data-Driven Agriculture & Crowdfunding";

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name="description" content={description || t('seo_default_description', 'Invest in sustainable agriculture campaigns with data-driven insights.')} />
            <meta name="keywords" content={keywords || "agriculture, crowdfunding, investment, farming, sustainability"} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url || window.location.href} />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image || '/logo.png'} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url || window.location.href} />
            <meta property="twitter:title" content={title || siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image || '/logo.png'} />

            {/* JSON-LD Schema (Structured Data) */}
            {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
        </Helmet>
    );
};

export default SEO;
