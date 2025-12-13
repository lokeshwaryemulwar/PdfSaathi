import React from 'react';
import Hero from '../components/home/Hero';
import FeatureGrid from '../components/home/FeatureGrid';
import Benefits from '../components/home/Benefits';
import CoreValues from '../components/home/CoreValues';
import CallToAction from '../components/home/CallToAction';

const Home = () => {
    return (
        <div className="home-page">
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
                </div>
            </div>
            <Benefits />
            <CoreValues />
            <CallToAction />
        </div>
    );
};

export default Home;
