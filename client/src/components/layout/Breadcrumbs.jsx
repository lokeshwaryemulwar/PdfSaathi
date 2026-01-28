import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
    const location = useLocation();

    // Don't show breadcrumbs on home page
    if (location.pathname === '/') {
        return null;
    }

    const pathnames = location.pathname.split('/').filter((x) => x);

    // Map specific slugs or paths to readable names
    const getReadableName = (path, index, arr) => {
        // Check for specific static overrides
        const overrides = {
            'blog': 'Blog',
            'tools': 'All Tools',
            'about': 'About Us',
            'contact': 'Contact Us',
            'privacy': 'Privacy Policy',
            'terms': 'Terms of Service',
            'cookies': 'Cookie Policy',
            'security': 'Security Center',
            'merge-pdf': 'Merge PDF',
            'split-pdf': 'Split PDF',
            'compress-pdf': 'Compress PDF',
            'pdf-to-word': 'PDF to Word',
            'word-to-pdf': 'Word to PDF',
            'protect-pdf': 'Protect PDF',
            'unlock-pdf': 'Unlock PDF',
            'rotate-pdf': 'Rotate PDF',
            'img-to-pdf': 'JPG to PDF',
            'login': 'Login',
            'signup': 'Sign Up',
            'admin': 'Admin'
        };

        if (overrides[path]) {
            return overrides[path];
        }

        // Handle Author paths
        if (arr[index - 1] === 'author') {
            return path.replace(/-/g, ' '); // Sarah-Johnson -> Sarah Johnson
        }

        // Handle Blog slugs - format nicely (e.g. how-to-merge -> How To Merge)
        // Optimization: In a real app we might fetch the title from a store based on slug, 
        // but for SEO/nav purposes, formatting the slug is often "good enough" and faster.
        if (arr[index - 1] === 'blog') {
            return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

        // Fallback: Capitalize first letter
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    };

    return (
        <nav aria-label="breadcrumb" className="container breadcrumb-nav">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/" aria-label="Home">
                        <Home size={16} />
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    return (
                        <li key={to} className={`breadcrumb-item ${isLast ? 'active' : ''}`} aria-current={isLast ? 'page' : undefined}>
                            <ChevronRight size={14} className="breadcrumb-separator" />
                            {isLast ? (
                                <span className="current-page">{getReadableName(value, index, pathnames)}</span>
                            ) : (
                                <Link to={to}>{getReadableName(value, index, pathnames)}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
