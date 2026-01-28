import React from 'react';
import { Zap, Users, Shield, Lightbulb } from 'lucide-react';
import './CoreValues.css';

const CoreValues = () => {
    const values = [
        { icon: Zap, title: 'Simplicity First' },
        { icon: Users, title: 'User Focused' },
        { icon: Shield, title: 'Privacy Centric' },
        { icon: Lightbulb, title: 'Always Innovating' },
    ];

    return (
        <section className="core-values-section">
            <div className="container">
                <h2 className="values-title">Our Core Values</h2>
                <div className="values-grid">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div key={index} className="value-item">
                                <div className="value-icon">
                                    <Icon size={24} color="#0F172A" />
                                </div>
                                <span className="value-text">{value.title}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CoreValues;
