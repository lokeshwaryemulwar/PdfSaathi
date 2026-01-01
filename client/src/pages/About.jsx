import React from 'react';
import AboutAnimation from '../components/about/AboutAnimation';
import './ContentPage.css';

import SEO from '../components/layout/SEO';

const About = () => {
    const aboutSchema = {
        "@type": "AboutPage",
        "name": "About PDF Saathi",
        "description": "Information about PDF Saathi, the mission, and creator Lokeshwar Yemulwar.",
        "url": "https://pdfsaathi.in/about"
    };

    return (
        <div className="container content-page">
            <SEO
                title="About Us - PDF Saathi"
                description="Meet Lokeshwar Yemulwar (Lucky), the creator of PDF Saathi, and learn about our mission to make PDF tools free and accessible."
                url="https://pdfsaathi.in/about"
                schema={aboutSchema}
            />

            <section className="about-hero animate-fade-in">
                <h1 className="page-title">Making document tools accessible for everyone.</h1>
                <p className="page-subtitle">
                    It started with a simple observation: most PDF software was either too expensive, too complicated, or unsafe. I wanted to build something better.
                </p>
            </section>

            <div className="about-content">
                <div className="about-image-wrapper animate-fade-in animate-delay-100">
                    <AboutAnimation />
                </div>

                <div className="text-content animate-fade-in animate-delay-200">
                    <h2>My Mission</h2>
                    <p>
                        Hello! I'm <strong>Lokeshwar Yemulwar (Lucky)</strong>.
                    </p>
                    <p>
                        My goal with PDF Saathi is to create a "one-click" ecosystem where anyone—from students to enterprise executives—can manage their digital paperwork instantly, from any device, with complete peace of mind regarding their data privacy.
                    </p>
                    <p>
                        Unlike other tools that force you to register or pay for basic features, PDF Saathi is built on the philosophy of <strong>Open Access</strong>. I adhere to a strict privacy policy: your files are yours, and I ensure they stay that way by deleting them from the servers immediately after your work is done.
                    </p>
                </div>
            </div>

            <section className="values-section animate-fade-in animate-delay-300">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why PDF Saathi?</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <span className="value-icon">🔒</span>
                        <h3>Privacy First</h3>
                        <p>We use SSL encryption and auto-delete protocols. Your files are never sold or analyzed.</p>
                    </div>
                    <div className="value-card">
                        <span className="value-icon">⚡</span>
                        <h3>Lightning Fast</h3>
                        <p>Powered by modern cloud infrastructure and client-side processing for instant results.</p>
                    </div>
                    <div className="value-card">
                        <span className="value-icon">💎</span>
                        <h3>Always Free</h3>
                        <p>We rely on minimal ads to keep the lights on, so you don't have to pay a subscription.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
