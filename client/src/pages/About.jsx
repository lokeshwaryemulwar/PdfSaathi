import React from 'react';
import AboutAnimation from '../components/about/AboutAnimation';
import DynamicSEO from '../components/layout/DynamicSEO';
import './ContentPage.css';



const About = () => {
    const aboutSchema = {
        "@type": "AboutPage",
        "name": "About PDF Saathi",
        "description": "Information about PDF Saathi, the mission, and creator Lokeshwar Yemulwar.",
        "url": "https://www.pdfsaathi.in/about"
    };

    return (
        <div className="container content-page">
            <DynamicSEO
                title="About PDF Saathi - Your Trusted PDF Tool"
                description="Learn about PDF Saathi's mission to make document tools accessible for everyone. Privacy-first, lightning-fast, and always free PDF tools."
            />

            <section className="about-hero animate-fade-in">
                <h1 className="page-title">Empowering productivity, protecting privacy.</h1>
                <p className="page-subtitle" style={{ maxWidth: '800px' }}>
                    PDF Saathi was born from a simple belief: Professional-grade document tools <br />
                    should be accessible to everyone, without compromising on security.
                </p>
            </section>

            <div className="about-content">
                <div className="about-image-wrapper animate-fade-in animate-delay-100">
                    <AboutAnimation />

                    <div className="about-stats-grid">
                        <div className="about-stat-box" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe' }}>
                            <div className="about-stat-number" style={{ color: '#1d4ed8' }}>1M+</div>
                            <div className="about-stat-label" style={{ color: '#3b82f6' }}>Tasks Processed</div>
                        </div>
                        <div className="about-stat-box" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0' }}>
                            <div className="about-stat-number" style={{ color: '#15803d' }}>100%</div>
                            <div className="about-stat-label" style={{ color: '#22c55e' }}>Free & Secure</div>
                        </div>
                    </div>
                </div>

                <div className="text-content animate-fade-in animate-delay-200" style={{ paddingRight: '1rem' }}>
                    <h2 style={{ marginTop: 0, fontSize: '2rem', marginBottom: '1.5rem', color: '#111827' }}>The Founder's Story & Our Mission</h2>
                    <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: '1.8' }}>
                        Hello! I'm <strong>Lokeshwar Yemulwar (Lucky)</strong>, the lead developer and creator of PDF Saathi.
                        Welcome to the platform I built specifically to solve everyday digital document frustrations.
                    </p>
                    <p style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: '1.8' }}>
                        As a Full Stack Developer specializing in secure web architectures, I noticed a troubling trend in the PDF utility market.
                        Users were consistently forced into difficult corners. They either had to pay exorbitant monthly subscription fees for
                        heavy desktop software like Adobe Acrobat, or they had to rely on shady, ad-heavy "free" online tools that secretly uploaded
                        their sensitive personal files to unknown, unsecure servers across the globe.
                    </p>
                    <p style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: '1.8' }}>
                        I firmly believe that manipulating a digital document—whether it is merging two chapters of a thesis, compressing a
                        large PDF portfolio to fit an email attachment limit, or quickly extracting a specific page from a legal contract—should
                        not require a credit card or compromise your privacy.
                    </p>
                    <p style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: '1.8' }}>
                        That realization was the genesis of PDF Saathi. I set out to build a platform that bridges this gap. By utilizing
                        advanced <strong>client-side processing</strong> technologies where possible and strictly monitored, automated
                        <strong> secure cloud functions</strong> for heavier tasks, PDF Saathi delivers enterprise-level document manipulation
                        tools directly to your web browser. We respect your data sovereignty above all else.
                    </p>
                    <p style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: '1.8' }}>
                        Since our launch, we have helped thousands of students, freelancers, legal professionals, and small business owners
                        regain control over their digital workflows. Our platform handles thousands of conversions daily, saving countless collective
                        hours of administrative overhead for our users.
                    </p>
                </div>
            </div>



            <section className="commitments-section animate-fade-in animate-delay-300">
                <div className="commitments-header">
                    <div className="commitments-badge">OUR PROMISE</div>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: '#0f172a' }}>Our Technical Commitments</h2>
                    <p style={{ color: '#64748b', fontSize: '1.15rem' }}>Built on a robust foundation of absolute security, lightning-fast speeds, and universal accessibility.</p>
                </div>

                <div className="values-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    <div className="value-card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #eff6ff, #bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5)' }}>
                            <span style={{ fontSize: '1.8rem' }}>🔒</span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1e293b' }}>Zero-Retention Privacy</h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>We utilize AES-256 encryption. Files are permanently and automatically deleted within 1 hour. We never index or read your contents.</p>
                    </div>

                    <div className="value-card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #fefce8, #fef08a)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5)' }}>
                            <span style={{ fontSize: '1.8rem' }}>⚡</span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1e293b' }}>Blazing Performance</h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>We continuously optimize our algorithms to ensure even massive 100-page, high-resolution PDFs process in mere seconds.</p>
                    </div>

                    <div className="value-card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #f3e8ff, #d8b4fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5)' }}>
                            <span style={{ fontSize: '1.8rem' }}>🎓</span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1e293b' }}>Total Transparency</h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>We believe in empowering our users. We maintain a free comprehensive blog with guides on digital security and productivity.</p>
                    </div>

                    <div className="value-card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #f0fdf4, #bbf7d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5)' }}>
                            <span style={{ fontSize: '1.8rem' }}>💻</span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1e293b' }}>Accessible Anywhere</h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>Our tool suite works flawlessly across Windows PCs, Macbooks, Linux machines, iPads, and mobile smartphones without installers.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
