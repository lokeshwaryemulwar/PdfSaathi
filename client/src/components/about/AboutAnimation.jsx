import React from 'react';
import { FileText, Lock, Zap, RefreshCw, ArrowRight } from 'lucide-react';
import './AboutAnimation.css';

const AboutAnimation = () => {
    return (
        <div className="about-anim-wrapper">
            {/* Background circles */}
            <div className="bg-circle circle-1"></div>
            <div className="bg-circle circle-2"></div>
            <div className="bg-circle circle-3"></div>

            {/* Sparkles */}
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>

            {/* Central floating documents */}
            <div className="about-content-center">
                <div className="floating-docs">
                    <div className="doc-card doc-1">
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                    </div>
                    <div className="doc-card doc-2">
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                    </div>
                    <div className="doc-card doc-3">
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                    </div>
                </div>
            </div>

            {/* Orbiting tool icons */}
            <div className="tool-orbit orbit-1">
                <FileText size={24} color="#667eea" />
            </div>
            <div className="tool-orbit orbit-2">
                <Lock size={24} color="#10b981" />
            </div>
            <div className="tool-orbit orbit-3">
                <Zap size={24} color="#f59e0b" />
            </div>
            <div className="tool-orbit orbit-4">
                <RefreshCw size={24} color="#8b5cf6" />
            </div>

            {/* Transformation indicator */}
            <div className="transform-arrow">
                <span className="arrow-text">PDF</span>
                <ArrowRight size={20} className="arrow-icon" />
                <span className="arrow-text">Tools</span>
            </div>
        </div>
    );
};

export default AboutAnimation;
