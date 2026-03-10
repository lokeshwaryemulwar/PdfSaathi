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
            <div className="container" style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: '#f1f5f9', color: '#475569', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '0.05em' }}>WHY CHOOSE US</div>
                <br />
                <h2 className="values-title">Our Core Values</h2>

                <div className="values-grid">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div key={index} className="value-item" style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="value-icon">
                                    <Icon size={26} className="icon-svg" />
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
