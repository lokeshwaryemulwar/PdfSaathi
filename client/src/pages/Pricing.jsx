import React from 'react';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import SEO from '../components/layout/SEO';
import '../components/tools/GenericTool.css'; // Reuse basic styles

const Pricing = () => {
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            buttonVariant: 'outline',
            buttonText: 'Current Plan',
            action: () => navigate('/tools'),
            features: [
                { text: 'Access to all PDF tools', included: true },
                { text: '10 MB file size limit', included: true },
                { text: '10 conversions per day', included: true },
                { text: 'Ads supported', included: true },
                { text: 'Batch processing', included: false },
                { text: 'Priority support', included: false },
                { text: 'API access', included: false },
            ]
        },
        {
            name: 'Pro',
            price: '$4.99',
            period: 'per month',
            popular: true,
            buttonVariant: 'primary',
            buttonText: 'Upgrade Now',
            action: () => window.location.href = 'https://buy.stripe.com/test_placeholder', // User needs to replace this
            features: [
                { text: 'Access to all PDF tools', included: true },
                { text: '100 MB file size limit', included: true },
                { text: 'Unlimited conversions', included: true },
                { text: 'No ads', included: true },
                { text: 'Batch processing (10 files)', included: true },
                { text: 'Priority support', included: true },
                { text: 'API access', included: true },
            ]
        }
    ];

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <SEO
                title="Pricing Plans"
                description="Choose the perfect plan for your PDF needs. Upgrade to Pro for unlimited access and advanced features."
                url="https://pdfsaathi.in/pricing"
            />

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Simple, Transparent Pricing</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Start for free, upgrade for power.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                {plans.map(plan => (
                    <div key={plan.name} style={{
                        background: 'var(--surface)',
                        border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        position: 'relative',
                        boxShadow: plan.popular ? '0 10px 30px -10px rgba(79, 70, 229, 0.2)' : 'none'
                    }}>
                        {plan.popular && (
                            <span style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '0.25rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}>
                                Most Popular
                            </span>
                        )}

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h2>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{plan.price}</span>
                            <span style={{ color: 'var(--text-muted)' }}>/{plan.period}</span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left' }}>
                            {plan.features.map((feature, i) => (
                                <li key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '1rem',
                                    color: feature.included ? 'var(--text-main)' : 'var(--text-muted)',
                                    opacity: feature.included ? 1 : 0.6
                                }}>
                                    {feature.included ?
                                        <Check size={20} color="#10B981" /> :
                                        <X size={20} color="#EF4444" />
                                    }
                                    {feature.text}
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant={plan.buttonVariant}
                            style={{ width: '100%' }}
                            onClick={plan.action}
                        >
                            {plan.buttonText}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
