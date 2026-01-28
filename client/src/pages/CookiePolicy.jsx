import React from 'react';
import Card from '../components/ui/Card';
import DynamicSEO from '../components/layout/DynamicSEO';
import './ContentPage.css';

const CookiePolicy = () => {
    return (
        <div className="container content-page">
            <DynamicSEO
                title="Cookie Policy - PDF Saathi"
                description="Learn about how PDF Saathi uses cookies to enhance your experience. Understand what cookies we use and how to manage them."
            />
            <section className="about-hero">
                <h1 className="page-title">Cookie Policy</h1>
            </section>

            <Card style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '2rem auto' }}>
                <div style={{ lineHeight: '1.8', color: 'var(--text-primary)' }}>
                    <h2>What Are Cookies?</h2>
                    <p>
                        Cookies are small text files that are placed on your device when you visit our website.
                        They help us provide you with a better experience by remembering your preferences and
                        understanding how you use our service.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>How We Use Cookies</h2>
                    <p>PDF Saathi uses cookies for the following purposes:</p>

                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem' }}>Essential Cookies</h3>
                    <p>
                        These cookies are necessary for the website to function properly. They enable core functionality
                        such as:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li><strong>Authentication:</strong> Keep you logged in to your account</li>
                        <li><strong>Security:</strong> Protect against unauthorized access</li>
                        <li><strong>Session Management:</strong> Remember your actions during a browsing session</li>
                    </ul>
                    <p style={{
                        padding: '1rem',
                        background: '#fef3c7',
                        borderRadius: '8px',
                        fontSize: '0.9375rem'
                    }}>
                        <strong>Note:</strong> These cookies cannot be disabled as they are essential for the service to work.
                    </p>

                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem' }}>Functional Cookies</h3>
                    <p>
                        These cookies allow us to remember your preferences and provide enhanced features:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Language preferences</li>
                        <li>Theme settings (if applicable)</li>
                        <li>Recently used tools</li>
                    </ul>

                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem' }}>Analytics Cookies</h3>
                    <p>
                        We may use analytics cookies to understand how visitors interact with our website:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Pages visited</li>
                        <li>Time spent on pages</li>
                        <li>Features used most frequently</li>
                        <li>Error tracking</li>
                    </ul>
                    <p>
                        This information helps us improve our services and user experience.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Local Storage</h2>
                    <p>
                        In addition to cookies, we use browser local storage to:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li><strong>Store authentication tokens:</strong> Keep you logged in securely</li>
                        <li><strong>Save user preferences:</strong> Remember your settings</li>
                        <li><strong>Cache data:</strong> Improve performance</li>
                    </ul>

                    <h2 style={{ marginTop: '2rem' }}>Third-Party Cookies</h2>
                    <p>
                        We minimize the use of third-party cookies. When used, they may include:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Analytics providers (e.g., Google Analytics)</li>
                        <li>Content delivery networks (CDNs)</li>
                    </ul>
                    <p>
                        These third parties have their own privacy policies and cookie policies.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Managing Cookies</h2>
                    <p>
                        You have several options for managing cookies:
                    </p>

                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem' }}>Browser Settings</h3>
                    <p>
                        Most web browsers allow you to control cookies through their settings:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Block all cookies</li>
                        <li>Block third-party cookies only</li>
                        <li>Delete cookies after each session</li>
                        <li>View and delete individual cookies</li>
                    </ul>

                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem' }}>Browser-Specific Instructions</h3>
                    <div style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <p><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</p>
                        <p><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</p>
                        <p><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</p>
                        <p><strong>Edge:</strong> Settings → Cookies and site permissions</p>
                    </div>

                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.5rem',
                        background: '#fee2e2',
                        borderRadius: '12px',
                        borderLeft: '4px solid #dc2626'
                    }}>
                        <p style={{ margin: 0, fontWeight: '600', color: '#dc2626' }}>
                            ⚠️ Warning: Blocking essential cookies may prevent you from using certain features of
                            PDF Saathi, including logging in and using our tools.
                        </p>
                    </div>

                    <h2 style={{ marginTop: '2rem' }}>Cookie Duration</h2>
                    <p>
                        Our cookies have different lifespans:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                        <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 7-30 days)</li>
                        <li><strong>Authentication Tokens:</strong> Valid for 7 days or until logout</li>
                    </ul>

                    <h2 style={{ marginTop: '2rem' }}>Updates to This Policy</h2>
                    <p>
                        We may update this Cookie Policy from time to time to reflect changes in our practices or
                        for legal reasons. The "Last updated" date at the top indicates when the policy was last revised.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Your Consent</h2>
                    <p>
                        By using PDF Saathi, you consent to our use of cookies as described in this policy.
                        If you do not agree, please adjust your browser settings or discontinue use of our service.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Contact Us</h2>
                    <p>
                        If you have questions about our use of cookies, please contact us through our{' '}
                        <a href="/contact" style={{ color: 'var(--primary)' }}>contact page</a>.
                    </p>

                    <div style={{
                        marginTop: '3rem',
                        padding: '1.5rem',
                        background: 'var(--surface-alt)',
                        borderRadius: '12px'
                    }}>
                        <h3 style={{ marginTop: 0, fontSize: '1.125rem' }}>Related Policies</h3>
                        <p style={{ marginBottom: '0.5rem' }}>
                            For more information about how we protect your data, please see:
                        </p>
                        <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                            <li>
                                <a href="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</a>
                            </li>
                            <li>
                                <a href="/terms" style={{ color: 'var(--primary)' }}>Terms of Service</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CookiePolicy;
