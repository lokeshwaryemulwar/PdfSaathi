import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { LogOut, Trash2, Mail, User, MessageSquare, Calendar, Users } from 'lucide-react';
import './ContentPage.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' or 'users'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        fetchContacts();
        fetchUsers();
    }, [navigate]);

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/contacts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUsername');
                    navigate('/admin');
                    return;
                }
                throw new Error('Failed to fetch contacts');
            }

            const data = await response.json();
            setContacts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Fetch users error:', err);
        }
    };

    const handleDeleteContact = async (id) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/contacts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete contact');
            }

            setContacts(contacts.filter(c => c.id !== id));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user account?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        navigate('/admin');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const username = localStorage.getItem('adminUsername');

    return (
        <div className="container content-page">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Admin Dashboard</h1>
                    <p className="page-subtitle">Welcome back, {username}!</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut size={18} style={{ marginRight: '0.5rem' }} />
                    Logout
                </Button>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab('contacts')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'contacts' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'contacts' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '-2px',
                        fontSize: '1rem'
                    }}
                >
                    <MessageSquare size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Contact Submissions ({contacts.length})
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'users' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '-2px',
                        fontSize: '1rem'
                    }}
                >
                    <Users size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Registered Users ({users.length})
                </button>
            </div>

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
                <Card style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Contact Form Submissions</h2>
                        <div style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                        }}>
                            {contacts.length} Total
                        </div>
                    </div>

                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {!loading && contacts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>No contact submissions yet</p>
                        </div>
                    )}

                    {!loading && contacts.length > 0 && (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>
                                            <User size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                            Name
                                        </th>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>
                                            <Mail size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                            Email
                                        </th>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Topic</th>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Message</th>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>
                                            <Calendar size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                            Date
                                        </th>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact) => (
                                        <tr key={contact.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem 0.5rem' }}>{contact.name}</td>
                                            <td style={{ padding: '1rem 0.5rem' }}>
                                                <a href={`mailto:${contact.email}`} style={{ color: 'var(--primary)' }}>
                                                    {contact.email}
                                                </a>
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem' }}>
                                                <span style={{
                                                    background: 'var(--surface-alt)',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {contact.topic}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', maxWidth: '300px' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.25rem'
                                                }}>
                                                    <div style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '100%'
                                                    }}>
                                                        {contact.message}
                                                    </div>
                                                    {contact.message.length > 50 && (
                                                        <button
                                                            onClick={() => setSelectedMessage(contact)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: 'var(--primary)',
                                                                padding: 0,
                                                                textAlign: 'left',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem',
                                                                fontWeight: '500',
                                                                width: 'fit-content'
                                                            }}
                                                        >
                                                            Read More
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                {formatDate(contact.created_at)}
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem' }}>
                                                <button
                                                    onClick={() => handleDeleteContact(contact.id)}
                                                    style={{
                                                        background: '#fee2e2',
                                                        border: 'none',
                                                        padding: '0.5rem',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        color: '#dc2626'
                                                    }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <Card style={{ padding: '2rem' }}>
                    {/* ... (existing user table content) ... */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Registered Users</h2>
                        <div style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                        }}>
                            {users.length} Total
                        </div>
                    </div>

                    {users.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>No registered users yet</p>
                        </div>
                    )}

                    {users.length > 0 && (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>ID</th>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>
                                            <Mail size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                            Email
                                        </th>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>
                                            <User size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                            Name
                                        </th>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>
                                            <Calendar size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                            Registered
                                        </th>
                                        <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{index + 1}</td>
                                            <td style={{ padding: '1rem 0.5rem' }}>
                                                <a href={`mailto:${user.email}`} style={{ color: 'var(--primary)' }}>
                                                    {user.email}
                                                </a>
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem' }}>
                                                {user.name || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not provided</span>}
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem' }}>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    style={{
                                                        background: '#fee2e2',
                                                        border: 'none',
                                                        padding: '0.5rem',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        color: '#dc2626'
                                                    }}
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            <Modal
                isOpen={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                title={selectedMessage ? `Message from ${selectedMessage.name}` : ''}
                footer={
                    <Button onClick={() => setSelectedMessage(null)}>Close</Button>
                }
            >
                {selectedMessage && (
                    <div>
                        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', gap: '1.5rem' }}>
                            <span><strong>Email:</strong> {selectedMessage.email}</span>
                            <span><strong>Topic:</strong> {selectedMessage.topic}</span>
                            <span><strong>Date:</strong> {formatDate(selectedMessage.created_at)}</span>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            {selectedMessage.message}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
