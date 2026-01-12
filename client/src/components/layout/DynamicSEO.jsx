import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const DynamicSEO = ({ title, description }) => {
    const location = useLocation();

    // Construct canonical URL: Base domain + current path
    // Remove query parameters for cleaner SEO
    const canonicalUrl = `https://pdfsaathi.in${location.pathname}`;

    return (
        <Helmet>
            {/* Dynamic Title and Description */}
            {title && <title>{title} - PDF Saathi</title>}
            {description && <meta name="description" content={description} />}

            {/* The Critical Fix: Dynamic Canonical Tag */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Update Open Graph URL as well */}
            <meta property="og:url" content={canonicalUrl} />
            <meta property="twitter:url" content={canonicalUrl} />
        </Helmet>
    );
};

export default DynamicSEO;
