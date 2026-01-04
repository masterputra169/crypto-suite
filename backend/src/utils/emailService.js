// src/utils/emailService.js

const nodemailer = require('nodemailer');

console.log('\n📧 SendGrid Email Configuration:');
console.log('   HOST:', process.env.EMAIL_HOST || '❌ NOT SET');
console.log('   PORT:', process.env.EMAIL_PORT || '❌ NOT SET');
console.log('   USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('   API KEY:', process.env.EMAIL_PASSWORD ? `✅ SET (${process.env.EMAIL_PASSWORD.substring(0, 10)}...)` : '❌ NOT SET');
console.log('   FROM:', process.env.EMAIL_FROM || '❌ NOT SET');

if (!process.env.EMAIL_HOST || !process.env.EMAIL_PASSWORD) {
  console.error('\n❌ ERROR: SendGrid configuration incomplete!');
  console.error('Please check your .env file in backend/ folder\n');
}

if (process.env.EMAIL_USER !== 'apikey') {
  console.error('\n⚠️  WARNING: EMAIL_USER should be exactly "apikey" for SendGrid!\n');
}

if (process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASSWORD.startsWith('SG.')) {
  console.error('\n⚠️  WARNING: EMAIL_PASSWORD should be a SendGrid API Key (starts with SG.)\n');
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development'
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SendGrid connection failed:', error.message);
  } else {
    console.log('✅ SendGrid is ready to send emails');
  }
});

/**
 * Send password reset email via SendGrid
 * ✅ CRITICAL: Token must NOT be URL-encoded or modified
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  const clientUrl = process.env.CLIENT_URL || 'http://cryptosuite.online';
  
  // ✅ IMPORTANT: Use plain token, NO encoding
  const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

  console.log('\n📧 Preparing password reset email...');
  console.log('   To:', email);
  console.log('   Token (first 20 chars):', resetToken.substring(0, 20) + '...');
  console.log('   Token length:', resetToken.length);
  console.log('   Reset URL:', resetUrl);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request - Crypto Suite',
    html: `
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
    `,
    text: `
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
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent via SendGrid');
    console.log('   Message ID:', info.messageId);
    console.log('   To:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ SendGrid email failed:', error);
    throw error;
  }
};

/**
 * Send welcome email via SendGrid
 */
const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Crypto Suite! 🎉',
    html: `
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
              <a href="${process.env.CLIENT_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
            <p>Happy learning!<br><strong>Crypto Suite Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Crypto Suite. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Welcome email failed:', error);
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail
};