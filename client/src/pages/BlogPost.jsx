import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { blogPosts } from '../data/blogPosts';
import DynamicSEO from '../components/layout/DynamicSEO';
import './ContentPage.css';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="container content-page" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <DynamicSEO title="Post Not Found" description="The requested blog post could not be found." />
                <h1>Blog Post Not Found</h1>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                    The blog post you're looking for doesn't exist.
                </p>
                <Button onClick={() => navigate('/blog')} style={{ marginTop: '2rem' }}>
                    Back to Blog
                </Button>
            </div>
        );
    }

    const getCategoryColor = (category) => {
        const colors = {
            'Productivity': '#10b981',
            'Tutorials': '#3b82f6',
            'Security': '#ef4444',
            'Technology': '#8b5cf6'
        };
        return colors[category] || '#6b7280';
    };

    // Convert markdown-style content to HTML
    const formatContent = (content) => {
        return content
            .split('\n')
            .map((line, index) => {
                // Headers
                if (line.startsWith('# ')) {
                    return <h1 key={index} style={{ fontSize: '2rem', marginTop: '2rem', marginBottom: '1rem' }}>{line.substring(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={index} style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{line.substring(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                    return <h3 key={index} style={{ fontSize: '1.25rem', marginTop: '1.25rem', marginBottom: '0.5rem' }}>{line.substring(4)}</h3>;
                }
                // Lists
                if (line.startsWith('- ')) {
                    return <li key={index} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>{line.substring(2)}</li>;
                }
                // Bold text (simple **text** format)
                if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                        <p key={index} style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
                            {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                        </p>
                    );
                }
                // Checkmarks and crosses
                if (line.startsWith('✅') || line.startsWith('❌')) {
                    return <p key={index} style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>{line}</p>;
                }
                // Regular paragraphs
                if (line.trim()) {
                    return <p key={index} style={{ marginBottom: '1rem', lineHeight: '1.7', color: 'var(--text-primary)' }}>{line}</p>;
                }
                return null;
            })
            .filter(Boolean);
    };

    return (
        <div className="container content-page">
            <DynamicSEO
                title={post.title}
                description={post.excerpt}
                image={post.image}
            />
            {/* Back Button */}
            <Button
                variant="outline"
                onClick={() => navigate('/blog')}
                style={{ marginBottom: '2rem' }}
            >
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
                Back to Blog
            </Button>

            <Card style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
                {/* Category Badge */}
                <div style={{
                    display: 'inline-block',
                    background: getCategoryColor(post.category),
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '1.5rem'
                }}>
                    {post.category}
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '2.5rem',
                    lineHeight: '1.2',
                    marginBottom: '1.5rem',
                    color: 'var(--text-primary)'
                }}>
                    {post.title}
                </h1>

                {/* Meta Information */}
                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    fontSize: '0.9375rem',
                    color: 'var(--text-muted)',
                    marginBottom: '2rem',
                    paddingBottom: '2rem',
                    borderBottom: '1px solid var(--border)',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={16} />
                        <span style={{ fontWeight: '500' }}>
                            {post.author}
                        </span>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} />
                        {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} />
                        {post.readTime}
                    </span>
                </div>

                {/* Featured Image */}
                <div style={{
                    width: '100%',
                    height: '400px',
                    background: `url(${post.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px',
                    marginBottom: '2rem'
                }} />

                {/* Content */}
                <div style={{
                    fontSize: '1.0625rem',
                    lineHeight: '1.8',
                    color: 'var(--text-primary)'
                }}>
                    {formatContent(post.content)}
                </div>

                {/* Divider */}
                <div style={{
                    borderTop: '1px solid var(--border)',
                    marginTop: '3rem',
                    paddingTop: '2rem'
                }}>
                    <Button onClick={() => navigate('/blog')}>
                        ← Back to All Posts
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default BlogPost;
