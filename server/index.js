const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mergeRoutes = require('./routes/mergeRoutes');

const app = express();
app.disable('x-powered-by'); // Hide X-Powered-By header for security
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    exposedHeaders: ['Content-Disposition', 'X-Compression-Stats']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to force HTTPS and WWW
app.use((req, res, next) => {
    const host = req.get('host');

    // Skip for localhost
    if (host && host.includes('localhost')) {
        return next();
    }

    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const isInsecure = protocol !== 'https';
    const isNonWww = host === 'pdfsaathi.in';

    if (isInsecure || isNonWww) {
        const newHost = isNonWww ? 'www.pdfsaathi.in' : host;
        return res.redirect(301, `https://${newHost}${req.url}`);
    }
    next();
});

// Middleware to normalize trailing slashes
app.use((req, res, next) => {
    if (req.path.substr(-1) === '/' && req.path.length > 1) {
        const query = req.url.slice(req.path.length);
        const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
        // 301 Permanent Redirect is best for SEO consistency
        res.redirect(301, safepath + query);
    } else {
        next();
    }
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Connect to Database
const connectDB = require('./database');
connectDB();

// Routes
app.use('/api', mergeRoutes);
app.use('/api', require('./routes/toolRoutes'));
app.use('/api/admin', require('./routes/admin'));
app.get('/health', (req, res) => res.status(200).send('OK'));
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
    app.get('/ads.txt', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'ads.txt'));
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
