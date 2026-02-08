const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const pdfParse = require('pdf-parse');
const WordExtractor = require("word-extractor");
const Jimp = require('jimp');
// const puppeteer = require('puppeteer'); // Disabled to save memory on Render Free Tier

// Helper to cleanup files
const cleanup = (files) => {
    if (files) {
        files.forEach(f => {
            try { fs.unlinkSync(f.path); } catch (e) { }
        });
    }
};

// 2. SPLIT PDF - Range Support
exports.splitPdf = async (req, res) => {
    try {
        const file = req.files[0];
        const { startPage, endPage } = req.body;

        if (!startPage || !endPage) {
            return res.status(400).json({ error: 'Please provide split range.' });
        }

        const pdfBytes = fs.readFileSync(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        let start = parseInt(startPage) - 1; // 0-indexed
        let endVal = parseInt(endPage);

        // Smart UX: If endPage is 0 or invalid, assume "End of Document"
        if (isNaN(endVal) || endVal <= 0) {
            endVal = totalPages;
        }
        let end = endVal - 1;

        if (start < 0 || end >= totalPages || start > end) {
            return res.status(400).json({ error: `Invalid range. Document has ${totalPages} pages.` });
        }

        const newPdf = await PDFDocument.create();
        const range = [];
        for (let i = start; i <= end; i++) range.push(i);

        const copiedPages = await newPdf.copyPages(pdfDoc, range);
        copiedPages.forEach(p => newPdf.addPage(p));

        const outBytes = await newPdf.save();
        cleanup(req.files);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=split_${startPage}-${endPage}.pdf`);
        res.send(Buffer.from(outBytes));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Split failed' });
    }
};

// 12. IMAGE CONVERTER (Polyglot via Python/Pillow)
exports.convertImage = async (req, res) => {
    try {
        const file = req.files[0];
        let format = req.body.format || 'png';
        format = format.toLowerCase();

        // Validate format (Extended list)
        const validFormats = ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'webp', 'gif', 'ico', 'eps', 'tga'];
        if (!validFormats.includes(format)) {
            return res.status(400).json({ error: 'Unsupported target format.' });
        }

        const outputFilename = `converted.${format}`;
        const outputPath = path.join(path.dirname(file.path), outputFilename);

        // Spawn Python process
        const scriptPath = path.resolve(__dirname, '../convert_image.py');
        const pythonProcess = spawn('python', [scriptPath, file.path, outputPath, format]);

        pythonProcess.stdout.on('data', (data) => console.log(`Python Output (Img): ${data}`));
        pythonProcess.stderr.on('data', (data) => console.error(`Python Error (Img): ${data}`));

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                cleanup(req.files);
                return res.status(500).json({ error: 'Image conversion failed.' });
            }

            if (!fs.existsSync(outputPath)) {
                cleanup(req.files);
                return res.status(500).json({ error: 'Output generation failed.' });
            }

            const fileBuffer = fs.readFileSync(outputPath);

            // Mime types
            const mimeMap = {
                'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
                'webp': 'image/webp', 'gif': 'image/gif', 'bmp': 'image/bmp',
                'tiff': 'image/tiff', 'ico': 'image/x-icon', 'eps': 'application/postscript',
                'tga': 'image/targa'
            };

            res.setHeader('Content-Type', mimeMap[format] || 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename=${outputFilename}`);
            res.send(fileBuffer);

            cleanup(req.files);
            try { fs.unlinkSync(outputPath); } catch (e) { }
        });

    } catch (error) {
        console.error('Image Conversion Stack:', error);
        if (req.files) cleanup(req.files);
        res.status(500).json({ error: 'Image conversion failed: ' + error.message });
    }
};

// 3. COMPRESS PDF (Basic)
exports.compressPdf = async (req, res) => {
    try {
        const file = req.files[0];
        const pdfBytes = fs.readFileSync(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Enable object streams to reduce size
        const outBytes = await pdfDoc.save({ useObjectStreams: true });

        cleanup(req.files);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
        res.send(Buffer.from(outBytes));
    } catch (error) {
        console.error('Compress error:', error);
        if (req.files) cleanup(req.files);
        res.status(500).json({ error: 'Compression failed: ' + error.message });
    }
};

// 12. ROTATE PDF
exports.rotatePdf = async (req, res) => {
    try {
        const file = req.files[0];
        const angle = parseInt(req.body.angle) || 90;

        const pdfBytes = fs.readFileSync(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const pages = pdfDoc.getPages();
        pages.forEach(page => {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + angle));
        });

        const outBytes = await pdfDoc.save();
        cleanup(req.files);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=rotated.pdf');
        res.send(Buffer.from(outBytes));
    } catch (error) {
        res.status(500).json({ error: 'Rotate failed' });
    }
};

