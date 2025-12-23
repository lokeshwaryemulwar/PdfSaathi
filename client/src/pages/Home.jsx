import React from 'react';
import Hero from '../components/home/Hero';
import FeatureGrid from '../components/home/FeatureGrid';
import Benefits from '../components/home/Benefits';
import CoreValues from '../components/home/CoreValues';
import CallToAction from '../components/home/CallToAction';
import LatestArticles from '../components/home/LatestArticles';
import SEO from '../components/layout/SEO';
import AdUnit from '../components/ads/AdUnit';

const Home = () => {
    return (
        <main className="home-page">
            <SEO
                title="Home"
                description="PDF Saathi is your free, all-in-one online PDF tool. Merge, split, compress, and convert PDFs securely and easily."
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

                    {/* Homepage Ad Banner */}
                    <div style={{ maxWidth: '728px', margin: '0 auto' }}>
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
