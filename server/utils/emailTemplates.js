const getEmailTemplate = (title, message, buttonText, buttonUrl) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f5; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #6366f1; padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; color: #334155; }
        .button-container { text-align: center; margin: 30px 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #6366f1; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s; }
        .button:hover { background-color: #4f46e5; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .link-text { word-break: break-all; color: #6366f1; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PDF Saathi</h1>
        </div>
        <div class="content">
            <h2 style="margin-top: 0; color: #1e293b;">${title}</h2>
            <p>${message}</p>
            
            <div class="button-container">
                <a href="${buttonUrl}" class="button">${buttonText}</a>
            </div>
            
            <p style="font-size: 14px; margin-top: 30px;">
                Or copy and paste this link into your browser:<br>
                <a href="${buttonUrl}" class="link-text">${buttonUrl}</a>
            </p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PDF Saathi. All rights reserved.</p>
            <p>If you didn't request this email, you can safely ignore it.</p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = { getEmailTemplate };
