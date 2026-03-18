const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Pre-load the JSON data generated from the client
const toolContentPath = path.join(__dirname, '../../client/src/data/toolContent.json');
const blogPostsPath = path.join(__dirname, '../../client/src/data/blogPosts.json');

let toolContent = {};
let blogPosts = [];

try {
    if (fs.existsSync(toolContentPath)) {
        toolContent = JSON.parse(fs.readFileSync(toolContentPath, 'utf8'));
    }
    if (fs.existsSync(blogPostsPath)) {
        blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
    }
} catch (err) {
    console.error("Error loading SEO data:", err);
}

const seoMiddleware = (req, res, clientBuildPath) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    
    // Check if index.html exists
    if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Build not found');
    }

    let html = fs.readFileSync(indexPath, 'utf8');
    const urlPath = req.path; // e.g., '/merge-pdf', '/blog/some-slug'

    // Variables for replacement
    let title = "PDF Saathi - Best Free Online PDF Tools";
    let description = "Merge, compress, and edit PDF files online for free. No limits, no watermarks, secure encrypted processing.";
    let injectedBody = "";

    // 1. Check for Tool Pages (e.g., /merge-pdf, /compress-pdf)
    const toolMatch = urlPath.match(/^\/([^/]+)\/?$/);
    if (toolMatch) {
        const slug = toolMatch[1];
        if (toolContent[slug]) {
            const data = toolContent[slug];
            title = data.title;
            description = data.description;
            
            // Build rich HTML body
            injectedBody = `
                <div id="seo-server-content" style="display:none;">
                    <h1>${data.title}</h1>
                    <p>${data.description}</p>
                    ${data.longDescription ? data.longDescription : ''}
                </div>
            `;
        }
    }

    // 2. Check for Blog Posts (e.g., /blog/some-slug)
    const blogMatch = urlPath.match(/^\/blog\/([^/]+)\/?$/);
    if (blogMatch) {
        const slug = blogMatch[1];
        const post = blogPosts.find(p => p.slug === slug);
        if (post) {
            title = post.title;
            description = post.excerpt;
            
            // Parse markdown content to proper HTML
            const parsedContent = marked.parse(post.content || "");
            
            injectedBody = `
                <div id="seo-server-content" style="display:none;">
                    <h1>${post.title}</h1>
                    <article>
                        ${parsedContent}
                    </article>
                    <p>Author: ${post.author || 'Admin'} | Date: ${post.date}</p>
                </div>
            `;
        }
    }

    // Replace the placeholders in index.html
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${description}" />`);
    
    // Inject the rich body specifically for crawlers to see before React boots
    // We insert it right after <body> tag
    if (injectedBody) {
        html = html.replace('<body>', `<body>\n${injectedBody}\n`);
    }

    res.send(html);
};

module.exports = seoMiddleware;
