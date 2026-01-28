import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeatureGrid from '../components/home/FeatureGrid';
import Benefits from '../components/home/Benefits';
import CoreValues from '../components/home/CoreValues';
import CallToAction from '../components/home/CallToAction';
import LatestArticles from '../components/home/LatestArticles';
import DynamicSEO from '../components/layout/DynamicSEO';

import AdUnit from '../components/ads/AdUnit';

const Home = () => {
    return (
        <main className="home-page">
            <DynamicSEO
                title="Free Online PDF Tools - Merge, Split, Compress & Convert"
                description="PDF Saathi offers the best free online PDF tools to merge, split, compress, and convert PDF files. Secure, fast, and no installation required. Try it now!"
            />

            <Hero />
            <div className="container">
                <div style={{ padding: '4rem 0 2rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>
                        All PDF Tools
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                        Everything you need to be productive with your documents.
                    </p>
                    <FeatureGrid limit={12} /> {/* Show top 12 or all */}

                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link to="/tools">
                            <button className="btn btn-outline" style={{ padding: '0.75rem 2rem', borderRadius: '9999px', border: '1px solid #d1d5db', background: 'transparent', cursor: 'pointer', fontWeight: '500' }}>
                                View All Tools
                            </button>
                        </Link>
                    </div>

                    {/* Homepage Ad Banner */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '0 auto', overflow: 'hidden' }}>
                        <AdUnit slot="1234567890" style={{ marginBottom: '2rem' }} />
                    </div>
                </div>
            </div>
            <Benefits />
            <CoreValues />
            <LatestArticles />
            <CallToAction />
        </main>
    );
};

export default Home;
