import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, MessageCircle, HelpCircle, Book } from 'lucide-react';
import DynamicSEO from '../components/layout/DynamicSEO';
import { blogPosts } from '../data/blogPosts';
import Card from '../components/ui/Card';
import './ContentPage.css';

const HelpCenter = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "Is PDF Saathi really free?",
            answer: "Yes! PDF Saathi is currently 100% free to use. We are supported by minimal ads. You don't need to create an account or pay a subscription."
        },
        {
            question: "Are my files safe?",
            answer: "Absolutely. We use 256-bit SSL encryption for transfers, and your files are automatically deleted from our servers 1 hour after processing. We do not read or store your content."
        },
        {
            question: "What is the file size limit?",
            answer: "Currently, we support files up to 100MB per task. This covers most standard documents, e-books, and scanned reports."
        },
        {
            question: "Can I use PDF Saathi on my phone?",
            answer: "Yes! Our website is fully responsive and works great on iPhones, Android devices, and tablets. No app installation required."
        }
    ];

    // Group blog posts by category for the Guides section
    const guides = blogPosts.reduce((acc, post) => {
        const cat = post.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(post);
        return acc;
    }, {});

    const filteredGuides = Object.keys(guides).reduce((acc, key) => {
        const filtered = guides[key].filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) acc[key] = filtered;
        return acc;
    }, {});

    return (
        <div className="container content-page">
            <DynamicSEO
                title="Help Center & Resources - PDF Saathi"
                description="Find answers to common questions, browse our comprehensive PDF guides, and learn how to secure your documents."
            />

            {/* Hero Section */}
            <section className="help-hero animate-fade-in" style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)',
                padding: '4rem 2rem',
                borderRadius: '16px',
                color: 'white',
                textAlign: 'center',
                marginBottom: '4rem'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700' }}>How can we help you?</h1>
                <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Search our knowledge base for guides and tutorials.
                </p>
                <div className="search-container" style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                    <Search className="search-icon" size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1.2rem 1.2rem 1.2rem 3.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                    />
                </div>
            </section>

            {/* Knowledge Base / Guides */}
            <section className="animate-fade-in animate-delay-100">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.8rem', background: '#e0e7ff', borderRadius: '12px', color: 'var(--primary)' }}>
                        <Book size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Browse Guides</h2>
                </div>

                {Object.keys(filteredGuides).length > 0 ? (
                    Object.keys(filteredGuides).map(category => (
                        <div key={category} style={{ marginBottom: '4rem' }}>
                            <h3 style={{
                                fontSize: '1.4rem',
                                marginBottom: '1.5rem',
                                color: 'var(--text-primary)',
                                paddingBottom: '0.5rem',
                                borderBottom: '2px solid #f3f4f6',
                                display: 'inline-block'
                            }}>
                                {category}
                            </h3>
                            <div className="blog-grid">
                                {filteredGuides[category].map(post => (
                                    <Link to={`/blog/${post.slug}`} key={post.id} className="blog-card-link">
                                        <Card className="hover-lift" style={{ height: '100%', padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                            <div style={{ padding: '1.5rem' }}>
                                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', lineHeight: '1.4' }}>{post.title}</h4>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                                                    {post.excerpt.length > 80 ? post.excerpt.substring(0, 80) + '...' : post.excerpt}
                                                </p>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    Read Guide <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', background: '#f9fafb', borderRadius: '12px', color: 'var(--text-muted)' }}>
                        <HelpCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No guides found matching "{searchTerm}"</p>
                    </div>
                )}
            </section>

            {/* FAQs */}
            <section className="animate-fade-in animate-delay-200" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Everything you need to know about PDF Saathi</p>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {faqs.map((faq, index) => (
                        <div key={index} style={{ marginBottom: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
                            <button
                                onClick={() => toggleFaq(index)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '1.5rem',
                                    background: 'none',
                                    border: 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    fontSize: '1.1rem',
                                    fontWeight: '500',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                {faq.question}
                                {openFaq === index ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="#9ca3af" />}
                            </button>
                            {openFaq === index && (
                                <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-secondary)', lineHeight: '1.7', borderTop: '1px solid #f3f4f6' }}>
                                    <div style={{ paddingTop: '1rem' }}>{faq.answer}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact CTA */}
            <section style={{
                textAlign: 'center',
                padding: '4rem',
                background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                borderRadius: '24px',
                border: '1px solid #e2e8f0'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>
                    <MessageCircle size={32} color="var(--primary)" />
                </div>
                <h2 style={{ marginBottom: '1rem' }}>Still need help?</h2>
                <p style={{ maxWidth: '500px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
                    Can't find the answer you're looking for? Our support team is here to assist you.
                </p>
                <Link to="/contact" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.05rem' }}>
                    Contact Support
                </Link>
            </section>
        </div>
    );
};

export default HelpCenter;
