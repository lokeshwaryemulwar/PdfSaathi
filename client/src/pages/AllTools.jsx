import React from 'react';
import FeatureGrid from '../components/home/FeatureGrid';
import DynamicSEO from '../components/layout/DynamicSEO';



const AllTools = () => {
    return (
        <div className="container" style={{ padding: '4rem 0 5rem' }}>
            <DynamicSEO
                title="All PDF Tools - Complete Toolkit"
                description="Explore our complete collection of PDF utilities. Convert, edit, merge, split, compress, and manage your documents with ease."
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
