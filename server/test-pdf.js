const pdfParse = require('pdf-parse');
console.log('Type of pdfParse:', typeof pdfParse);
console.log('Keys:', Object.keys(pdfParse));
// Check if it has a default export or if it is the module itself
try {
    console.log('Is default a function?', typeof pdfParse.default === 'function');
} catch (e) { }

if (typeof pdfParse === 'function') {
    console.log('It is a function!');
} else {
    console.error('CRITICAL: It is NOT a function.');
}
