import React, { useState } from 'react';
import DynamicSEO from '../layout/DynamicSEO';
import API_BASE_URL from '../../config';
import { ArrowLeft, Download, AlertCircle, FileText, CheckCircle, RotateCw, RotateCcw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import FileUpload from '../ui/FileUpload';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './GenericTool.css';
import './GenericToolInputs.css';
import './GenericToolFilename.css';
import PageGrid from './PageGrid';
import AdUnit from '../ads/AdUnit';
import RenameModal from '../ui/RenameModal';
import { getToolContent } from '../../data/toolContent';

const GenericTool = ({
    title: propsTitle,
    description: propsDescription,
    endpoint,
    accept = '.pdf',
    multiple = false,
    actionLabel = 'Process File',
    processingLabel = 'Processing...',
    successMessage = 'File processed successfully!',
    downloadFileName = 'processed.pdf',
    inputs = [],
    icon: Icon
}) => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);

    // Initialize defaults
    const [inputValues, setInputValues] = useState(() => {
        const defaults = {};
        inputs.forEach(i => {
            if (i.defaultValue) defaults[i.name] = i.defaultValue;
        });
        return defaults;
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [outputFileName, setOutputFileName] = useState(downloadFileName);
    const [compressionStats, setCompressionStats] = useState(null);
    const [currentRotation, setCurrentRotation] = useState(0); // For Rotate Tool
    const [error, setError] = useState(null);
    const [openFaqIndex, setOpenFaqIndex] = useState(null); // Accordion State
    const [showRenameModal, setShowRenameModal] = useState(false);

    // Get rich content for this tool
    const content = getToolContent(endpoint);
    const pageTitle = content.title || propsTitle;
    const pageDescription = content.description || propsDescription;

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
            "ratingValue": "4.8",
            "ratingCount": "1024"
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
        if (!multiple) {
            setFiles([newFiles[0]]);
        } else {
            setFiles(prev => [...prev, ...newFiles]);
        }
        setError(null);
        setDownloadUrl(null);
    };

    const handleInputChange = (name, value) => {
        setInputValues(prev => ({ ...prev, [name]: value }));
    };

    const handleProcess = async () => {
        if (files.length === 0) return;

        // Input Validation
        const missingInputs = inputs.filter(i => i.required && !inputValues[i.name]);
        if (missingInputs.length > 0) {
            setError(`Please provide: ${missingInputs.map(i => i.label).join(', ')}`);
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Client-side processing for split-pdf
            if (endpoint === 'split-pdf') {
                const { PDFDocument } = await import('pdf-lib');

                const startPage = parseInt(inputValues.startPage);
                const endPage = parseInt(inputValues.endPage);

                if (isNaN(startPage) || isNaN(endPage)) {
                    throw new Error('Please enter valid page numbers');
                }

                if (startPage < 1 || endPage < startPage) {
                    throw new Error('Invalid page range. End page must be greater than or equal to start page.');
                }

                // Load the PDF
                const fileBuffer = await files[0].arrayBuffer();
                const pdfDoc = await PDFDocument.load(fileBuffer);
                const totalPages = pdfDoc.getPageCount();

                if (endPage > totalPages) {
                    throw new Error(`PDF only has ${totalPages} pages. Please enter a valid range.`);
                }

                // Create new PDF with selected pages
                const newPdf = await PDFDocument.create();
                const pagesToCopy = [];
                for (let i = startPage - 1; i < endPage; i++) {
                    pagesToCopy.push(i);
                }

                const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
                copiedPages.forEach(page => newPdf.addPage(page));

                // Save and create download
                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                setDownloadUrl(url);
                setOutputFileName(`split-pages-${startPage}-to-${endPage}.pdf`);
                setIsProcessing(false);
                return;
            }

            // Client-side processing for compress-pdf
            if (endpoint === 'compress-pdf') {
                const { PDFDocument } = await import('pdf-lib');

                // Load the PDF
                const fileBuffer = await files[0].arrayBuffer();
                const pdfDoc = await PDFDocument.load(fileBuffer);

                // Save with compression options
                const pdfBytes = await pdfDoc.save({
                    useObjectStreams: true,
                    addDefaultPage: false,
                    objectsPerTick: 50
                });

                const originalSize = files[0].size;
                const compressedSize = pdfBytes.length;
                const savedBytes = originalSize - compressedSize;
                const savedPercentage = ((savedBytes / originalSize) * 100).toFixed(1);

                // Create blob and URL
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                setDownloadUrl(url);
                setOutputFileName('compressed.pdf');

                // Format file sizes intelligently (KB for small files, MB for large)
                const formatSize = (bytes) => {
                    const mb = bytes / 1024 / 1024;
                    if (mb >= 0.1) {
                        return mb.toFixed(2) + ' MB';
                    } else {
                        return (bytes / 1024).toFixed(2) + ' KB';
                    }
                };

                // Set compression stats
                setCompressionStats({
                    ratio: savedPercentage + '%',
                    original: formatSize(originalSize),
                    compressed: formatSize(compressedSize)
                });

                setIsProcessing(false);
                return;
            }

            // Client-side processing for rotate-pdf
            if (endpoint === 'rotate-pdf') {
                const { PDFDocument, degrees } = await import('pdf-lib');
                const fileBuffer = await files[0].arrayBuffer();
                const pdfDoc = await PDFDocument.load(fileBuffer);
                const pages = pdfDoc.getPages();
                pages.forEach(page => {
                    const current = page.getRotation().angle;
                    page.setRotation(degrees(current + currentRotation));
                });
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                setDownloadUrl(url);
                setOutputFileName('rotated.pdf');
                setIsProcessing(false);
                return;
            }

            // Server-side processing for other tools
            const formData = new FormData();
            files.forEach(f => formData.append('files', f));

            // Append additional inputs
            Object.entries(inputValues).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Special case for Rotate Tool
            if (endpoint === 'rotate-pdf') {
                formData.append('angle', currentRotation);
            }

            const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errorMessage;
                try {
                    const errData = await response.json();
                    errorMessage = errData.error;
                } catch (e) {
                    // Could not parse JSON
                }
                throw new Error(errorMessage || 'Processing failed. Please try again.');
            }

            // Handle success
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);

            // Handle metadata headers if present (e.g. compression stats)
            const statsHeader = response.headers.get('X-Compression-Stats');
            if (statsHeader) {
                setCompressionStats(JSON.parse(statsHeader));
            }

            // Set output filename from header or default
            const contentDisposition = response.headers.get('Content-Disposition');
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match) setOutputFileName(match[1]);
            }

        } catch (err) {
            console.error('Processing error:', err);

            // Provide helpful error messages for server-dependent tools
            if (err.message.includes('fetch')) {
                const serverDependentTools = ['pdf-to-word', 'pdf-to-ppt', 'pdf-to-excel', 'word-to-pdf', 'html-to-pdf', 'rotate-pdf', 'unlock-pdf', 'protect-pdf'];
                if (serverDependentTools.includes(endpoint)) {
                    setError(`Server required for this tool. Try our instant client-side tools: Merge, Split, or Compress PDF.`);
                } else {
                    setError('Unable to connect to server. Please check your connection.');
                }
            } else {
                setError(err.message);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container tool-page">
            <DynamicSEO
                title={pageTitle}
                description={pageDescription}
            />

            <div className="tool-main-section">
                <div className="tool-header">
                    <Button variant="ghost" onClick={() => navigate('/tools')} className="back-btn" icon={<ArrowLeft size={16} />}>
                        Back to Tools
                    </Button>
                    <h1>{pageTitle}</h1>
                    <p>{pageDescription}</p>
                </div>

                <div className="tool-workspace-container">
                    {/* Main Tool UI */}
                    {files.length === 0 ? (
                        <div className="upload-section-wrapper">
                            <FileUpload
                                onFilesSelected={handleFilesSelected}
                                accept={accept}
                                multiple={multiple}
                                title={
                                    accept && accept.includes('image') ? 'Drop images here' :
                                        accept && (accept.includes('.doc') || accept.includes('.docx')) ? 'Drop Word files here' :
                                            accept && accept.includes('.html') ? 'Drop HTML files here' :
                                                'Drop PDF files here'
                                }
                                subtitle={
                                    accept && accept.includes('image') ? 'or click to select images' :
                                        accept && (accept.includes('.doc') || accept.includes('.docx')) ? 'or click to select documents' :
                                            accept && accept.includes('.html') ? 'or click to select HTML files' :
                                                'or click to select files'
                                }
                                buttonText={
                                    accept && accept.includes('image') ? 'Select Images' :
                                        accept && (accept.includes('.doc') || accept.includes('.docx')) ? 'Select Word Files' :
                                            accept && accept.includes('.html') ? 'Select HTML Files' :
                                                'Select PDF Files'
                                }
                            />
                        </div>
                    ) : (
                        <div className="workspace">
                            {/* Processing Loading State */}
                            {isProcessing ? (
                                <div className="processing-state">
                                    <div className="spinner"></div>
                                    <p>{processingLabel}</p>
                                </div>
                            ) : downloadUrl ? (
                                <div className="success-state">
                                    <div className="success-icon">
                                        <CheckCircle size={48} color="white" fill="#10B981" />
                                    </div>
                                    <h3>{successMessage}</h3>

                                    {compressionStats && (
                                        <div className="compression-stats">
                                            <p>Size reduced by <span className="highlight">{compressionStats.ratio}</span></p>
                                            <p className="size-detail">{compressionStats.original} → {compressionStats.compressed}</p>
                                        </div>
                                    )}

                                    <div className="action-buttons">
                                        <Button size="lg" icon={<Download />} onClick={() => setShowRenameModal(true)}>Download File</Button>
                                        <Button variant="outline" onClick={() => setFiles([])} icon={<ArrowLeft />}>
                                            Process Another
                                        </Button>
                                    </div>
                                    <RenameModal
                                        isOpen={showRenameModal}
                                        onClose={() => setShowRenameModal(false)}
                                        onRename={(newName) => {
                                            const link = document.createElement('a');
                                            link.href = downloadUrl;

                                            // Handle Extension Preservation
                                            let extension = '.pdf';

                                            // 1. Try to find extension from inputs (e.g. Image Converter)
                                            if (inputValues.format) {
                                                extension = `.${inputValues.format}`;
                                            }
                                            // 2. Fallback to output filename if it has one
                                            else if (outputFileName.includes('.')) {
                                                extension = '.' + outputFileName.split('.').pop();
                                            }

                                            link.download = `${newName}${extension}`;
                                            link.click();
                                            setShowRenameModal(false);
                                        }}
                                        initialName={outputFileName ? outputFileName.replace(/\.[^/.]+$/, "") : "processed"}
                                        extension={
                                            inputValues.format
                                                ? `.${inputValues.format}`
                                                : (outputFileName && outputFileName.includes('.') ? '.' + outputFileName.split('.').pop() : '.pdf')
                                        }
                                    />


                                </div>
                            ) : (
                                <>
                                    {/* File Preview Grid */}
                                    {endpoint === 'rotate-pdf' ? (
                                        <PageGrid file={files[0]} rotation={currentRotation} />
                                    ) : (
                                        <div className="file-list-preview">
                                            {files.map((file, idx) => (
                                                <div key={idx} className="file-preview-item">
                                                    <FileText size={20} />
                                                    <span className="file-name">{file.name}</span>
                                                    <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Dynamic Inputs */}
                                    {inputs.length > 0 && (
                                        <div className="tool-inputs">
                                            {inputs.map(input => (
                                                <div key={input.name} className="input-group">
                                                    <label>{input.label}</label>
                                                    {input.type === 'select' ? (
                                                        <select
                                                            value={inputValues[input.name]}
                                                            onChange={(e) => handleInputChange(input.name, e.target.value)}
                                                        >
                                                            {input.options.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                    ) : input.type === 'grid-select' ? (
                                                        <div className="grid-select">
                                                            {input.options.map(opt => (
                                                                <button
                                                                    key={opt.value}
                                                                    className={`grid-option ${inputValues[input.name] === opt.value ? 'selected' : ''}`}
                                                                    onClick={() => handleInputChange(input.name, opt.value)}
                                                                >
                                                                    {opt.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type={input.type}
                                                            placeholder={input.placeholder}
                                                            value={inputValues[input.name] || ''}
                                                            onChange={(e) => handleInputChange(input.name, e.target.value)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Rotate Tool Special UI */}
                                    {endpoint === 'rotate-pdf' && (
                                        <div className="rotate-controls">
                                            <Button variant="outline" onClick={() => setCurrentRotation(r => (r - 90 + 360) % 360)} icon={<RotateCcw />}>Rotate Left</Button>
                                            <div className="rotation-display" style={{ fontWeight: 600, color: 'var(--primary)' }}>{currentRotation}°</div>
                                            <Button variant="outline" onClick={() => setCurrentRotation(r => (r + 90) % 360)} icon={<RotateCw />}>Rotate Right</Button>
                                        </div>
                                    )}

                                    {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}

                                    <Button
                                        size="lg"
                                        onClick={handleProcess}
                                        isLoading={isProcessing}
                                        className="process-btn"
                                    >
                                        {actionLabel}
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* SEO Content Section - Rich content for better rankings */}
            <div className="tool-content-section" style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem' }}>

                {/* How To Section */}
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

                {/* Features Section */}
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

                {/* FAQ Section */}
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

                {/* Related Guides Section (Internal Linking) */}
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

                {/* Long Form Publisher Content (New for AdSense) */}
                {content.longDescription && (
                    <section className="seo-section long-description">
                        <div dangerouslySetInnerHTML={{ __html: content.longDescription }} />
                    </section>
                )}
            </div>

            <PageGrid currentTool={endpoint} />
        </div>
    );
};

export default GenericTool;
