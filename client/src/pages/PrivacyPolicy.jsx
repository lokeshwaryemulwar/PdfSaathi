import React from 'react';
import Card from '../components/ui/Card';
import DynamicSEO from '../components/layout/DynamicSEO';
import './ContentPage.css';

const PrivacyPolicy = () => {
    return (
        <div className="container content-page">
            <DynamicSEO
                title="Privacy Policy - PDF Saathi"
                description="Learn how PDF Saathi protects your privacy and handles your data. We respect your privacy and are committed to protecting your personal information."
            />
            <section className="about-hero">
                <h1 className="page-title">Privacy Policy</h1>
            </section>

            <Card style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '2rem auto' }}>
                <div style={{ lineHeight: '1.8', color: 'var(--text-primary)' }}>
                    <h2>Introduction</h2>
                    <p>
                        Welcome to PDF Saathi. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you about how we look after your personal data when you visit our
                        website and tell you about your privacy rights.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Information We Collect</h2>
                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem' }}>Personal Information</h3>
                    <p>When you create an account, we collect:</p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Email address</li>
                        <li>Name (optional)</li>
                        <li>Password (encrypted)</li>
                    </ul>

                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem' }}>Usage Data</h3>
                    <p>We automatically collect certain information when you visit our website:</p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>Pages visited and time spent</li>
                        <li>IP address</li>
                    </ul>

                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem' }}>File Data</h3>
                    <p>
                        When you use our PDF tools, we temporarily process your files. <strong>Important:</strong> All uploaded
                        files are automatically deleted from our servers immediately after processing is complete. We do not
                        store, analyze, or share your files.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Provide and maintain our services</li>
                        <li>Process your PDF files</li>
                        <li>Manage your account</li>
                        <li>Send you important updates</li>
                        <li>Improve our services</li>
                        <li>Respond to your inquiries</li>
                    </ul>

                    <h2 style={{ marginTop: '2rem' }}>Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Password encryption using industry-standard bcrypt</li>
                        <li>Secure JWT token authentication</li>
                        <li>HTTPS encryption for data transmission</li>
                        <li>Automatic file deletion after processing</li>
                        <li>Regular security audits</li>
                    </ul>

                    <h2 style={{ marginTop: '2rem' }}>Data Retention</h2>
                    <p>
                        <strong>Account Data:</strong> We retain your account information until you delete your account.
                    </p>
                    <p>
                        <strong>Uploaded Files:</strong> All files are deleted immediately after processing (typically within seconds).
                    </p>
                    <p>
                        <strong>Contact Forms:</strong> Contact form submissions are retained for customer service purposes.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Object to data processing</li>
                        <li>Data portability</li>
                        <li>Withdraw consent</li>
                    </ul>

                    <h2 style={{ marginTop: '2rem' }}>Third-Party Services</h2>
                    <p>
                        We do not sell, trade, or share your personal information with third parties. We may use third-party
                        services for analytics and hosting, but they are bound by strict confidentiality agreements.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Cookies</h2>
                    <p>
                        We use cookies to enhance your experience. For detailed information, please see our{' '}
                        <a href="/cookies" style={{ color: 'var(--primary)' }}>Cookie Policy</a>.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Children's Privacy</h2>
                    <p>
                        Our services are not directed to children under 13. We do not knowingly collect personal information
                        from children under 13.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Changes to This Policy</h2>
                    <p>
                        We may update this privacy policy from time to time. We will notify you of any changes by posting
                        the new policy on this page and updating the "Last updated" date.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at{' '}
                        <a href="/contact" style={{ color: 'var(--primary)' }}>our contact page</a>.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default PrivacyPolicy;
