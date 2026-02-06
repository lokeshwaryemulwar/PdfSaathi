import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Mail, Lock } from 'lucide-react';
import './ContentPage.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and user
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to home
            navigate('/');
            window.location.reload(); // Reload to update auth state
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Log in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                <Mail size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>
                                <Lock size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '1.5rem', marginTop: '-0.25rem' }}>
                            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>
                                Forgot Password?
                            </Link>
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
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </form>

                    <div style={{
                        marginTop: '1.5rem',
                        textAlign: 'center',
                        fontSize: '0.9375rem',
                        color: 'var(--text-muted)'
                    }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                            Sign Up
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
