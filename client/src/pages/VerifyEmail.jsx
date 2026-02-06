import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import './ContentPage.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Verification failed');
                }

                setStatus('success');
                setMessage(data.message || 'Email verified successfully!');
            } catch (err) {
                setStatus('error');
                setMessage(err.message || 'Verification failed. The link may have expired.');
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="container content-page">
            <div style={{
                maxWidth: '450px',
                margin: '4rem auto',
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Card style={{ width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
                    {status === 'verifying' && (
                        <>
                            <Loader size={48} className="spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                            <h2>Verifying...</h2>
                            <p style={{ color: 'var(--text-muted)' }}>{message}</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
                            <h2>Verified!</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{message}</p>
                            <Link to="/login">
                                <Button size="lg" style={{ width: '100%' }}>
                                    Go to Login
                                </Button>
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
                            <h2>Verification Failed</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{message}</p>
                            <Link to="/login">
                                <Button variant="outline" size="lg" style={{ width: '100%' }}>
                                    Back to Login
                                </Button>
                            </Link>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default VerifyEmail;
