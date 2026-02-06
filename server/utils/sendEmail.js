const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // production: use secure SMTP
    // development: possibly use mailtrap or similar, but for now we'll rely on environment variables

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('====================================================');
        console.log(' [DEV MODE] Email Service Credentials Missing');
        console.log(' Subject:', options.subject);
        console.log(' To:', options.email);
        console.log(' Message:', options.message);
        console.log('====================================================');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'PDF Saathi'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html // Optional: if you want to send HTML emails
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
