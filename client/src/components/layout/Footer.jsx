import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Linkedin, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <div className="logo-icon-sm">
                                <FileText size={20} color="white" />
                            </div>
                            <span>PDF Saathi</span>
                        </Link>
                        <p className="footer-desc">
                            Making PDF management simple, secure, and accessible for everyone.
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="link-column">
                            <h4>Product</h4>
                            <Link to="/tools">All Tools</Link>
                            <Link to="/merge-pdf">Merge PDF</Link>
                            <Link to="/help">Help Center</Link>
                        </div>
                        <div className="link-column">
                            <h4>Company</h4>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/blog">Blog</Link>
                        </div>
                        <div className="link-column">
                            <h4>Legal</h4>
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                            <Link to="/cookies">Cookie Policy</Link>
                            <Link to="/security">Security</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} PDF Saathi. All rights reserved.</p>
                    <div className="social-links">
                        {/* Hide temporary profiles until ready */}
                        {/* <a href="#" aria-label="Twitter"><Twitter size={20} /></a> */}
                        {/* <a href="#" aria-label="GitHub"><Github size={20} /></a> */}
                        <a href="mailto:pdfsaathi.official@gmail.com" aria-label="Email"><Mail size={20} /></a>
                        <a href="https://www.linkedin.com/in/lokeshwar-yemulwar-97924a257" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
