import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { ArrowLeft, ArrowUp, ArrowDown, Trash2, File as FileIcon, Download, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/ui/FileUpload';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './MergePdf.css';

const MergePdf = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);

    const handleFilesSelected = (newFiles) => {
        // Basic dup check or add unique ID
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
            const formData = new FormData();
            files.forEach(f => formData.append('files', f.file));

            // TODO: Replace with actual backend URL
            const response = await fetch(`${API_BASE_URL}/api/merge`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Merge failed. Please try again.');
            }

            // Blob response for download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
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
                    <div className="success-icon">✓</div>
                    <h2>PDFs Merged Successfully!</h2>
                    <div className="success-actions">
                        <a href={downloadUrl} download="merged.pdf" style={{ textDecoration: 'none' }}>
                            <Button size="lg" icon={<Download />}>Download Merged PDF</Button>
                        </a>
                        <Button variant="outline" onClick={resetTool}>Merge More Files</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container tool-page">
            <div className="tool-header">
                <Button variant="ghost" onClick={() => navigate('/tools')} className="back-btn">
                    <ArrowLeft size={20} /> Back to Tools
                </Button>
                <h1>Merge PDF Files</h1>
                <p>Combine multiple PDFs into one unified document.</p>
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
    );
};

export default MergePdf;
