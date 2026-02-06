import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Lock, CheckCircle } from 'lucide-react';
import './ContentPage.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Password reset failed');
            }

            setStatus('success');
            // Auto redirect after 3 seconds
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus('error');
            setError(err.message);
        }
    };

    if (!token) {
        return (
            <div className="container content-page">
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <h2>Invalid Link</h2>
                    <p>Missing reset token.</p>
                    <Link to="/forgot-password">Request a new link</Link>
                </div>
            </div>
        );
    }

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
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Reset Password</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Create a new password</p>
                    </div>

                    {status === 'success' ? (
                        <div style={{ textAlign: 'center' }}>
                            <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem', margin: '0 auto' }} />
                            <h3>Password Reset!</h3>
                            <p>Redirecting to login...</p>
                            <Link to="/login">
                                <Button style={{ marginTop: '1rem' }}>Login Now</Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>
                                    <Lock size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Lock size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>

                            {error && (
                                <div style={{
                                    padding: '0.75rem',
                                    background: '#fee2e2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '8px',
                                    color: '#dc2626',
                                    marginBottom: '1rem',
                                    fontSize: '0.875rem'
                                }}>
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                style={{ width: '100%' }}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
