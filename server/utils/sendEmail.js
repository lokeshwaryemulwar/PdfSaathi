const nodemailer = require('nodemailer');
const dns = require('dns');
const util = require('util');

const resolve4 = util.promisify(dns.resolve4);

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

    let transporterOptions = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        family: 4 // Hint for nodemailer, though manual resolution helps more
    };

    try {
        // Explicitly resolve IPv4 address for smtp.gmail.com to avoid IPv6 issues on Render
        const addresses = await resolve4('smtp.gmail.com');
        if (addresses && addresses.length > 0) {
            console.log(`Resolved smtp.gmail.com to IPv4: ${addresses[0]}`);
            transporterOptions.host = addresses[0]; // Use the IP address
            transporterOptions.tls = {
                servername: 'smtp.gmail.com' // verified against the certificate
            };
        }
    } catch (dnsError) {
        console.error('DNS Resolution failed, falling back to hostname:', dnsError);
    }

    const transporter = nodemailer.createTransport(transporterOptions);

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
