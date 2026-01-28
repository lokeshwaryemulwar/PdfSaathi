import React from 'react';
import Card from '../components/ui/Card';
import DynamicSEO from '../components/layout/DynamicSEO';
import './ContentPage.css';

const TermsOfService = () => {
    return (
        <div className="container content-page">
            <DynamicSEO
                title="Terms of Service - PDF Saathi"
                description="Read PDF Saathi's Terms of Service. By using our PDF tools, you agree to these terms and conditions."
            />
            <section className="about-hero">
                <h1 className="page-title">Terms of Service</h1>
            </section>

            <Card style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '2rem auto' }}>
                <div style={{ lineHeight: '1.8', color: 'var(--text-primary)' }}>
                    <h2>Agreement to Terms</h2>
                    <p>
                        By accessing and using PDF Saathi, you accept and agree to be bound by the terms and provisions
                        of this agreement. If you do not agree to these terms, please do not use our services.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Use of Services</h2>
                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem' }}>Permitted Use</h3>
                    <p>You may use PDF Saathi to:</p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Convert, merge, split, and manipulate PDF files</li>
                        <li>Compress and optimize PDF documents</li>
                        <li>Protect PDFs with passwords</li>
                        <li>Convert between various document formats</li>
                    </ul>

                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem' }}>Prohibited Use</h3>
                    <p>You agree NOT to:</p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Upload files containing illegal content</li>
                        <li>Upload files containing malware or viruses</li>
                        <li>Violate any intellectual property rights</li>
                        <li>Attempt to hack or compromise our systems</li>
                        <li>Use automated tools to abuse our services</li>
                        <li>Upload files that violate others' privacy</li>
                        <li>Use the service for any illegal purposes</li>
                    </ul>

                    <h2 style={{ marginTop: '2rem' }}>User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide accurate and complete information.
                        You are responsible for:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Maintaining the security of your account</li>
                        <li>All activities that occur under your account</li>
                        <li>Notifying us of any unauthorized use</li>
                    </ul>

                    <h2 style={{ marginTop: '2rem' }}>Service Availability</h2>
                    <p>
                        We strive to provide 99.9% uptime, but we do not guarantee uninterrupted access to our services.
                        We may:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Temporarily suspend services for maintenance</li>
                        <li>Modify or discontinue features</li>
                        <li>Update our services without prior notice</li>
                    </ul>

                    <h2 style={{ marginTop: '2rem' }}>File Processing and Storage</h2>
                    <p>
                        <strong>Important:</strong> All files uploaded to PDF Saathi are:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Processed in real-time</li>
                        <li>Automatically deleted immediately after processing</li>
                        <li>Not stored, analyzed, or shared with third parties</li>
                        <li>Not used for training or any other purposes</li>
                    </ul>

                    <h2 style={{ marginTop: '2rem' }}>Intellectual Property</h2>
                    <p>
                        The PDF Saathi platform, including its design, features, and content, is owned by Lucky and
                        protected by copyright and other intellectual property laws. You retain all rights to your uploaded files.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Limitation of Liability</h2>
                    <p>
                        PDF Saathi is provided "as is" without warranties of any kind. We are not liable for:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Loss of data or files</li>
                        <li>Service interruptions</li>
                        <li>Errors in file processing</li>
                        <li>Indirect or consequential damages</li>
                    </ul>
                    <p>
                        <strong>Always keep backups of your important files.</strong>
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Free Service</h2>
                    <p>
                        PDF Saathi is currently provided free of charge. We reserve the right to:
                    </p>
                    <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                        <li>Introduce paid features in the future</li>
                        <li>Set usage limits</li>
                        <li>Modify pricing structures</li>
                    </ul>
                    <p>
                        Existing users will be notified of any changes with reasonable advance notice.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Termination</h2>
                    <p>
                        We reserve the right to terminate or suspend your account immediately, without prior notice,
                        for conduct that we believe violates these Terms of Service or is harmful to other users, us,
                        or third parties.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Indemnification</h2>
                    <p>
                        You agree to indemnify and hold harmless PDF Saathi and its creator from any claims, damages,
                        or expenses arising from your use of the service or violation of these terms.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. Changes will be effective immediately
                        upon posting. Your continued use of the service constitutes acceptance of the modified terms.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with applicable laws, without
                        regard to conflict of law provisions.
                    </p>

                    <h2 style={{ marginTop: '2rem' }}>Contact Information</h2>
                    <p>
                        For questions about these Terms of Service, please contact us through our{' '}
                        <a href="/contact" style={{ color: 'var(--primary)' }}>contact page</a>.
                    </p>

                    <div style={{
                        marginTop: '3rem',
                        padding: '1.5rem',
                        background: 'var(--surface-alt)',
                        borderRadius: '12px',
                        borderLeft: '4px solid var(--primary)'
                    }}>
                        <p style={{ margin: 0, fontWeight: '600' }}>
                            By using PDF Saathi, you acknowledge that you have read, understood, and agree to be
                            bound by these Terms of Service.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TermsOfService;
