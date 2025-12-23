import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, url = 'https://pdfsaathi.in', breadcrumbs = null, schema = null }) {
    const siteTitle = 'PDF Saathi - Free PDF Converter & Editor';
    const finalTitle = title ? `${title} | PDF Saathi` : siteTitle;
    const finalDescription = description || 'Free online PDF tools to merge, split, compress, and convert PDF files. Easy, fast, and secure.';

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content="pdf converter, merge pdf, split pdf, compress pdf, pdf to word, word to pdf, free pdf tools, online pdf editor, pdf compressor, combine pdf" />
            <meta name="author" content="PDF Saathi" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content="https://pdfsaathi.in/logo.png" />
            <meta property="og:site_name" content="PDF Saathi" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content="https://pdfsaathi.in/logo.png" />

            {/* Structured Data (JSON-LD) for Google Sitelinks */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": [
                        // Organization Schema (for logo in search results)
                        {
                            "@type": "Organization",
                            "@id": "https://pdfsaathi.in/#organization",
                            "name": "PDF Saathi",
                            "url": "https://pdfsaathi.in",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://pdfsaathi.in/logo.png",
                                "width": 512,
                                "height": 512
                            },
                            "description": "Free online PDF tools to merge, split, compress, convert, and edit PDF files. Fast, secure, and no watermarks.",
                            "sameAs": [
                                "https://www.linkedin.com/company/pdfsaathi",
                                "https://twitter.com/pdfsaathi"
                            ]
                        },
                        // Breadcrumb Schema
                        breadcrumbs ? {
                            "@type": "BreadcrumbList",
                            "itemListElement": breadcrumbs.map((item, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "name": item.name,
                                "item": item.url
                            }))
                        } : null,
                        // Custom Schema (e.g., AboutPage, ContactPage)
                        ...(Array.isArray(schema) ? schema : [schema])
                    ].filter(Boolean)
                })}
            </script>
        </Helmet>
    );
}
