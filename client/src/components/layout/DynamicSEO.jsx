import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DynamicSEO = ({ title, description, image }) => {
    const location = useLocation();

    useEffect(() => {
        // 1. Always Update Canonical URL (critical for SEO)
        const canonicalUrl = `https://www.pdfsaathi.in${location.pathname}`;
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
        if (!ogUrl) {
            ogUrl = document.createElement('meta');
            ogUrl.setAttribute('property', 'og:url');
            document.head.appendChild(ogUrl);
        }
        ogUrl.content = canonicalUrl;

        // 5. Update Open Graph Title
        if (title) {
            let ogTitle = document.querySelector("meta[property='og:title']");
            if (!ogTitle) {
                ogTitle = document.createElement('meta');
                ogTitle.setAttribute('property', 'og:title');
                document.head.appendChild(ogTitle);
            }
            ogTitle.content = `${title} - PDF Saathi`;
        }

        // 6. Update Open Graph Description
        if (description) {
            let ogDesc = document.querySelector("meta[property='og:description']");
            if (!ogDesc) {
                ogDesc = document.createElement('meta');
                ogDesc.setAttribute('property', 'og:description');
                document.head.appendChild(ogDesc);
            }
            ogDesc.content = description;
        }

        // 7. Update Open Graph Image
        if (image) {
            let ogImage = document.querySelector("meta[property='og:image']");
            if (!ogImage) {
                ogImage = document.createElement('meta');
                ogImage.setAttribute('property', 'og:image');
                document.head.appendChild(ogImage);
            }
            // Ensure absolute URL
            ogImage.content = image.startsWith('http') ? image : `https://www.pdfsaathi.in${image}`;
        }

        // 8. Update Twitter Card URL
        let twitterUrl = document.querySelector("meta[property='twitter:url']");
        if (!twitterUrl) {
            twitterUrl = document.createElement('meta');
            twitterUrl.setAttribute('property', 'twitter:url');
            document.head.appendChild(twitterUrl);
        }
        twitterUrl.content = canonicalUrl;

        // 9. Update Twitter Card Image
        if (image) {
            let twitterImage = document.querySelector("meta[property='twitter:image']");
            if (!twitterImage) {
                twitterImage = document.createElement('meta');
                twitterImage.setAttribute('property', 'twitter:image');
                document.head.appendChild(twitterImage);
            }
            twitterImage.content = image.startsWith('http') ? image : `https://www.pdfsaathi.in${image}`;
        }

    }, [location.pathname, title, description, image]);

    return null; // This component doesn't render anything visible
};

export default DynamicSEO;
