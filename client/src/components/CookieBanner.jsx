import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import './CookieBanner.css';

const CookieBanner = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            // Show banner after a short delay for better UX
            setTimeout(() => {
                setShowBanner(true);
            }, 1000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setShowBanner(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookieConsent', 'rejected');
        setShowBanner(false);
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="cookie-banner">
            <div className="cookie-banner-content">
                <div className="cookie-banner-text">
                    <h3>
                        <Cookie size={24} color="var(--primary)" />
                        We use cookies
                    </h3>
                    <p>
                        We use cookies to enhance your browsing experience, serve personalized content,
                        and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                        Read our <Link to="/cookies">Cookie Policy</Link> and{' '}
                        <Link to="/privacy">Privacy Policy</Link> to learn more.
                    </p>
                </div>
                <div className="cookie-banner-actions">
                    <button className="cookie-reject" onClick={handleReject}>
                        Reject
                    </button>
                    <button className="cookie-accept" onClick={handleAccept}>
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
