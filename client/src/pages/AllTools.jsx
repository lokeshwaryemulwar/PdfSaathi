import React from 'react';
import FeatureGrid from '../components/home/FeatureGrid';

import SEO from '../components/layout/SEO';

const AllTools = () => {
    return (
        <div className="container" style={{ padding: '4rem 0 5rem' }}>
            <SEO
                title="All PDF Tools"
                description="Explore our complete collection of free PDF utilities. Convert, edit, and manage your documents with ease."
                url="https://pdfsaathi.in/tools"
            />
            <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
                <h1 style={{ marginBottom: '1rem' }}>All PDF Tools</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Explore our complete collection of PDF utilities. Convert, edit, and manage your documents with ease.
                </p>
            </div>

            <FeatureGrid />
        </div>
    );
};

export default AllTools;
