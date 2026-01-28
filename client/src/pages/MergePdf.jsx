import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { ArrowLeft, ArrowUp, ArrowDown, Trash2, File as FileIcon, Download, Loader2, FileText } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import FileUpload from '../components/ui/FileUpload';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

import AdUnit from '../components/ads/AdUnit';
import PageGrid from '../components/tools/PageGrid';
import { getToolContent } from '../data/toolContent';
import RenameModal from '../components/ui/RenameModal';
import '../components/tools/GenericTool.css'; // Import shared styles for rich content
import './MergePdf.css';

const MergePdf = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);
    const [openFaqIndex, setOpenFaqIndex] = useState(null); // Accordion State
    const [showRenameModal, setShowRenameModal] = useState(false);

    // Get rich content for Merge PDF
    const content = getToolContent('merge-pdf');
    const pageTitle = content.title;
    const pageDescription = content.description;

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    // Construct SoftwareApplication Schema with embedded FAQ
    const softwareSchema = {
        "@type": "SoftwareApplication",
        "name": pageTitle,
        "operatingSystem": "Any",
        "applicationCategory": "UtilitiesApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "2150"
        },
        // Embed FAQ questions directly in the SoftwareApplication
        ...(content.faq && content.faq.length > 0 && {
            "mainEntity": content.faq.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        })
    };

    // No longer creating separate FAQPage - FAQ is embedded in SoftwareApplication
    const toolSchema = softwareSchema;

    const handleFilesSelected = (newFiles) => {
        const typesFiles = newFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        }));

        setFiles(prev => [...prev, ...typesFiles]);
        setError(null);
    };

    const removeFile = (id) => {
        setFiles(files.filter(f => f.id !== id));
    };

    const moveFile = (index, direction) => {
        const newFiles = [...files];
        if (direction === 'up' && index > 0) {
            [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
        } else if (direction === 'down' && index < newFiles.length - 1) {
            [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        }
        setFiles(newFiles);
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError("Please select at least 2 PDF files to merge.");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Import pdf-lib dynamically
            const { PDFDocument } = await import('pdf-lib');

            // Create a new PDF document
            const mergedPdf = await PDFDocument.create();

            // Process each file
            for (const fileObj of files) {
                const fileBuffer = await fileObj.file.arrayBuffer();
                const pdf = await PDFDocument.load(fileBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            // Save the merged PDF
            const pdfBytes = await mergedPdf.save();

            // Create blob and URL
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (err) {
            console.error('Merge error:', err);
            setError(err.message || 'Failed to merge PDFs. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const resetTool = () => {
        setFiles([]);
        setDownloadUrl(null);
        setError(null);
    };

    return (
        <div className="container tool-page">


            {downloadUrl ? (
                <div className="success-view">
                    <Card className="success-card">
                        <div className="success-icon">✓</div>
                        <h2>PDFs Merged Successfully!</h2>
                        <div className="success-actions">
                            <Button size="lg" icon={<Download />} onClick={() => setShowRenameModal(true)}>Download Merged PDF</Button>
                            <Button variant="outline" onClick={resetTool}>Merge More Files</Button>
                        </div>
                        <RenameModal
                            isOpen={showRenameModal}
                            onClose={() => setShowRenameModal(false)}
                            onRename={(newName) => {
                                const link = document.createElement('a');
                                link.href = downloadUrl;
                                link.download = `${newName}.pdf`;
                                link.click();
                                setShowRenameModal(false);
                            }}
                            initialName="merged"
                            extension=".pdf"
                        />


                    </Card>
                </div>
            ) : (
                <>
                    <div className="tool-main-section">
                        <div className="tool-header">
                            <Button variant="ghost" onClick={() => navigate('/tools')} className="back-btn" icon={<ArrowLeft size={16} />}>
                                Back to Tools
                            </Button>
                            <h1>{pageTitle}</h1>
                            <p>{pageDescription}</p>
                        </div>

                        {files.length === 0 ? (
                            <FileUpload onFilesSelected={handleFilesSelected} accept=".pdf" />
                        ) : (
                            <div className="workspace">
                                <div className="files-list">
                                    {files.map((file, index) => (
                                        <div key={file.id} className="file-item">
                                            <div className="file-info">
                                                <FileIcon className="file-icon-sm" />
                                                <div className="file-details">
                                                    <span className="file-name">{file.name}</span>
                                                    <span className="file-size">{file.size}</span>
                                                </div>
                                            </div>
                                            <div className="file-actions">
                                                <button
                                                    onClick={() => moveFile(index, 'up')}
                                                    disabled={index === 0}
                                                    className="action-icon-btn"
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button
                                                    onClick={() => moveFile(index, 'down')}
                                                    disabled={index === files.length - 1}
                                                    className="action-icon-btn"
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                                <button onClick={() => removeFile(file.id)} className="action-icon-btn danger">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="workspace-actions">
                                    <div className="add-more">
                                        <label htmlFor="add-more-input" className="add-more-label">
                                            + Add more files
                                        </label>
                                        <input
                                            id="add-more-input"
                                            type="file"
                                            onChange={(e) => handleFilesSelected(Array.from(e.target.files))}
                                            multiple
                                            accept=".pdf"
                                            style={{ display: 'none' }}
                                        />
                                    </div>

                                    {error && <div className="error-msg">{error}</div>}

                                    <Button
                                        size="lg"
                                        onClick={handleMerge}
                                        isLoading={isProcessing}
                                        disabled={files.length < 2}
                                    >
                                        {isProcessing ? 'Merging PDFs...' : 'Merge PDFs'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Rich Content Section */}
            <div className="tool-content-section" style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem' }}>
                {content.howTo && (
                    <section className="seo-section how-to">
                        <h2>{content.howTo.heading}</h2>
                        <div className="steps-container">
                            {content.howTo.steps.map((step, index) => (
                                <div key={index} className="step-item">
                                    <div className="step-number">{index + 1}</div>
                                    <div className="step-content">
                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <AdUnit slot="tool_bottom" format="auto" />

                {content.features && (
                    <section className="seo-section features">
                        <h2>Why Use PDF Saathi?</h2>
                        <div className="features-grid">
                            {content.features.map((feature, index) => (
                                <div key={index} className="feature-item">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {content.faq && content.faq.length > 0 && (
                    <section className="seo-section faq">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-list">
                            {content.faq.map((item, index) => (
                                <div
                                    key={index}
                                    className={`faq-item ${openFaqIndex === index ? 'active' : ''}`}
                                >
                                    <button className="faq-question" onClick={() => toggleFaq(index)}>
                                        {item.question}
                                        <span className="faq-icon">▼</span>
                                    </button>
                                    <div className="faq-answer">
                                        <p>{item.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Related Guides Section */}
                {content.relatedGuides && content.relatedGuides.length > 0 && (
                    <section className="seo-section related-guides" style={{ marginTop: '3rem', padding: '2rem', background: '#f8fafc', borderRadius: '12px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={24} color="var(--primary)" />
                            Related Guides & Tutorials
                        </h2>
                        <div className="guides-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            {content.relatedGuides.map((guide, index) => (
                                <Link to={`/blog/${guide.slug}`} key={index} style={{ textDecoration: 'none' }}>
                                    <div className="guide-card" style={{
                                        background: 'white',
                                        padding: '1.2rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{guide.title}</h3>
                                        <div style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            Read Guide <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {content.longDescription && (
                    <div className="seo-section long-description" dangerouslySetInnerHTML={{ __html: content.longDescription }} />
                )}
            </div>

            <PageGrid currentTool="merge-pdf" />
        </div>
    );
};

export default MergePdf;
