import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DynamicSEO = ({ title, description }) => {
    const location = useLocation();

    useEffect(() => {
        // 1. Update Canonical URL
        const canonicalUrl = `https://pdfsaathi.in${location.pathname}`;
        let link = document.querySelector("link[rel='canonical']");

        if (!link) {
            link = document.createElement('link');
            link.rel = 'canonical';
            document.head.appendChild(link);
        }
        link.href = canonicalUrl;

        // 2. Update Title
        if (title) {
            document.title = `${title} - PDF Saathi`;
        }

        // 3. Update Description
        if (description) {
            let metaDesc = document.querySelector("meta[name='description']");
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = description;
        }

        // 4. Update Open Graph URL
        let ogUrl = document.querySelector("meta[property='og:url']");
        if (ogUrl) {
            ogUrl.content = canonicalUrl;
        }

    }, [location.pathname, title, description]);

    return null; // This component doesn't render anything visible
};

export default DynamicSEO;
