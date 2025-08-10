const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { env } = require('./config/env');
const router = express.Router();

// Configure email transporter (using SendGrid or SMTP)
const createEmailTransporter = () => {
  if (env.email.sendgridKey) {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: env.email.sendgridKey
      }
    });
  } else if (env.email.smtp.host) {
    return nodemailer.createTransport({
      host: env.email.smtp.host,
      port: env.email.smtp.port,
      secure: false,
      auth: {
        user: env.email.smtp.user,
        pass: env.email.smtp.pass
      }
    });
  }
  return null;
};

// Rate limiting for contact form
const contactRateLimit = rateLimit({
  windowMs: env.contactRateLimit.windowMinutes * 60 * 1000,
  max: env.contactRateLimit.maxRequests,
  message: { error: 'Too many contact form submissions, please try again later.' }
});

// Contact form routes
router.post('/', contactRateLimit, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'subject', 'message']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    // Log the contact form submission
    console.log('📬 Contact Form Submission:', {
      name,
      email,
      subject,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    // Try to send email if email service is configured
    const transporter = createEmailTransporter();
    
    if (transporter) {
      try {
        // Send email to admin
        await transporter.sendMail({
          from: env.email.sendgridFrom || env.email.smtp.user,
          to: env.email.admin,
          subject: `Contact Form: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted at: ${new Date().toISOString()}</small></p>
          `
        });

        // Send confirmation email to user
        await transporter.sendMail({
          from: env.email.sendgridFrom || env.email.smtp.user,
          to: email,
          subject: 'Thank you for contacting ThemeBotPark',
          html: `
            <h2>Thank you for your message!</h2>
            <p>Hi ${name},</p>
            <p>We've received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong></p>
            <p><em>"${subject}"</em></p>
            <p>Best regards,<br>The ThemeBotPark Team</p>
          `
        });

        res.json({
          success: true,
          message: 'Your message has been sent successfully! We will get back to you soon.'
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        
        // Still return success to user but log the error
        res.json({
          success: true,
          message: 'Your message has been received. We will get back to you soon!'
        });
      }
    } else {
      // No email service configured - just log and respond
      console.warn('No email service configured. Contact form data logged only.');
      
      res.json({
        success: true,
        message: 'Your message has been received. We will get back to you soon!'
      });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process your message. Please try again later.'
    });
  }
});

router.get('/status', (req, res) => {
  res.json({ 
    status: 'Contact API ready',
    emailConfigured: !!(env.email.sendgridKey || env.email.smtp.host),
    supportEmail: 'support@themebotpark.com',
    businessEmail: 'business@themebotpark.com'
  });
});

module.exports = router;