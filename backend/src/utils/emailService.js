// src/utils/emailService.js - MENGGUNAKAN SENDGRID API (BUKAN SMTP)

const https = require('https');

// ✅ SendGrid API Configuration
const SENDGRID_API_KEY = process.env.EMAIL_PASSWORD; // API Key (starts with SG.)
const FROM_EMAIL = process.env.EMAIL_FROM;

console.log('\n📧 SendGrid Configuration:');
console.log('   API KEY:', SENDGRID_API_KEY ? `✅ SET (${SENDGRID_API_KEY.substring(0, 10)}...)` : '❌ NOT SET');
console.log('   FROM:', FROM_EMAIL || '❌ NOT SET');

if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.startsWith('SG.')) {
  console.error('\n⚠️  WARNING: EMAIL_PASSWORD should be a SendGrid API Key (starts with SG.)\n');
}

/**
 * Send email using SendGrid Web API (NOT SMTP)
 * This avoids port blocking issues on Railway/Vercel
 */
const sendEmailViaSendGrid = (to, subject, htmlContent, textContent) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM_EMAIL, name: 'Crypto Suite' },
      subject: subject,
      content: [
        { type: 'text/plain', value: textContent },
        { type: 'text/html', value: htmlContent }
      ]
    });

    const options = {
      hostname: 'api.sendgrid.com',
      port: 443,
      path: '/v3/mail/send',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ SendGrid API: Email sent successfully');
          console.log('   Status:', res.statusCode);
          resolve({ success: true, statusCode: res.statusCode });
        } else {
          console.error('❌ SendGrid API Error:', res.statusCode);
          console.error('   Response:', responseData);
          reject(new Error(`SendGrid API Error: ${res.statusCode} - ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ SendGrid API Request Error:', error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

/**
 * Send password reset email via SendGrid API
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  const clientUrl = process.env.CLIENT_URL || 'https://cryptosuite.online';
  const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

  console.log('\n📧 Preparing password reset email...');
  console.log('   To:', email);
  console.log('   Token (first 20 chars):', resetToken.substring(0, 20) + '...');
  console.log('   Reset URL:', resetUrl);

  const subject = 'Password Reset Request - Crypto Suite';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .content p {
          margin: 0 0 15px;
          color: #555;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 14px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
        }
        .link-box {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          word-break: break-all;
          font-size: 13px;
          color: #666;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .warning strong {
          color: #856404;
        }
        .warning ul {
          margin: 10px 0 0;
          padding-left: 20px;
        }
        .warning li {
          color: #856404;
          margin: 5px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6c757d;
          font-size: 13px;
          border-top: 1px solid #e9ecef;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        
        <div class="content">
          <p>Hello,</p>
          <p>You requested to reset your password for your <strong>Crypto Suite</strong> account.</p>
          <p>Click the button below to reset your password:</p>
          
          <div class="button-container">
            <a href="${resetUrl}" class="button" style="color: white;">Reset Password</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <div class="link-box">
            ${resetUrl}
          </div>
          
          <div class="warning">
            <strong>⚠️ Important Security Notice:</strong>
            <ul>
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Your password will remain unchanged until you access the link above</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <p>If you have any questions or concerns, please contact our support team.</p>
          <p style="margin-top: 30px;">Best regards,<br><strong>Crypto Suite Team</strong></p>
        </div>
        
        <div class="footer">
          <p><strong>Crypto Suite</strong> - Interactive Cryptography Learning Platform</p>
          <p>© ${new Date().getFullYear()} Crypto Suite. All rights reserved.</p>
          <p style="margin-top: 10px;">This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Password Reset Request - Crypto Suite

Hello,

You requested to reset your password for your Crypto Suite account.

Reset your password by clicking this link:
${resetUrl}

IMPORTANT:
- This link will expire in 1 hour
- If you didn't request this, please ignore this email
- Your password will remain unchanged until you access the link above

Best regards,
Crypto Suite Team

© ${new Date().getFullYear()} Crypto Suite. All rights reserved.
  `;

  try {
    await sendEmailViaSendGrid(email, subject, htmlContent, textContent);
    console.log('✅ Password reset email sent successfully via SendGrid API');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    throw error;
  }
};

/**
 * Send welcome email via SendGrid API
 */
const sendWelcomeEmail = async (email, username) => {
  const subject = 'Welcome to Crypto Suite! 🎉';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Crypto Suite!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${username}</strong>,</p>
          <p>Thank you for joining <strong>Crypto Suite</strong>!</p>
          <p>You can now start exploring cryptographic algorithms:</p>
          <ul>
            <li>Classical Ciphers (Caesar, Vigenère, Playfair)</li>
            <li>Modern Encryption Algorithms</li>
            <li>Interactive Learning Tools</li>
            <li>Progress Tracking</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'https://cryptosuite.online'}/dashboard" class="button" style="color: white;">Go to Dashboard</a>
          </div>
          <p>Happy learning!<br><strong>Crypto Suite Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Crypto Suite. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Welcome to Crypto Suite!

Hi ${username},

Thank you for joining Crypto Suite!

You can now start exploring cryptographic algorithms:
- Classical Ciphers (Caesar, Vigenère, Playfair)
- Modern Encryption Algorithms
- Interactive Learning Tools
- Progress Tracking

Visit your dashboard: ${process.env.CLIENT_URL || 'https://cryptosuite.online'}/dashboard

Happy learning!
Crypto Suite Team
  `;

  try {
    await sendEmailViaSendGrid(email, subject, htmlContent, textContent);
    console.log('✅ Welcome email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Welcome email failed:', error.message);
    // Don't throw - welcome email is not critical
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail
};