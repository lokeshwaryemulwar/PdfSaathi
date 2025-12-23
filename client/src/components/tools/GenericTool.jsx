import React, { useState } from 'react';
import SEO from '../layout/SEO';
import API_BASE_URL from '../../config';
import { ArrowLeft, Download, AlertCircle, FileText, CheckCircle, RotateCw, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../ui/FileUpload';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './GenericTool.css';
import './GenericToolInputs.css';
import './GenericToolFilename.css';
import PageGrid from './PageGrid';
import AdUnit from '../ads/AdUnit';
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

    // Get rich content for this tool
    const content = getToolContent(endpoint);
    const pageTitle = content.title || propsTitle;
    const pageDescription = content.description || propsDescription;

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    // Construct SoftwareApplication Schema
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
        }
    };

    // Construct FAQ Schema if available
    const faqSchema = content.faq && content.faq.length > 0 ? {
        "@type": "FAQPage",
        "mainEntity": content.faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    } : null;

    // Combine schemas
    const toolSchema = faqSchema ? [softwareSchema, faqSchema] : softwareSchema;

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
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container tool-page">
            <SEO
                title={pageTitle}
                description={pageDescription}
                url={`https://pdfsaathi.in/${endpoint}`}
                schema={toolSchema}
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
                                        <a href={downloadUrl} download={outputFileName} className="download-link">
                                            <Button size="lg" icon={<Download />}>Download File</Button>
                                        </a>
                                        <Button variant="outline" onClick={() => setFiles([])} icon={<ArrowLeft />}>
                                            Process Another
                                        </Button>
                                    </div>


                                </div>
                            ) : (
                                <>
                                    {/* File List for Ready State */}
                                    <div className="file-list-preview">
                                        {files.map((file, idx) => (
                                            <div key={idx} className="file-preview-item">
                                                <FileText size={20} />
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        ))}
                                    </div>

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
                                            <Button variant="outline" onClick={() => setCurrentRotation(r => (r - 90) % 360)} icon={<RotateCcw />}>Left</Button>
                                            <div className="rotation-display">{Math.abs(currentRotation)}°</div>
                                            <Button variant="outline" onClick={() => setCurrentRotation(r => (r + 90) % 360)} icon={<RotateCw />}>Right</Button>
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

                {/* Long Form Publisher Content (New for AdSense) */}
                {content.longDescription && (
                    <section className="seo-section long-description" style={{ marginTop: '3rem', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
                        <div dangerouslySetInnerHTML={{ __html: content.longDescription }} />
                    </section>
                )}
            </div>

            <PageGrid currentTool={endpoint} />
        </div>
    );
};

export default GenericTool;
