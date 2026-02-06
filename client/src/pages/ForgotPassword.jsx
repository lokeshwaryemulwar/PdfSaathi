import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Mail, ArrowLeft } from 'lucide-react';
import './ContentPage.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            // Always show success to prevent user enumeration, unless it's a server error
            if (response.status === 500) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus('success');
            setMessage(data.message || 'If an account exists, a reset link has been sent.');
        } catch (err) {
            setStatus('error');
            setMessage(err.message || 'Failed to send reset email.');
        }
    };

    return (
        <div className="container content-page">
            <div style={{
                maxWidth: '450px',
                margin: '4rem auto',
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Card style={{ width: '100%', padding: '3rem 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Forgot Password</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Enter your email to reset your password</p>
                    </div>

                    {status === 'success' ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                padding: '1rem',
                                background: '#ecfdf5',
                                border: '1px solid #d1fae5',
                                borderRadius: '8px',
                                color: '#047857',
                                marginBottom: '2rem'
                            }}>
                                {message}
                            </div>
                            <Link to="/login">
                                <Button variant="outline" style={{ width: '100%' }}>
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>
                                    <Mail size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    autoFocus
                                />
                            </div>

                            {status === 'error' && (
                                <div style={{
                                    padding: '0.75rem',
                                    background: '#fee2e2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '8px',
                                    color: '#dc2626',
                                    marginBottom: '1rem',
                                    fontSize: '0.875rem'
                                }}>
                                    {message}
                                </div>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                style={{ width: '100%' }}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                            </Button>

                            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                <Link to="/login" style={{
                                    color: 'var(--text-muted)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    fontSize: '0.9rem',
                                    textDecoration: 'none'
                                }}>
                                    <ArrowLeft size={16} style={{ marginRight: '0.25rem' }} />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
