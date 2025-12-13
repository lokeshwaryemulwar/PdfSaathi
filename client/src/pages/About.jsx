import React from 'react';
import AboutAnimation from '../components/about/AboutAnimation';
import './ContentPage.css';

const About = () => {
    return (
        <div className="container content-page">
            <section className="about-hero">
                <h1 className="page-title">Making document tools accessible for everyone.</h1>
                <p className="page-subtitle">
                    It started with a simple observation: most PDF software was either too expensive, too complicated, or unsafe. I wanted to build something better.
                </p>
            </section>

            <div className="about-content">
                <div className="about-image-wrapper">
                    <AboutAnimation />
                </div>

                <div className="text-content">
                    <h2>My Mission</h2>
                    <p>
                        My goal is to create a "one-click" ecosystem where anyone—from students to enterprise executives—can manage their digital paperwork instantly, from any device, with complete peace of mind regarding their data privacy.
                    </p>
                    <p>
                        I adhere to a strict privacy policy. Your files are yours, and I ensure they stay that way by deleting them from the servers immediately after your work is done.
                    </p>
                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>About Me</h3>
                    <p>
                        Hi, I'm <strong>Lucky</strong>, the creator of PDF Saathi. As a developer passionate about making technology accessible, I built this platform to solve real-world document management challenges. Every feature you see here was designed with simplicity, security, and user experience in mind.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
