import nodemailer from 'nodemailer';

export const getTestInboxes = () => {
  // Returns list of test inbox configurations mapped to environment variables
  const inboxes = [
    { provider: 'Gmail', address: process.env.GMAIL_IMAP_USER, envKey: 'GMAIL' },
    { provider: 'Zoho', address: process.env.ZOHO_IMAP_USER, envKey: 'ZOHO' },
    { provider: 'Outlook', address: process.env.OUTLOOK_IMAP_USER, envKey: 'OUTLOOK' },
    { provider: 'Yahoo', address: process.env.YAHOO_IMAP_USER, envKey: 'YAHOO' },
    { provider: 'Rediffmail', address: process.env.REDIFF_IMAP_USER, envKey: 'REDIFF' },
  ];

  // Filter out any missing (undefined) inboxes
  return inboxes.filter(box => !!box.address).slice(0, 5);
};

export const sendReportEmail = async ({ to, subject, html, text }) => {
  try {
    // Create transporter for Mailgun
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailgun.org',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,  
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    });

    console.log('Email sent:', info.messageId);
    return info;

  } catch (err) {
    console.error('Email sending failed:', err);
    throw err;
  }
};