import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import DynamicSEO from '../components/layout/DynamicSEO';
import './ContentPage.css';

const Blog = () => {
    const navigate = useNavigate();

    const getCategoryColor = (category) => {
        const colors = {
            'Productivity': '#10b981',
            'Tutorials': '#3b82f6',
            'Security': '#ef4444',
            'Technology': '#8b5cf6'
        };
        return colors[category] || '#6b7280';
    };

    return (
        <div className="container content-page">
            <DynamicSEO
                title="PDF Tips, Tutorials & Guides - Blog"
                description="Tips, tutorials, and insights about PDF tools and document management. Learn how to work with PDFs efficiently."
            />
            <section className="contact-hero">
                <h1 className="page-title">Blog</h1>
                <p className="page-subtitle">
                    Tips, tutorials, and insights about PDF tools and document management
                </p>
            </section>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem',
                marginTop: '3rem'
            }}>
                {blogPosts.map((post) => (
                    <Card
                        key={post.id}
                        style={{
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            overflow: 'hidden',
                            padding: 0
                        }}
                        onClick={() => navigate(`/blog/${post.slug}`)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '';
                        }}
                    >
                        {/* Blog Image */}
                        <div style={{
                            width: '100%',
                            height: '200px',
                            background: `url(${post.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: getCategoryColor(post.category),
                                color: 'white',
                                padding: '0.375rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                {post.category}
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                marginBottom: '0.75rem',
                                lineHeight: '1.4',
                                color: 'var(--text-primary)'
                            }}>
                                {post.title}
                            </h3>

                            <p style={{
                                color: 'var(--text-muted)',
                                marginBottom: '1rem',
                                lineHeight: '1.6',
                                fontSize: '0.9375rem'
                            }}>
                                {post.excerpt}
                            </p>

                            {/* Meta Information */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                fontSize: '0.875rem',
                                color: 'var(--text-muted)',
                                marginBottom: '1rem',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <User size={14} />
                                    {post.author}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <Calendar size={14} />
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <Clock size={14} />
                                    {post.readTime}
                                </span>
                            </div>

                            {/* Read More Link */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--primary)',
                                fontWeight: '600',
                                fontSize: '0.9375rem'
                            }}>
                                Read More
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Blog;
