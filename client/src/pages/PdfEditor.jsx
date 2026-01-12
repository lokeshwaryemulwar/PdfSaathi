import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, PencilBrush, IText, Image as FabricImage } from 'fabric';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import {
    Type,
    Pencil,
    Eraser,
    Image as ImageIcon,
    Download,
    MousePointer,
    Highlighter,
    Undo,
    Redo,
    ChevronLeft,
    Check,
    ArrowLeft,
    ZoomIn,
    ZoomOut
} from 'lucide-react';
import Button from '../components/ui/Button';
import RenameModal from '../components/ui/RenameModal';
import FileUpload from "../components/ui/FileUpload";

import { getToolContent } from '../data/toolContent';
import '../components/tools/GenericTool.css';
import './PdfEditor.css';

// Set up PDF.js worker
// Using cdnjs for v3.11.174 (stable)
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PdfEditor() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null); // pdfjs proxy
    const [pages, setPages] = useState([]); // Array of viewport/canvas data
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [canvas, setCanvas] = useState(null);
    const [activeTool, setActiveTool] = useState('select');
    const [isProcessing, setIsProcessing] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showRenameModal, setShowRenameModal] = useState(false);

    // Undo/Redo State
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // History Refs (Use refs to avoid stale closures in event listeners)
    const historyRef = useRef([]);
    const historyIndexRef = useRef(-1);
    const isHistoryLocked = useRef(false);

    // Refs for canvas container
    const canvasContainerRef = useRef(null);
    const fabricCanvasRef = useRef(null); // Store the actual fabric canvas instance
    const fileInputRef = useRef(null);
    const baseDimensionsRef = useRef({ width: 0, height: 0 }); // Store base (100%) dimensions

    // Get Content
    const content = getToolContent('edit-pdf');
    const pageTitle = content.title;
    const pageDescription = content.description;

    // Toggle FAQ
    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    // --- Zoom Management ---
    const handleZoom = (delta) => {
        const c = fabricCanvasRef.current;
        if (!c) return;

        let newZoom = zoomLevel + delta;
        // Clamp zoom between 0.5x and 3.0x
        if (newZoom < 0.5) newZoom = 0.5;
        if (newZoom > 3.0) newZoom = 3.0;

        // Round to 1 decimal to avoid float precision issues in UI
        newZoom = Math.round(newZoom * 10) / 10;

        if (newZoom === zoomLevel) return;

        setZoomLevel(newZoom);
        c.setZoom(newZoom);

        // Resize canvas container so scrollbars appear
        c.setWidth(baseDimensionsRef.current.width * newZoom);
        c.setHeight(baseDimensionsRef.current.height * newZoom);
    };

    // --- History Management ---

    const updateHistoryState = () => {
        const idx = historyIndexRef.current;
        const len = historyRef.current.length;
        setCanUndo(idx > 0);
        setCanRedo(idx < len - 1);
    };

    const saveHistory = () => {
        if (isHistoryLocked.current || !fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;
        // Exclude background image from JSON to save memory/speed?
        // Ideally we keep it to ensure "complete" state, but it might be heavy.
        // For MVP stability: Keep it simple.
        const json = JSON.stringify(canvas.toJSON());

        // Slice ability to redo if we made a new change
        if (historyIndexRef.current < historyRef.current.length - 1) {
            historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
        }

        historyRef.current.push(json);
        historyIndexRef.current = historyRef.current.length - 1;

        updateHistoryState();
    };

    const handleUndo = () => {
        if (historyIndexRef.current <= 0) return;

        isHistoryLocked.current = true;
        historyIndexRef.current -= 1;
        const json = historyRef.current[historyIndexRef.current];

        const canvas = fabricCanvasRef.current;
        canvas.loadFromJSON(json).then(() => {
            canvas.renderAll();
            isHistoryLocked.current = false;
            updateHistoryState();
        });
    };

    const handleRedo = () => {
        if (historyIndexRef.current >= historyRef.current.length - 1) return;

        isHistoryLocked.current = true;
        historyIndexRef.current += 1;
        const json = historyRef.current[historyIndexRef.current];

        const canvas = fabricCanvasRef.current;
        canvas.loadFromJSON(json).then(() => {
            canvas.renderAll();
            isHistoryLocked.current = false;
            updateHistoryState();
        });
    };

    // Setup Canvas Listeners
    useEffect(() => {
        if (!canvas) return;

        // Initial History Save
        const initialJson = JSON.stringify(canvas.toJSON());
        historyRef.current = [initialJson];
        historyIndexRef.current = 0;
        updateHistoryState();

        const onObjectModified = () => saveHistory();

        canvas.on('object:added', onObjectModified);
        canvas.on('object:modified', onObjectModified);
        canvas.on('object:removed', onObjectModified);

        return () => {
            canvas.off('object:added', onObjectModified);
            canvas.off('object:modified', onObjectModified);
            canvas.off('object:removed', onObjectModified);
        };
    }, [canvas]);

    // 1. Handle File Upload
    const handleFileSelect = async (files) => {
        if (files && files.length > 0) {
            const uploadedFile = files[0];
            setFile(uploadedFile);
            loadPdf(uploadedFile);
        }
    };

    // 2. Load PDF using PDF.js
    const loadPdf = async (file) => {
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            // Use named import 'getDocument'
            const loadingTask = getDocument(arrayBuffer);
            const pdf = await loadingTask.promise;
            setPdfDoc(pdf);

            // Generate thumbnails/placeholders for all pages
            const pagesData = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                pagesData.push({ pageNumber: i });
            }
            setPages(pagesData);

            // Render first page immediately
            await renderPage(pdf, 1);
        } catch (error) {
            console.error("Error loading PDF:", error);
            // Show detailed error message to user/developer
            alert(`Failed to load PDF: ${error.message || error}`);
            setFile(null); // Reset on error
        } finally {
            setIsProcessing(false);
        }
    };

    // 3. Render Page to Fabric Canvas
    const renderPage = async (pdf, pageNum) => {
        // Wait for container to be available if switching from upload view
        // We use a timeout to let React render the editor view first
        if (!canvasContainerRef.current) {
            setTimeout(() => renderPage(pdf, pageNum), 100);
            return;
        }

        // Dispose old canvas if exists
        try {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
            }
        } catch (e) {
            console.warn("Canvas dispose warning:", e);
        }

        // Reset History when changing pages (Per-page history is ideal, but for MVP we wipe on page turn)
        historyRef.current = [];
        historyIndexRef.current = -1;
        setCanUndo(false);
        setCanRedo(false);

        const page = await pdf.getPage(pageNum);

        // Dynamic scaling logic
        const unscaledViewport = page.getViewport({ scale: 1 });
        const windowWidth = window.innerWidth;
        // On mobile (<768px), subtract some padding (32px), otherwise use 1.5 scale or appropriate desktop sizing
        // We cap the scale at 1.5 to prevent it from being too huge on large screens,
        // but ensure it fits within the viewport width on mobile.
        let targetScale = 1.5;

        if (windowWidth < 768) {
            // Mobile: Fit to width with some padding
            const availableWidth = windowWidth - 32; // 1rem padding either side approximately
            targetScale = availableWidth / unscaledViewport.width;
        }

        const viewport = page.getViewport({ scale: targetScale });

        // Create canvas element
        const canvasEl = document.createElement('canvas');
        canvasEl.width = viewport.width;
        canvasEl.height = viewport.height;

        const context = canvasEl.getContext('2d');
        await page.render({ canvasContext: context, viewport }).promise;

        // Convert rendered page to image URL
        const bgUrl = canvasEl.toDataURL();

        // Initialize Fabric Canvas (Named Import Usage)
        const newCanvas = new Canvas(canvasContainerRef.current, {
            width: viewport.width,
            height: viewport.height,
            backgroundColor: '#fff'
        });

        // Set PDF page as background
        FabricImage.fromURL(bgUrl).then((img) => {
            newCanvas.backgroundImage = img;
            newCanvas.renderAll();
            // Manually trigger save history once bg is loaded if we want "Base State" to include Undo-to-Empty?
            // The useEffect hook handles initial save, but bg load is async.
            // We might need to update the initial history entry later.
            // For now, it's fine.
        });

        // OLD CODE WAS:
        /*
        newCanvas.setBackgroundImage(bgUrl, newCanvas.renderAll.bind(newCanvas), {
            originX: 'left',
            originY: 'top'
        });
        */



        fabricCanvasRef.current = newCanvas;
        setCanvas(newCanvas);
        setCurrentPageIndex(pageNum - 1);

        // Store base dimensions for zoom
        baseDimensionsRef.current = { width: viewport.width, height: viewport.height };
        setZoomLevel(1); // Reset zoom on page turn

    };

    // 4. Tool Handlers
    const setTool = (tool) => {
        setActiveTool(tool);
        const c = fabricCanvasRef.current;
        if (!c) return;

        c.isDrawingMode = false;
        c.selection = true;

        switch (tool) {
            case 'draw':
                c.isDrawingMode = true;
                c.freeDrawingBrush = new PencilBrush(c);
                c.freeDrawingBrush.width = 3;
                c.freeDrawingBrush.color = 'black';
                break;
            case 'highlight':
                c.isDrawingMode = true;
                c.freeDrawingBrush = new PencilBrush(c);
                c.freeDrawingBrush.width = 15;
                c.freeDrawingBrush.color = 'rgba(255, 255, 0, 0.4)'; // Transparent yellow
                break;
            case 'whiteout':
                // Whiteout Mode: Draw white rectangles to cover text
                c.isDrawingMode = true;
                c.freeDrawingBrush = new PencilBrush(c);
                c.freeDrawingBrush.width = 20;
                c.freeDrawingBrush.color = 'white';
                break;
            case 'text':
                addText();
                setActiveTool('select');
                break;
            case 'image':
                fileInputRef.current.click();
                break;
            default:
                break;
        }
    };

    const addText = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;

        const text = new IText('Type here...', {
            left: 100,
            top: 100,
            fontSize: 20,
            fill: 'black'
        });
        c.add(text);
        c.setActiveObject(text);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target.result;
            FabricImage.fromURL(data).then((img) => {
                img.set({
                    left: 100,
                    top: 100,
                    scaleX: 0.5,
                    scaleY: 0.5
                });
                fabricCanvasRef.current.add(img);
                setActiveTool('select');
            });
        };
        reader.readAsDataURL(file);
    };

    // Helper: Process transparency to remove gray halos from whiteout
    const processWhiteoutOverlay = (dataUrl) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Loop through pixels
                // R=0, G=1, B=2, A=3
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];

                    // If pixel is semi-transparent and whitish (Eraser/Whiteout)
                    // We simply check if alpha > 0. Since we cleared background, only drawings exist.
                    // If it's a white stroke (which our eraser is), we force full opacity.
                    // To be safe, we check if it is "white-ish"
                    if (a > 0 && r > 200 && g > 200 && b > 200) {
                        // Hard threshold: Make it fully opaque
                        data[i + 3] = 255;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = dataUrl;
        });
    };

    // 5. Save / Download Logic
    const initiateDownload = () => {
        setShowRenameModal(true);
    };

    const executeDownload = async (fileName) => {
        if (!file || !fabricCanvasRef.current) return;
        setIsProcessing(true);

        try {
            // Load original PDF
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();

            const currPage = pages[currentPageIndex];
            const { width, height } = currPage.getSize();

            const c = fabricCanvasRef.current;
            const originalBg = c.backgroundImage;
            const originalBgColor = c.backgroundColor;

            // Hide background image and color to capture ONLY drawings
            c.backgroundImage = null;
            c.backgroundColor = null;
            c.renderAll();

            // Calculate multiplier to ensure high-res export
            // We want the exported image to be high quality (e.g., 2.5x PDF resolution)
            // regardless of the current screen/canvas size (which might be small on mobile).
            const pdfLongestSide = Math.max(width, height);
            const canvasLongestSide = Math.max(c.width, c.height);
            // Increase scaler to 3x to ensure very sharp edges before thresholding
            const multiplier = (pdfLongestSide / canvasLongestSide) * 3;

            // Export canvas as image (overlay layer)
            let overlayDataUrl = c.toDataURL({
                format: 'png',
                multiplier: multiplier
            });

            // Post-process to fix alpha blending artifacts (gray halos)
            overlayDataUrl = await processWhiteoutOverlay(overlayDataUrl);


            // Restore bg
            c.backgroundImage = originalBg;
            c.backgroundColor = originalBgColor;
            c.renderAll();

            // Embed overlay into PDF
            const overlayImage = await pdfDoc.embedPng(overlayDataUrl);

            // Handle Page Rotation
            const { angle } = currPage.getRotation();
            // currPage.getSize() returns the specific MediaBox (unrotated) dimensions
            // But if we have 90/270 deg rotation, visual Width is height, etc.

            const options = {
                width: width,
                height: height,
            };

            if (angle === 90) {
                options.rotate = degrees(90);
                options.x = width;
                options.y = 0;
                options.width = height; // Swap width/height for image scaling
                options.height = width;
            } else if (angle === 180) {
                options.rotate = degrees(180);
                options.x = width;
                options.y = height;
            } else if (angle === 270) {
                options.rotate = degrees(270);
                options.x = 0;
                options.y = height;
                options.width = height; // Swap
                options.height = width;
            } else {
                options.x = 0;
                options.y = 0;
            }

            currPage.drawImage(overlayImage, options);

            // Save
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${fileName}.pdf`;
            link.click();
            setShowRenameModal(false);

        } catch (err) {
            console.error("Save failed:", err);
            alert("Could not update PDF. See console.");
        } finally {
            setIsProcessing(false);
        }
    };

    // ------------------------------------------
    // Custom Render Logic: Upload vs Editor Mode
    // ------------------------------------------

    if (!file) {
        // MATCH GENERIC TOOL/MERGE PDF STYLE
        return (
            <div className="container tool-page">


                <div className="tool-main-section">
                    <div className="tool-header">
                        <Button variant="ghost" onClick={() => navigate('/tools')} className="back-btn" icon={<ArrowLeft size={16} />}>
                            Back to Tools
                        </Button>
                        <h1>{pageTitle}</h1>
                        <p>{pageDescription}</p>
                    </div>

                    <FileUpload onFilesSelected={handleFileSelect} accept=".pdf" />
                </div>

                {/* RICH CONTENT SECTION (Same as other tools) */}
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

                    {content.longDescription && (
                        <div className="seo-section long-description" dangerouslySetInnerHTML={{ __html: content.longDescription }} />
                    )}
                </div>
            </div>



        );
    }

    // EDITOR UI
    return (
        <div className="pdf-editor-container">
            {/* Header */}
            <header className="editor-header">
                <div className="file-name-display">
                    <Button variant="ghost" size="sm" onClick={() => setFile(null)} icon={<ChevronLeft size={16} />}>Back</Button>
                    <span>{file.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Auto-saves to browser memory</span>
                    <Button size="sm" onClick={initiateDownload} isLoading={isProcessing} icon={<Download size={16} />}>
                        Done & Download
                    </Button>
                </div>
            </header>

            {/* Toolbar */}
            <div className="editor-toolbar">
                <button
                    className="tool-btn"
                    onClick={handleUndo}
                    disabled={!canUndo}
                    style={{ opacity: canUndo ? 1 : 0.5 }}
                    title="Undo"
                >
                    <Undo size={20} />
                </button>
                <button
                    className="tool-btn"
                    onClick={handleRedo}
                    disabled={!canRedo}
                    style={{ opacity: canRedo ? 1 : 0.5 }}
                    title="Redo"
                >
                    <Redo size={20} />
                </button>
                <div className="toolbar-divider" style={{ width: '1px', height: '24px', backgroundColor: '#ddd', margin: '0 0.5rem' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '1rem' }}>
                    <button className="tool-btn" onClick={() => handleZoom(-0.1)} title="Zoom Out">
                        <ZoomOut size={20} />
                    </button>
                    <span style={{ fontSize: '0.8rem', minWidth: '3rem', textAlign: 'center' }}>
                        {Math.round(zoomLevel * 100)}%
                    </span>
                    <button className="tool-btn" onClick={() => handleZoom(0.1)} title="Zoom In">
                        <ZoomIn size={20} />
                    </button>
                </div>
                <div className="toolbar-divider" style={{ width: '1px', height: '24px', backgroundColor: '#ddd', margin: '0 0.5rem' }}></div>

                <button className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`} onClick={() => setTool('select')} title="Select Object">
                    <MousePointer size={20} /> Select
                </button>
                <button className={`tool-btn ${activeTool === 'whiteout' ? 'active' : ''}`} onClick={() => setTool('whiteout')} title="Eraser / Whiteout">
                    <Eraser size={20} /> Eraser
                </button>
                <button className={`tool-btn ${activeTool === 'text' ? 'active' : ''}`} onClick={() => setTool('text')} title="Add Text">
                    <Type size={20} /> Text
                </button>
                <button className={`tool-btn ${activeTool === 'draw' ? 'active' : ''}`} onClick={() => setTool('draw')} title="Draw Pencil">
                    <Pencil size={20} /> Draw
                </button>
                <button className={`tool-btn ${activeTool === 'highlight' ? 'active' : ''}`} onClick={() => setTool('highlight')} title="Highlighter">
                    <Highlighter size={20} /> Highlight
                </button>
                <button className={`tool-btn ${activeTool === 'image' ? 'active' : ''}`} onClick={() => setTool('image')} title="Add Image">
                    <ImageIcon size={20} /> Image
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>

            {/* Workspace */}
            <div className="editor-workspace">
                {/* Sidebar */}
                <div className="thumbnails-sidebar">
                    {pages.map((p, i) => (
                        <div
                            key={i}
                            className={`thumbnail-item ${i === currentPageIndex ? 'active' : ''}`}
                            onClick={() => {
                                if (i !== currentPageIndex) {
                                    renderPage(pdfDoc, i + 1);
                                }
                            }}
                        >
                            <div className="thumbnail-img" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                Page {i + 1}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Canvas */}
                <div className="canvas-area">
                    <div className="canvas-container">
                        <canvas ref={canvasContainerRef} />
                    </div>
                </div>
            </div>


            <RenameModal
                isOpen={showRenameModal}
                onClose={() => setShowRenameModal(false)}
                onRename={executeDownload}
                initialName={file ? file.name.replace('.pdf', '') : 'document'}
                extension=".pdf"
            />
        </div >
    );
}
