import React from 'react';
import { Shield, Zap, Globe } from 'lucide-react';
import Card from '../ui/Card';
import './Benefits.css';

const Benefits = () => {
    const benefits = [
        {
            id: 1,
            title: 'Secure by Design',
            description: "We don't keep your files. Documents are automatically deleted from our servers 1 hour after processing.",
            icon: Shield,
            color: '#4F46E5'
        },
        {
            id: 2,
            title: 'Universal Access',
            description: 'Windows, Mac, Linux, iOS, or Android—it doesn\'t matter. Our tools work entirely in the browser.',
            icon: Globe,
            color: '#3B82F6'
        },
        {
            id: 3,
            title: 'Top Quality',
            description: 'We maintain the formatting and layout of your original documents. Our lossless conversion engine ensures professional results.',
            icon: Zap, // Using Zap for "Lightning Fast" or "Quality" 
            color: '#EC4899'
        }
    ];

    return (
        <section className="benefits-section">
            <div className="container">
                <div className="section-header animate-fade-in">
                    <h2 className="section-title">Why Choose Us?</h2>
                    <p className="section-subtitle">
                        We prioritize speed, security, and quality in every conversion. Here is what makes our platform stand out.
                    </p>
                </div>
                <div className="benefits-grid animate-fade-in animate-delay-200">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <Card key={benefit.id} className="benefit-card">
                                {/* Inline style for color is needed for the initial icon color, 
                                    but we override bg on hover in CSS. 
                                    Let's keep text color dynamic but let CSS handle BG 
                                */}
                                <div className="benefit-icon" style={{ color: benefit.color }}>
                                    <Icon size={24} />
                                </div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
