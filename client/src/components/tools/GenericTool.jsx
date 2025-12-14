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

const GenericTool = ({
    title,
    description,
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

                throw new Error(errorMessage || response.statusText || 'Processing failed. Please try again.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);

            // Set sensible default filename
            const originalName = files[0]?.name.replace(/\.[^/.]+$/, "") || 'processed';

            let extension = '.pdf';
            let suffix = '_processed'; // Default suffix
            if (endpoint === 'pdf-to-word') {
                extension = '.docx';
                suffix = '_converted';
            } else if (endpoint === 'pdf-to-ppt') {
                extension = '.pptx';
                suffix = '_converted';
            } else if (endpoint === 'pdf-to-excel') {
                extension = '.xlsx';
                suffix = '_converted';
            } else if (endpoint === 'compress-pdf') {
                extension = '.zip';
                suffix = '_compressed';
            } else if (endpoint === 'convert-image') {
                extension = `.${inputValues['format'] || 'png'}`;
                suffix = '_converted';
            }

            setOutputFileName(`${originalName}${suffix}${extension}`);

            // Calculate Compression Stats
            if (endpoint === 'compress-pdf') {
                const originalSize = files[0].size;
                const newSize = blob.size;
                const savings = originalSize - newSize;
                const percent = Math.round((savings / originalSize) * 100);

                setCompressionStats({
                    original: (originalSize / 1024 / 1024).toFixed(2),
                    new: (newSize / 1024 / 1024).toFixed(2),
                    percent: percent > 0 ? percent : 0,
                    isSmaller: newSize < originalSize
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetTool = () => {
        setFiles([]);
        setDownloadUrl(null);
        setError(null);
    };

    if (downloadUrl) {
        return (
            <div className="container tool-page success-view">
                <Card className="success-card">
                    <div className="success-icon">
                        <CheckCircle size={40} />
                    </div>
                    <h2>{successMessage}</h2>

                    {/* Compression Stats */}
                    {compressionStats && (
                        <div className="compression-stats" style={{
                            marginBottom: '1rem',
                            padding: '1rem',
                            background: compressionStats.isSmaller ? '#ecfdf5' : '#f3f4f6',
                            borderRadius: '8px',
                            color: compressionStats.isSmaller ? '#047857' : '#374151',
                            textAlign: 'center'
                        }}>
                            {compressionStats.isSmaller ? (
                                <>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        Saved {compressionStats.percent}%!
                                    </div>
                                    <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                                        {compressionStats.original}MB ➝ {compressionStats.new}MB
                                    </div>
                                </>
                            ) : (
                                <div>File was already optimized ({compressionStats.new}MB)</div>
                            )}
                        </div>
                    )}

                    <div className="filename-edit-section">
                        <label>Save as:</label>
                        <input
                            type="text"
                            value={outputFileName}
                            onChange={(e) => setOutputFileName(e.target.value)}
                            className="filename-input"
                        />
                    </div>

                    <div className="success-actions">
                        <a href={downloadUrl} download={outputFileName} style={{ textDecoration: 'none' }}>
                            <Button size="lg" icon={<Download />}>Download File</Button>
                        </a>
                        <Button variant="outline" onClick={resetTool}>Process Another</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container tool-page">
            <SEO
                title={title}
                description={description}
                url={`https://pdfsaathi.in/tools/${endpoint}`}
            />
            <div className="tool-header">
                <Button variant="ghost" onClick={() => navigate('/tools')} className="back-btn">
                    <ArrowLeft size={20} /> Back to Tools
                </Button>
                <div className="header-icon-wrapper">
                    {Icon && <Icon size={32} />}
                </div>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>

            <div className="tool-workspace">
                {files.length === 0 ? (
                    <FileUpload
                        onFilesSelected={handleFilesSelected}
                        accept={accept}
                        multiple={multiple}
                        title={`Drop ${accept.includes('image') ? 'Images' : (accept === '.pdf' ? 'PDF' : 'Files')} here`}
                        buttonText={`Select ${accept.includes('image') ? 'Images' : 'Files'}`}
                    />
                ) : (
                    <div className="selected-file-view">
                        <div className="file-preview-card">
                            <FileText size={32} className="text-primary" />
                            <div className="file-info-text">
                                <span className="file-name-lg">{files[0].name}</span>
                                <span className="file-meta">{(files[0].size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={resetTool} className="remove-btn">
                                Change File
                            </Button>
                        </div>

                        {/* Page Preview Grid for Split PDF */}
                        {endpoint === 'split-pdf' && files.length > 0 && (
                            <PageGrid file={files[0]} />
                        )}

                        {error && (
                            <div className="error-banner">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Specific UI for Rotate PDF */}
                        {endpoint === 'rotate-pdf' && files.length > 0 && (
                            <div className="rotate-tool-container" style={{ textAlign: 'center', margin: '2rem 0' }}>
                                <div className="rotation-controls" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                                    <Button
                                        onClick={() => setCurrentRotation(curr => curr - 90)}
                                        variant="outline"
                                        style={{ height: '60px', width: '140px', fontSize: '1.1rem', borderColor: '#ef4444', color: '#ef4444' }} // Left - Reddish
                                    >
                                        <RotateCcw style={{ marginRight: '8px' }} /> Left
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentRotation(curr => curr + 90)}
                                        variant="outline"
                                        style={{ height: '60px', width: '140px', fontSize: '1.1rem', borderColor: '#ef4444', color: '#ef4444' }} // Right - Reddish
                                    >
                                        <RotateCw style={{ marginRight: '8px' }} /> Right
                                    </Button>
                                </div>

                                <PageGrid file={files[0]} rotation={currentRotation} />
                            </div>
                        )}

                        {/* Dynamic Inputs (Skip for Rotate) */}
                        {inputs.length > 0 && endpoint !== 'rotate-pdf' && (
                            <div className="tool-inputs">
                                {inputs.map(input => (
                                    <div key={input.name} className="form-group">
                                        <label>{input.label}</label>

                                        {/* Dropdown Select */}
                                        {input.type === 'select' && (
                                            <select
                                                value={inputValues[input.name] || ''}
                                                onChange={(e) => handleInputChange(input.name, e.target.value)}
                                            >
                                                {input.options.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        )}

                                        {/* Button Grid Select (Visual) */}
                                        {input.type === 'grid-select' && (
                                            <div className="grid-select-container" style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                                gap: '10px',
                                                marginTop: '8px'
                                            }}>
                                                {input.options.map(opt => {
                                                    const isSelected = (inputValues[input.name] || input.defaultValue) === opt.value;
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            className={`grid-option-btn ${isSelected ? 'selected' : ''}`}
                                                            onClick={() => handleInputChange(input.name, opt.value)}
                                                            style={{
                                                                padding: '12px 0',
                                                                border: isSelected ? '2px solid #6366f1' : '1px solid #e5e7eb',
                                                                borderRadius: '8px',
                                                                backgroundColor: isSelected ? '#e0e7ff' : '#f9fafb',
                                                                color: isSelected ? '#4338ca' : '#374151',
                                                                fontWeight: '600',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Standard Input */}
                                        {input.type !== 'select' && input.type !== 'grid-select' && (
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

                        <Button
                            size="lg"
                            className="process-btn"
                            onClick={handleProcess}
                            isLoading={isProcessing}
                        >
                            {isProcessing ? processingLabel : actionLabel}
                        </Button>
                    </div>
                )}
            </div>

            {/* Tool Page Ad Banner */}
            <div style={{ marginTop: '3rem', maxWidth: '100%', overflow: 'hidden' }}>
                <AdUnit slot="0987654321" style={{ marginBottom: '1rem' }} />
            </div>
        </div>
    );
};

export default GenericTool;
