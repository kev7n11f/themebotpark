const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Configure email transporter (using SendGrid as example)
const createEmailTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransporter({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else if (process.env.SMTP_HOST) {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

// Rate limiting for contact form
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
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
          from: process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL || 'admin@themebotpark.com',
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
          from: process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_USER,
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
    emailConfigured: !!(process.env.SENDGRID_API_KEY || process.env.SMTP_HOST),
    supportEmail: 'support@themebotpark.com',
    businessEmail: 'business@themebotpark.com'
  });
});

module.exports = router;