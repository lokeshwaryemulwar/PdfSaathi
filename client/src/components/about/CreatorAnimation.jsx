import React from 'react';
import './CreatorAnimation.css';

const CreatorAnimation = () => {
    return (
        <div className="creator-anim-wrapper">
            {/* Floating particles */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>

            {/* Code symbols */}
            <div className="code-symbol" style={{ top: '15%', left: '15%' }}>&lt;/&gt;</div>
            <div className="code-symbol" style={{ top: '25%', right: '20%' }}>&#123;&#125;</div>
            <div className="code-symbol" style={{ bottom: '20%', left: '25%' }}>()</div>

            {/* Person illustration */}
            <div className="person-container">
                {/* Head */}
                <div className="person-head">
                    <div className="person-face">
                        <div style={{ marginBottom: '5px' }}>
                            <span className="person-eye"></span>
                            <span className="person-eye"></span>
                        </div>
                        <div className="person-smile"></div>
                    </div>
                </div>

                {/* Body */}
                <div className="person-body">
                    {/* Arms */}
                    <div className="person-arm left"></div>
                    <div className="person-arm right"></div>

                    {/* Laptop */}
                    <div className="laptop"></div>
                </div>
            </div>

            {/* Name badge */}
            <div className="name-badge">Lucky</div>
        </div>
    );
};

export default CreatorAnimation;
