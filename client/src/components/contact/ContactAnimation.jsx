import React from 'react';
import { Headphones } from 'lucide-react';
import './ContactAnimation.css';

const ContactAnimation = () => {
    return (
        <div className="contact-anim-wrapper">
            {/* Background glow */}
            <div className="contact-bg-glow"></div>

            {/* Main envelope */}
            <div className="contact-envelope">
                <div className="envelope-flap"></div>
                <div className="envelope-letter">
                    <div className="letter-line"></div>
                    <div className="letter-line short"></div>
                    <div className="letter-line"></div>
                </div>
            </div>

            {/* Floating chat bubbles */}
            <div className="chat-bubble bubble-1"></div>
            <div className="chat-bubble bubble-2"></div>
            <div className="chat-bubble bubble-3"></div>

            {/* Notification dots */}
            <div className="notification-dot dot-1"></div>
            <div className="notification-dot dot-2"></div>

            {/* Headset icon */}
            <div className="contact-headset">
                <Headphones size={24} color="#667eea" />
            </div>
        </div>
    );
};

export default ContactAnimation;
