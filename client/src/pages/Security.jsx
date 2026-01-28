import React from 'react';
import DynamicSEO from '../components/layout/DynamicSEO';
import Card from '../components/ui/Card';
import './ContentPage.css';

const Security = () => {
    return (
        <div className="container content-page">
            <DynamicSEO
                title="Security & Privacy Center - PDF Saathi"
                description="We take security seriously. Read about our AES-256 encryption, automatic file deletion policy, and strict privacy standards."
            />

            <section className="about-hero animate-fade-in">
                <h1 className="page-title">Your Security is Our Priority</h1>
                <p className="page-subtitle">
                    We process thousands of sensitive documents every day. Here is exactly how we keep them safe.
                </p>
            </section>

            <Card style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '2rem auto' }}>
                <div className="security-content animate-fade-in animate-delay-100" style={{ lineHeight: '1.8', color: 'var(--text-primary)' }}>
                    <section className="security-section">
                        <h2>1. End-to-End Encryption</h2>
                        <p>
                            From the moment you click "Upload" to the moment you click "Download", your files are protected by <strong>256-bit SSL (Secure Socket Layer) encryption</strong>. This is the same level of security used by online banks and government websites.
                        </p>
                        <p>
                            This means that even if a hacker intercepted the data transfer, all they would see is a scrambled mess of unreadable code.
                        </p>
                    </section>

                    <section className="security-section" style={{ marginTop: '2rem' }}>
                        <h2>2. Automatic File Deletion</h2>
                        <p>
                            We operate on a strict "Zero Retention" philosophy for processed files.
                        </p>
                        <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                            <li><strong>Instant Uploads:</strong> Files are uploaded to a temporary secure storage.</li>
                            <li><strong>Processing:</strong> Our servers process the file (merge, split, compress, etc.).</li>
                            <li><strong>1-Hour Limit:</strong> All files (both original and processed) are permanently wiped from our servers 60 minutes after processing.</li>
                            <li><strong>Why 1 hour?</strong> This gives you enough time to download the file if your internet disconnects, but ensures we don't hold data longer than necessary.</li>
                        </ul>
                    </section>

                    <section className="security-section" style={{ marginTop: '2rem' }}>
                        <h2>3. We Don't Read Your Files</h2>
                        <p>
                            Our processing is entirely automated. There are no humans reading your PDFs.
                            We do not analyze, scan, or mine your document content for advertising purposes.
                            Your tax returns, legal contracts, and personal letters remain private.
                        </p>
                    </section>

                    <section className="security-section" style={{ marginTop: '2rem' }}>
                        <h2>4. Infrastructure Security</h2>
                        <p>
                            PDF Saathi is hosted on world-class cloud infrastructure providers that comply with ISO 27001 standards. Our servers are protected by firewalls and regular security audits.
                        </p>
                    </section>

                    <section className="security-section" style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '12px', marginTop: '3rem' }}>
                        <h2 style={{ marginTop: 0 }}>Report a Vulnerability</h2>
                        <p>
                            Are you a security researcher? If you believe you've found a vulnerability in our system, please contact us immediately. We appreciate the community's help in keeping PDF Saathi safe.
                        </p>
                        <a href="/contact" className="btn btn-primary">Contact Security Team</a>
                    </section>
                </div>
            </Card>
        </div>
    );
};

export default Security;
