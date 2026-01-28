const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

exports.mergePdfs = async (req, res) => {
    try {
        const files = req.files;

        if (!files || files.length < 2) {
            return res.status(400).json({ error: 'Please upload at least 2 PDF files.' });
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            const filePath = file.path;
            const fileBuffer = fs.readFileSync(filePath);
            const pdf = await PDFDocument.load(fileBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

            copiedPages.forEach((page) => mergedPdf.addPage(page));

            // Clean up uploaded file
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error('Error deleting temp file:', err);
            }
        }

        const pdfBytes = await mergedPdf.save();

        // Send response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Merge error:', error);
        // Attempt cleanup in case of error
        if (req.files) {
            req.files.forEach(f => {
                try { fs.unlinkSync(f.path); } catch (e) { }
            });
        }
        res.status(500).json({ error: 'Failed to merge PDFs. ' + error.message });
    }
};
