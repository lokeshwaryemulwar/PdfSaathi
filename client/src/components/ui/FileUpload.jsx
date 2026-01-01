import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import Button from './Button';
import './FileUpload.css';

const FileUpload = ({
    onFilesSelected,
    accept = '.pdf',
    multiple = true,
    title = 'Drop PDF files here',
    subtitle = 'or click to select files',
    buttonText = 'Select PDF Files'
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (fileList) => {
        // Convert FileList to Array
        const files = Array.from(fileList);
        // Filter by accepted type (basic check)
        // Real validation can happen in parent or more robustly here
        onFilesSelected(files);
    };

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    return (
        <div
            className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept={accept}
                multiple={multiple}
                className="hidden-input"
            />

            <div className="upload-content">
                <div className="upload-icon-wrapper">
                    <UploadCloud size={48} color="var(--primary)" />
                </div>
                <h3 className="upload-title">{title}</h3>
                <p className="upload-subtitle">{subtitle}</p>
                <Button variant="primary" className="mt-4">{buttonText}</Button>
            </div>
        </div>
    );
};

export default FileUpload;
