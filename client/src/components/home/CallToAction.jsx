import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import './CallToAction.css';

const CallToAction = () => {
    const navigate = useNavigate();

    return (
        <section className="cta-section">
            <div className="container cta-container">
                <h2 className="cta-title">Ready to get started?</h2>
                <p className="cta-desc">
                    Join millions of users who trust us with their daily document workflows. No account needed for basic tasks.
                </p>
                <div className="cta-actions">
                    <Button variant="secondary" size="lg" onClick={() => navigate('/tools')}>
                        Convert Your First File
                    </Button>

                </div>
            </div>
        </section>
    );
};

export default CallToAction;
