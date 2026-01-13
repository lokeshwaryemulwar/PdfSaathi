import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, MoveHorizontal } from 'lucide-react';
import API_BASE_URL from '../config';
import FileUpload from '../components/ui/FileUpload';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AdUnit from '../components/ads/AdUnit';
import PageGrid from '../components/tools/PageGrid';
import { getToolContent } from '../data/toolContent';
import RenameModal from '../components/ui/RenameModal';
import '../components/tools/GenericTool.css';
import './RemoveBackground.css';

// Before/After Slider Component
const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
    const [sliderPos, setSliderPos] = useState(50);

    const handleSliderChange = (e) => {
        setSliderPos(e.target.value);
    };

    return (
        <div className="before-after-slider-container">
            {/* Bottom layer - After image (transparent background) */}
            <img src={afterImage} alt="After" className="slider-image after-img" />

            {/* Top layer - Before image (clipped) */}
            <img
                src={beforeImage}
                alt="Before"
                className="slider-image before-img"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            />

            {/* Slider handle */}
            <div className="slider-handle-wrapper" style={{ left: `${sliderPos}%` }}>
                <div className="slider-handle-line"></div>
                <div className="slider-handle-button">
                    <MoveHorizontal size={20} />
                </div>
            </div>

            {/* Labels */}
            <div className="slider-labels">
                <span className="slider-label before">Before</span>
                <span className="slider-label after">After</span>
            </div>

            {/* Input range */}
            <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={handleSliderChange}
                className="slider-range-input"
            />
        </div>
    );
};

