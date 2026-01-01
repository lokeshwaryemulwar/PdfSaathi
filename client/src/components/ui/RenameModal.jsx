import React, { useState, useEffect } from 'react';
import Button from './Button';
import './RenameModal.css';

const RenameModal = ({ isOpen, onClose, onRename, initialName = 'document', extension = '.pdf' }) => {
    const [fileName, setFileName] = useState(initialName);

    useEffect(() => {
        if (isOpen) {
            setFileName(initialName);
        }
    }, [isOpen, initialName]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = fileName.trim() || 'document';
        onRename(trimmedName);
    };

    return (
        <div className="rename-modal-overlay" onClick={onClose}>
            <div className="rename-modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="rename-modal-header">
                        <h2>Rename File</h2>
                    </div>

                    <div className="rename-modal-body">
                        <div className="rename-input-group">
                            <input
                                type="text"
                                className="rename-input"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                autoFocus
                                placeholder="Enter file name"
                            />
                            <span className="rename-extension">{extension}</span>
                        </div>
                    </div>

                    <div className="rename-modal-footer">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Download
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RenameModal;
