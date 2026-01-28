import React, { useState } from 'react';
import API_BASE_URL from '../config';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DynamicSEO from '../components/layout/DynamicSEO';
import './ContentPage.css';
import ContactAnimation from '../components/contact/ContactAnimation';


const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        topic: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const contactSchema = {
        "@type": "ContactPage",
        "name": "Contact PDF Saathi",
        "description": "Contact support for PDF Saathi PDF tools.",
        "url": "https://www.pdfsaathi.in/contact"
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });
            setFormData({ name: '', email: '', topic: '', message: '' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container content-page">
            <DynamicSEO
                title="Contact Us - PDF Saathi Support"
                description="Have a question about our PDF tools? Send us a message and we'll get back to you shortly. Contact PDF Saathi support team."
            />
            <section className="contact-hero">
                <h1 className="page-title">How can we help you?</h1>
                <p className="page-subtitle">
                    Have a question about our PDF tools? Send us a message and we'll get back to you shortly.
                </p>
            </section>

            <div className="contact-grid">
                <div className="contact-info">
                    <Card className="contact-info-card">
                        <ContactAnimation />
                    </Card>
                </div>

                <Card className="contact-form-card">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="jane@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Topic</label>
                            <select
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select a topic</option>
                                <option value="technical">Technical Issue</option>
                                <option value="feature">Feature Request</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                rows="5"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us more about your inquiry..."
                                required
                            />
                        </div>

                        {status.message && (
                            <div style={{
                                padding: '0.75rem',
                                background: status.type === 'success' ? '#d1fae5' : '#fee2e2',
                                border: `1px solid ${status.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                                borderRadius: '8px',
                                color: status.type === 'success' ? '#065f46' : '#dc2626',
                                marginBottom: '1rem',
                                fontSize: '0.875rem'
                            }}>
                                {status.message}
                            </div>
                        )}

                        <Button type="submit" size="lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Contact;
