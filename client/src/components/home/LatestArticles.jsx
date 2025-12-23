import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data/blogPosts';
import Card from '../ui/Card';
import './LatestArticles.css';

const LatestArticles = () => {
    // Get the latest 3 posts
    const recentPosts = blogPosts.slice(0, 3);

    return (
        <section className="latest-articles-section" style={{ padding: '4rem 0', backgroundColor: '#f9fafb' }}>
            <div className="container">
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Latest Guides & Tutorials</h2>
                    <p className="section-subtitle" style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
                        Learn how to get the most out of your documents with our expert tips and tricks.
                    </p>
                </div>

                <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {recentPosts.map((post) => (
                        <Card key={post.id} className="article-card" hover style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div className="article-image" style={{ height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                />
                            </div>
                            <div className="article-content" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div className="article-meta" style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                    {post.category} • {post.readTime}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                                    <Link to={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
                                    {post.excerpt}
                                </p>
                                <Link
                                    to={`/blog/${post.slug}`}
                                    style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                                >
                                    Read Article →
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link to="/blog">
                        <button className="btn btn-outline" style={{ padding: '0.75rem 2rem', borderRadius: '9999px', border: '1px solid #d1d5db', background: 'transparent', cursor: 'pointer', fontWeight: '500' }}>
                            View All Articles
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestArticles;
