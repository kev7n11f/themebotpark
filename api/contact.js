module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json({ 
      status: 'Contact API is working!',
      supportEmail: 'support@themebotpark.com',
      businessEmail: 'business@themebotpark.com'
    });
  }

  if (req.method === 'POST') {
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

      // Log the contact form submission (in production, you'd save to database)
      console.log('📬 Contact Form Submission:', {
        name,
        email,
        subject,
        message: message.substring(0, 100) + '...',
        timestamp: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });

      // In production, you would:
      // 1. Save to database
      // 2. Send email notification
      // 3. Add to support ticket system
      // 4. Send auto-reply to user

      // For now, simulate email sending
      const emailSent = await simulateEmailSending({
        name,
        email,
        subject,
        message
      });

      if (emailSent) {
        res.json({ 
          success: true,
          message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.',
          ticketId: `TBP-${Date.now()}`,
          estimatedResponse: '24 hours'
        });
      } else {
        throw new Error('Failed to send email');
      }

    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ 
        error: 'Failed to send your message. Please try again later.',
        fallback: 'You can reach us directly at support@themebotpark.com'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

// Simulate email sending (replace with real email service in production)
async function simulateEmailSending({ name, email, subject, message }) {
  return new Promise((resolve) => {
    // Simulate async email sending
    setTimeout(() => {
      // In production, integrate with:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Nodemailer + SMTP
      
      console.log('📧 Email simulation:', {
        to: 'support@themebotpark.com',
        from: email,
        subject: `[Contact Form] ${subject}`,
        body: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
        `.trim()
      });
      
      resolve(true);
    }, 1000);
  });
}