const RemoveBackground = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const [showRenameModal, setShowRenameModal] = useState(false);

    // Get rich content
    const content = getToolContent('remove-background');
    const pageTitle = 'Remove Background From Any Photo for Free';
    const pageDescription = 'Upload an image to automatically remove its background with AI precision.';

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (originalImage) URL.revokeObjectURL(originalImage);
            if (processedImage) URL.revokeObjectURL(processedImage);
        };
    }, [originalImage, processedImage]);

    const handleFileSelect = (files) => {
        if (files && files.length > 0) {
            const selectedFile = files[0];
            if (!selectedFile.type.startsWith('image/')) {
                setError('Please select a valid image file (JPG, PNG, WEBP).');
                return;
            }

            setFile(selectedFile);
            setOriginalImage(URL.createObjectURL(selectedFile));
            setProcessedImage(null);
            setError(null);

            // Auto process
            processImage(selectedFile);
        }
    };

    const processImage = async (imageFile) => {
        setIsProcessing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('files', imageFile);

            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

            const response = await fetch(`${API_BASE_URL}/api/remove-background`, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to remove background');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setProcessedImage(url);

        } catch (err) {
            console.error(err);
            if (err.name === 'AbortError') {
                setError('Processing is taking longer than expected. The AI model may be downloading for the first time. Please try again in a few minutes.');
            } else {
                setError(err.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = (filename) => {
        if (processedImage) {
            const link = document.createElement('a');
            link.href = processedImage;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const resetTool = () => {
        setFile(null);
        setOriginalImage(null);
        setProcessedImage(null);
        setError(null);
        setSliderPosition(50);
    };

    return (
        <div className="container tool-page remove-bg-page">
            <div className="tool-main-section">
                <div className="tool-header">
                    <Button variant="ghost" onClick={() => navigate('/tools')} className="back-btn" icon={<ArrowLeft size={16} />}>
                        Back to Tools
                    </Button>
                    <h1>{pageTitle}</h1>
                    <p>{pageDescription}</p>
                </div>

                {!file ? (
                    <FileUpload
                        onFilesSelected={handleFileSelect}
                        accept="image/*"
                        title="Drop your image here"
                        subtitle="PNG, JPG, WEBP supported"
                        buttonText="Select Image"
                    />
                ) : (
                    <div className="workspace">
                        {isProcessing ? (
                            <div className="processing-state">
                                <div className="spinner"></div>
                                <p>Removing background...</p>

                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <div className="error-msg">{error}</div>
                                <Button variant="outline" onClick={resetTool}>
                                    Try Another Image
                                </Button>
                            </div>
                        ) : processedImage ? (
                            <div className="result-section">
                                <div className="comparison-labels">
                                    <span>Original</span>
                                    <span>Background Removed</span>
                                </div>

                                <div className="comparison-container">
                                    {/* Bottom Layer: Result (Transparent) */}
                                    <img src={processedImage} className="compare-image" alt="Result" />

                                    {/* Top Layer: Original, clipped from right */}
                                    <img
                                        src={originalImage}
                                        className="compare-image"
                                        alt="Original"
                                        style={{
                                            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                                        }}
                                    />

                                    {/* Slider Handle */}
                                    <div
                                        className="slider-handle"
                                        style={{ left: `${sliderPosition}%` }}
                                    >
                                        <div className="slider-button">
                                            <MoveHorizontal size={20} />
                                        </div>
                                    </div>

                                    {/* Input Range for Interaction */}
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={sliderPosition}
                                        onChange={(e) => setSliderPosition(e.target.value)}
                                        className="slider-input"
                                    />
                                </div>

                                <div className="result-actions">
                                    <Button size="lg" icon={<Download />} onClick={() => setShowRenameModal(true)}>
                                        Download Image
                                    </Button>
                                    <Button variant="outline" onClick={resetTool}>
                                        Process Another Image
                                    </Button>
                                </div>

                                <RenameModal
                                    isOpen={showRenameModal}
                                    onClose={() => setShowRenameModal(false)}
                                    onRename={(newName) => {
                                        handleDownload(`${newName}.png`);
                                        setShowRenameModal(false);
                                    }}
                                    initialName="no-background"
                                    extension=".png"
                                />
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            <div className="mid-section-header">
                <h2>Why choose our background remover ?</h2>
            </div>

            {/* Informative Content Sections */}
            <div className="info-sections">
                {/* Section 1: Instant and automatic (Girl Image) */}
                <section className="content-showcase-section">
                    <div className="showcase-container">
                        <div className="showcase-text">
                            <h2>Instant and automatic background remover</h2>
                            <p>
                                PDF Saathi's Background Remover automatically clears image backgrounds in seconds!
                                Our advanced AI technology precisely isolates your subject, giving you a clean, transparent background instantly.
                                We understand that speed and quality are paramount. That's why our algorithms are optimized to handle complex edges, ensuring no jagged lines or missed spots.
                                Say goodbye to complex manual editing tools simply upload your photo and let PDF Saathi do the magic.
                                Whether it's HEIC, PNG, or JPG, our tool handles it all. It is designed to be the ultimate productivity booster for designers, marketers, and casual users alike.
                                Perfect for both professionals and beginners, this tool is your quick solution for high-quality background removal.
                                Unlike other tools that may compromise on resolution, we ensure your output remains crisp and clear.
                                Our cloud-based solution means you don't need to install any heavy software; everything happens right in your browser.
                            </p>
                        </div>
                        <div className="showcase-slider">
                            <BeforeAfterSlider
                                beforeImage="/images/examples/flower-crown-girl-before.jpg"
                                afterImage="/images/examples/flower-crown-girl-after.png"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Product Images (Jewellery Image) */}
                <section className="content-showcase-section reverse">
                    <div className="showcase-container">
                        <div className="showcase-slider">
                            <BeforeAfterSlider
                                beforeImage="/images/examples/gold-earrings-before.jpg"
                                afterImage="/images/examples/gold-earrings-after.png"
                            />
                        </div>
                        <div className="showcase-text">
                            <h2>Easily remove background from product images</h2>
                            <p>
                                Need professional product photos? PDF Saathi makes it effortless. Upload your product image
                                and watch as our AI creates a perfect cutout, handling intricate details like jewelry chains,
                                hair, or transparent objects with ease. In the competitive world of e-commerce, a clean product image can significantly boost conversion rates.
                                Our tool ensures your product stands out without distractions. Once processed, you can place your product on any
                                background you choose. It's the ideal tool for creating catalog images, social media posts,
                                or marketing materials directly from your browser, saving you hours of photoshoot post-processing time.
                                This efficiency allows small business owners and massive retailers alike to scale their operations without increasing their budget.
                                Consistent, high-quality images build trust with your customers and elevate your brand's visual identity across all platforms.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Add Background Color (Basket Example - Text Left, Image Right) */}
                <section className="content-showcase-section">
                    <div className="showcase-container">
                        <div className="showcase-text">
                            <h2>Remove BG in seconds and add background color</h2>
                            <p>
                                After removing the background, you have full creative control. Keep it transparent for logos
                                and overlays, or add a solid color to make your subject pop. PDF Saathi gives you a versatile
                                canvas to work with. Customizing your background allows you to match your brand identity or set a specific mood for your composition.
                                The process is simple: Upload, Remove, and Edit. Create stunning visuals
                                for presentations, e-commerce, or personal projects in just a few clicks. No design skills? No problem. Our intuitive interface empowers anyone to become a creator.
                                We support various output formats to suit your needs, whether you are designing a website banner, a flyer, or a personal collage.
                                With PDF Saathi, the possibilities are endless, and the results are always professional-grade.
                            </p>
                        </div>
                        <div className="showcase-slider">
                            <BeforeAfterSlider
                                beforeImage="/images/examples/cat-before.jpg"
                                afterImage="/images/examples/cat-after.png"
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Rich Content Section */}
            <div className="tool-content-section" style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem' }}>
                {content?.howTo && (
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

                {content?.features && (
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

                {content?.faq && content.faq.length > 0 && (
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

                {content?.longDescription && (
                    <div className="seo-section long-description" dangerouslySetInnerHTML={{ __html: content.longDescription }} />
                )}
            </div>

            <PageGrid currentTool="remove-background" />
        </div>
    );
};

export default RemoveBackground;
