import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import './PageGrid.css';

// Set worker locally
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const PageThumbnail = ({ pdf, pageIndex, rotation = 0 }) => {
    const canvasRef = useRef(null);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        const renderPage = async () => {
            if (!pdf || rendered) return;
            try {
                const page = await pdf.getPage(pageIndex + 1);
                const viewport = page.getViewport({ scale: 0.3 }); // Thumbnail scale
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                await page.render(renderContext).promise;
                setRendered(true);
            } catch (err) {
                console.error(`Error rendering page ${pageIndex + 1}`, err);
            }
        };
        renderPage();
    }, [pdf, pageIndex, rendered]);

    return (
        <div className="page-thumbnail-container" style={{ transition: 'transform 0.3s ease', transform: `rotate(${rotation}deg)` }}>
            <div className="page-preview-wrapper">
                <canvas ref={canvasRef} className="page-canvas" />
                {!rendered && <div className="loading-overlay"><Loader2 className="spin" size={16} /></div>}
            </div>
            <div className="page-number" style={{ transform: `rotate(-${rotation}deg)` }}>Page {pageIndex + 1}</div>
        </div>
    );
};

const PageGrid = ({ file, rotation = 0 }) => {
    const [pdfDoc, setPdfDoc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPdf = async () => {
            if (!file) return;
            try {
                setLoading(true);
                const arrayBuffer = await file.arrayBuffer();
                const loadedPdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                setPdfDoc(loadedPdf);
            } catch (err) {
                console.error("Failed to load PDF", err);
            } finally {
                setLoading(false);
            }
        };
        loadPdf();
    }, [file]);

    if (loading) return <div className="page-grid-loading"><Loader2 className="spin" /> Loading thumbnails...</div>;
    if (!pdfDoc) return null;

    return (
        <div className="page-grid-container">
            <h3>Document Overview ({pdfDoc.numPages} Pages)</h3>
            <div className="page-grid">
                {Array.from({ length: pdfDoc.numPages }).map((_, i) => (
                    <PageThumbnail key={i} pdf={pdfDoc} pageIndex={i} rotation={rotation} />
                ))}
            </div>
        </div>
    );
};

export default PageGrid;
