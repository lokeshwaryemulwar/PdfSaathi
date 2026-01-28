const express = require('express');
const multer = require('multer');
const path = require('path');
const toolController = require('../controllers/toolController');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Configure upload limits
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Register routes for all tools defined in frontend
// Utilities
router.post('/split-pdf', upload.array('files'), toolController.splitPdf);
router.post('/compress-pdf', upload.array('files'), toolController.compressPdf);
router.post('/rotate-pdf', upload.array('files'), toolController.rotatePdf);
router.post('/protect-pdf', upload.array('files'), toolController.protectPdf);
router.post('/unlock-pdf', upload.array('files'), toolController.unlockPdf);

// Conversions
router.post('/img-to-pdf', upload.array('files'), toolController.imgToPdf);
router.post('/word-to-pdf', upload.array('files'), toolController.wordToPdf);
router.post('/pdf-to-word', upload.array('files'), toolController.pdfToWord);
// Add placeholders for others if needed or map them to generic handlers
router.post('/html-to-pdf', upload.any(), toolController.htmlToPdf);
router.post('/pdf-to-ppt', upload.array('files'), toolController.pdfToPpt);
router.post('/pdf-to-excel', upload.any(), toolController.pdfToExcel);
router.post('/convert-image', upload.any(), toolController.convertImage);

router.post('/jpg-to-pdf', upload.array('files'), toolController.imgToPdf); // Alias

module.exports = router;
