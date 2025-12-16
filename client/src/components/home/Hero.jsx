import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import HeroAnimation from './HeroAnimation';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="hero">
            <div className="container hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Making PDF Management <br />
                        <span className="text-gradient">Simple & Secure.</span>
                    </h1>
                    <p className="hero-subtitle">
                        We build tools that help millions of people get their work done faster, without compromising on privacy. Your documents, optimized for the modern web.
                    </p>
                    <div className="hero-actions">
                        <Button size="lg" onClick={() => navigate('/tools')}>
                            Start Converting Now
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
                            Contact Us
                        </Button>
                    </div>
                    <div className="hero-features">
                        <span className="hero-feature-item">
                            <span className="check-icon">✓</span> No installation required
                        </span>
                        <span className="hero-feature-item">
                            <span className="check-icon">✓</span> 256-bit SSL Encryption
                        </span>
                    </div>
                </div>
                <div className="hero-image">
                    <HeroAnimation />
                </div>
            </div>
        </section>
    );
};

export default Hero;