// 14. PROTECT PDF
// 14. PROTECT PDF (High-Fidelity via Python to avoid pdf-lib issues)
exports.protectPdf = async (req, res) => {
    try {
        const file = req.files[0];
        const { password } = req.body;

        if (!password) return res.status(400).json({ error: 'Password required' });

        const outputFilename = 'protected.pdf';
        const outputPath = path.join(path.dirname(file.path), outputFilename);

        // Spawn Python process
        const scriptPath = path.resolve(__dirname, '../protect_pdf.py');
        const pythonProcess = spawn('python', [scriptPath, file.path, outputPath, password]);

        pythonProcess.stdout.on('data', (data) => console.log(`Python Output (Protect): ${data}`));
        pythonProcess.stderr.on('data', (data) => console.error(`Python Error (Protect): ${data}`));

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                cleanup(req.files);
                return res.status(500).json({ error: 'Protection failed. File might be corrupted or already encrypted.' });
            }

            if (!fs.existsSync(outputPath)) {
                cleanup(req.files);
                return res.status(500).json({ error: 'Output generation failed.' });
            }

            const fileBuffer = fs.readFileSync(outputPath);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=protected.pdf');
            res.send(fileBuffer);

            cleanup(req.files);
            try { fs.unlinkSync(outputPath); } catch (e) { }
        });

    } catch (error) {
        console.error('Protect PDF Error:', error);
        res.status(500).json({ error: 'Protect failed: ' + error.message });
    }
};

// 15. UNLOCK PDF (Simulated)
exports.unlockPdf = async (req, res) => {
    // True unlocking requires the password. If user provides it, we can decrypt.
    // However, pdf-lib load() takes the password.
    try {
        const file = req.files[0];
        const { password } = req.body;

        // Attempt to load with password if encrypted
        const pdfBytes = fs.readFileSync(file.path);

        // Note: If request comes from browser, we might not need to actually "decrypt" if we are just saving it again without encryption
        // but pdf-lib requires password to load it first.
        let pdfDoc;
        try {
            pdfDoc = await PDFDocument.load(pdfBytes, { password });
        } catch (e) {
            return res.status(400).json({ error: 'Incorrect password or file not encrypted.' });
        }

        const outBytes = await pdfDoc.save(); // Saved without encryption
        cleanup(req.files);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=unlocked.pdf');
        res.send(Buffer.from(outBytes));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unlock failed' });
    }
};

// 4. JPG to PDF (Multi-image)
exports.imgToPdf = async (req, res) => {
    try {
        const pdfDoc = await PDFDocument.create();

        for (const file of req.files) {
            const imgBytes = fs.readFileSync(file.path);
            let image;
            if (file.mimetype.includes('png')) {
                image = await pdfDoc.embedPng(imgBytes);
            } else {
                image = await pdfDoc.embedJpg(imgBytes);
            }

            // Auto fit to page
            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }

        const outBytes = await pdfDoc.save();
        cleanup(req.files);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=images.pdf');
        res.send(Buffer.from(outBytes));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Image to PDF failed' });
    }
};

// 6. WORD to PDF (High-Fidelity via docx2pdf)
exports.wordToPdf = async (req, res) => {
    try {
        const file = req.files[0];
        const outputFilename = 'converted.pdf';
        const outputPath = path.join(path.dirname(file.path), outputFilename);

        // Spawn Python process
        const scriptPath = path.resolve(__dirname, '../convert_pdf.py');
        const pythonProcess = spawn('python', [scriptPath, file.path, outputPath]);

        pythonProcess.stdout.on('data', (data) => console.log(`Python Output (PDF): ${data}`));
        pythonProcess.stderr.on('data', (data) => console.error(`Python Error (PDF): ${data}`));

        pythonProcess.on('error', (err) => {
            console.error('Failed to start Python process:', err);
            res.status(500).json({ error: 'Failed to launch conversion engine.' });
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                cleanup(req.files);
                return res.status(500).json({ error: 'Word conversion failed. Ensure Microsoft Word is installed on the server.' });
            }

            // check if file exists
            if (!fs.existsSync(outputPath)) {
                cleanup(req.files);
                return res.status(500).json({ error: 'Output file generation failed.' });
            }

            const fileBuffer = fs.readFileSync(outputPath);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
            res.send(fileBuffer);

            cleanup(req.files);
            try { fs.unlinkSync(outputPath); } catch (e) { }
        });

    } catch (error) {
        console.error('Word to PDF Stack:', error);
        res.status(500).json({ error: 'Conversion failed: ' + error.message });
    }
};

// 7. PDF to WORD (Basic text extraction)
const PptxGenJS = require("pptxgenjs");

// 7. PDF to WORD (Improved to HTML-Doc)
const { Document, Packer, Paragraph, TextRun } = require("docx");

// 7. PDF to WORD (High-Fidelity via Python)
// 7. PDF to WORD (Disabled for Memory Stability)
exports.pdfToWord = async (req, res) => {
    // The 'pdf2docx' library requires OpenCV + Pandas (Huge Memory).
    // Disabled to ensure the server stays online for Login/Signup.
    if (req.files) cleanup(req.files);
    return res.status(503).json({
        error: 'High-fidelity PDF to Word conversion is temporarily disabled to prevent server crash (Memory Limit). Basic text extraction will be enabled soon.'
    });
};

