const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

(async () => {
    try {
        console.log('Loading pdf-lib...');
        const doc = await PDFDocument.create();
        console.log('Document created.');
        console.log('Type of doc.encrypt:', typeof doc.encrypt);

        if (typeof doc.encrypt === 'function') {
            doc.encrypt({ userPassword: '123', ownerPassword: '123' });
            console.log('Encryption called successfully.');
        } else {
            console.error('CRITICAL: encrypt method is MISSING on PDFDocument instance.');
        }
    } catch (e) {
        console.error('Test failed:', e);
    }
})();
