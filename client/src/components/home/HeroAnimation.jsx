import React from 'react';
import { FileText, Shield, Zap, Settings, RefreshCw } from 'lucide-react';
import './HeroAnimation.css';

const HeroAnimation = () => {
    return (
        <div className="hero-anim-wrapper">
            <div className="anim-bg-glow"></div>

            {/* Main Central Document */}
            <div className="anim-main-doc">
                <FileText size={48} color="#4F46E5" strokeWidth={1.5} />
                <div className="doc-lines" style={{ marginTop: '15px' }}></div>
                <div className="doc-lines"></div>
                <div className="doc-lines short"></div>

                {/* Scanning Effect */}
                <div className="scan-beam"></div>
            </div>

            {/* Orbiting Elements */}
            <div className="orbit-icon shield" style={{ animationDelay: '0s', animationDuration: '6s' }}>
                <Shield size={24} color="#10B981" />
            </div>

            <div className="orbit-icon zap" style={{ animationDelay: '1s', animationDuration: '7s' }}>
                <Zap size={24} color="#F59E0B" />
            </div>

            <div className="orbit-icon settings" style={{ animationDelay: '2s', animationDuration: '8s' }}>
                <RefreshCw size={24} color="#6366F1" />
            </div>
        </div>
    );
};

export default HeroAnimation;