// 9. PDF to PPT
exports.pdfToPpt = async (req, res) => {
    try {
        const file = req.files[0];
        const dataBuffer = fs.readFileSync(file.path);

        // Extract text
        const data = await pdfParse(dataBuffer);
        const text = data.text || "";

        const pptx = new PptxGenJS();

        // Split text roughly by length to create slides (naive approach since we lack page-by-page text map from pdf-parse safely)
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        const linesPerSlide = 15;

        for (let i = 0; i < lines.length; i += linesPerSlide) {
            const slide = pptx.addSlide();
            const slideText = lines.slice(i, i + linesPerSlide).join('\n');
            slide.addText(slideText, { x: 0.5, y: 0.5, w: '90%', h: '80%', fontSize: 14, color: '363636' });
        }

        if (lines.length === 0) {
            const slide = pptx.addSlide();
            slide.addText("No text could be extracted from this PDF.", { x: 1, y: 1 });
        }

        const buffer = await pptx.write("nodebuffer");

        cleanup(req.files);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', 'attachment; filename=presentation.pptx');
        res.send(buffer);
    } catch (error) {
        console.error('PDF to PPT Stack:', error.stack);
        res.status(500).json({ error: 'PPT conversion failed. Note: Scanned PDFs are not supported.' });
    }
};


// Placeholders for others
// 10. HTML to PDF (High-Fidelity via Puppeteer)
// 10. HTML to PDF (Disabled for Memory Stability)
exports.htmlToPdf = async (req, res) => {
    // Puppeteer uses too much RAM for Render Free Tier (512MB).
    // We disabled it to ensure Login/Signup works reliably.
    if (req.files) cleanup(req.files);
    return res.status(503).json({
        error: 'This tool is temporarily disabled to optimize server performance for Authentication features. Please upgrade hosting to enable.'
    });
};
// 11. PDF to EXCEL (via Python/pdfplumber)
exports.pdfToExcel = async (req, res) => {
    try {
        const file = req.files[0];
        const outputFilename = 'converted.xlsx';
        const outputPath = path.join(path.dirname(file.path), outputFilename);

        // Spawn Python process
        const scriptPath = path.resolve(__dirname, '../convert_excel.py');
        const pythonProcess = spawn('python', [scriptPath, file.path, outputPath]);

        pythonProcess.stdout.on('data', (data) => console.log(`Python Output (Excel): ${data}`));
        pythonProcess.stderr.on('data', (data) => console.error(`Python Error (Excel): ${data}`));

        pythonProcess.on('error', (err) => {
            console.error('Failed to start Python process:', err);
            res.status(500).json({ error: 'Failed to launch Excel conversion engine.' });
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                cleanup(req.files);
                return res.status(500).json({ error: 'Excel conversion failed.' });
            }

            // check if file exists
            if (!fs.existsSync(outputPath)) {
                cleanup(req.files);
                return res.status(500).json({ error: 'Output file generation failed.' });
            }

            const fileBuffer = fs.readFileSync(outputPath);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=converted.xlsx');
            res.send(fileBuffer);

            cleanup(req.files);
            try { fs.unlinkSync(outputPath); } catch (e) { }
        });

    } catch (error) {
        console.error('PDF to Excel Stack:', error);
        res.status(500).json({ error: 'Conversion failed: ' + error.message });
    }
};

// 16. REMOVE BACKGROUND (via Hugging Face Inference API - FREE!)
exports.removeBackground = async (req, res) => {
    const axios = require('axios');

    try {
        const file = req.files[0];

        // Read the image file
        const imageBuffer = fs.readFileSync(file.path);

        // Use Hugging Face's free inference API with a reliable background removal model
        // Using Xenova/modnet which is stable and typically ungated
        const HF_MODEL = 'Xenova/modnet';
        const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

        console.log('Removing background using Hugging Face model:', HF_MODEL);

        // Call Hugging Face inference API
        const response = await axios({
            method: 'post',
            url: HF_API_URL,
            data: imageBuffer,
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            timeout: 120000, // 2 minute timeout for model loading
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        // Clean up uploaded file
        cleanup(req.files);

        // Send the result
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=no-bg.png');
        res.send(Buffer.from(response.data));

        console.log('Background removal successful!');

    } catch (error) {
        console.error('Remove Background Error:', error.response?.data?.toString() || error.message);
        if (req.files) cleanup(req.files);

        // Handle specific errors
        if (error.response?.status === 503) {
            return res.status(503).json({
                error: 'Model is loading. Please try again in 20-30 seconds.'
            });
        }

        if (error.response?.status === 429) {
            return res.status(429).json({
                error: 'Too many requests. Please wait a moment and try again.'
            });
        }

        res.status(500).json({
            error: 'Background removal failed: ' + (error.message || 'Unknown error')
        });
    }
};


