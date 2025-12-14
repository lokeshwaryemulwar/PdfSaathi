const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mergeRoutes = require('./routes/mergeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Initialize database
require('./database');

// Routes
app.use('/api', mergeRoutes);
app.use('/api', require('./routes/toolRoutes'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));

// Serve static files from the React client
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));

    // SEO Files - Explicit serving
    app.get('/sitemap.xml', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'sitemap.xml'));
    });
    app.get('/robots.txt', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'robots.txt'));
    });
    app.get(/(.*)/, (req, res) => {
        // Don't intercept API routes (though they should be handled above)
        if (req.url.startsWith('/api')) return res.status(404).json({ error: 'API route not found' });
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
} else {
    // Development base route
    app.get('/', (req, res) => {
        res.send('PDF Saathi API is running (Client not built)');
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
