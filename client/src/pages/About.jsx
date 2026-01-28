import React from 'react';
import AboutAnimation from '../components/about/AboutAnimation';
import DynamicSEO from '../components/layout/DynamicSEO';
import './ContentPage.css';



const About = () => {
    const aboutSchema = {
        "@type": "AboutPage",
        "name": "About PDF Saathi",
        "description": "Information about PDF Saathi, the mission, and creator Lokeshwar Yemulwar.",
        "url": "https://www.pdfsaathi.in/about"
    };

    return (
        <div className="container content-page">
            <DynamicSEO
                title="About PDF Saathi - Your Trusted PDF Tool"
                description="Learn about PDF Saathi's mission to make document tools accessible for everyone. Privacy-first, lightning-fast, and always free PDF tools."
            />

            <section className="about-hero animate-fade-in">
                <h1 className="page-title">Empowering productivity, protecting privacy.</h1>
                <p className="page-subtitle">
                    PDF Saathi was born from a simple belief: Professional-grade document tools should be accessible to everyone, without compromising on security.
                </p>
            </section>

            <div className="about-content">
                <div className="about-image-wrapper animate-fade-in animate-delay-100">
                    <AboutAnimation />
                </div>

                <div className="text-content animate-fade-in animate-delay-200">
                    <h2>The Founder's Story</h2>
                    <p>
                        Hello! I'm <strong>Lokeshwar Yemulwar (Lucky)</strong>, the lead developer and creator of PDF Saathi.
                    </p>
                    <p>
                        As a Full Stack Developer specializing in secure web architectures, I noticed a troubling trend in the PDF market. Users were forced to choose between expensive desktop software like Adobe Acrobat or shady online tools that uploaded their sensitive files to unknown servers.
                    </p>
                    <p>
                        I built PDF Saathi to bridge this gap. Using advanced <strong>client-side processing</strong> and <strong>secure cloud functions</strong>, we deliver enterprise-level manipulation tools that respect your data sovereignty.
                    </p>
                </div>
            </div>



            <section className="values-section animate-fade-in animate-delay-300" style={{ marginTop: '4rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Core Values</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <span className="value-icon">🔒</span>
                        <h3>Privacy by Design</h3>
                        <p>We operate on a strict "No-Logs" policy. Files are automatically deleted from our servers after 1 hour.</p>
                    </div>
                    <div className="value-card">
                        <span className="value-icon">⚡</span>
                        <h3>Performance</h3>
                        <p>We optimize every line of code to ensure your 100-page PDF processes in seconds, not minutes.</p>
                    </div>
                    <div className="value-card">
                        <span className="value-icon">🎓</span>
                        <h3>Education</h3>
                        <p>We believe in empowering users. That's why we provide free, in-depth guides on managing digital documents.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
