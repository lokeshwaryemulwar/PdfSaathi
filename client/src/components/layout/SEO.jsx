import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, url = 'https://pdfsaathi.in' }) {
    const siteTitle = 'PDF Saathi - Free PDF Converter & Editor';
    const finalTitle = title ? `${title} | PDF Saathi` : siteTitle;
    const finalDescription = description || 'Free online PDF tools to merge, split, compress, and convert PDF files. Easy, fast, and secure.';

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDescription} />
        </Helmet>
    );
}
