const nodemailer = require('nodemailer');

/**
 * Email utility for sending emails
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter based on environment
   */
  initializeTransporter() {
    if (process.env.NODE_ENV === 'production') {
      // Production SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development configuration
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: false, // Use TLS
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        console.log('📧 Email configured with SMTP');
      } else {
        // Development mock mode - no actual email sending
        console.log('📧 Email service in development mock mode. Emails will be logged to console.');
        this.transporter = null; // Use mock mode
      }
    }
  }

  /**
   * Send verification code email
   * @param {string} email - Recipient email
   * @param {string} verificationCode - The verification code
   * @param {string} firstName - User's first name
   */
  async sendVerificationEmail(email, verificationCode, firstName = 'User') {
    try {
      // In development mock mode, just log to console
      if (this.isDevelopment && !this.transporter) {
        console.log('\n' + '='.repeat(60));
        console.log('📧 MOCK EMAIL - VERIFICATION CODE');
        console.log('='.repeat(60));
        console.log(`To: ${email}`);
        console.log(`Subject: Email Verification - At-Tanzeel Portal`);
        console.log(`Name: ${firstName}`);
        console.log(`\n🔐 VERIFICATION CODE: ${verificationCode}`);
        console.log(`Valid for: 1 hour`);
        console.log('='.repeat(60) + '\n');
        return true;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@attanzeel.edu.ng',
        to: email,
        subject: 'Email Verification - At-Tanzeel Portal',
        html: this.getVerificationEmailTemplate(verificationCode, firstName),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending verification email:', error.message);
      // In development, don't throw - just log
      if (this.isDevelopment) {
        console.log('⚠️  Email failed in development. Code was logged above.');
        return true; // Return true so registration continues
      }
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send credentials email (after email verification)
   * @param {string} email - Recipient email
   * @param {string} username - User's username
   * @param {string} firstName - User's first name
   */
  async sendCredentialsEmail(email, username, firstName = 'User') {
    try {
      // In development mock mode, just log to console
      if (this.isDevelopment && !this.transporter) {
        console.log('\n' + '='.repeat(60));
        console.log('📧 MOCK EMAIL - CREDENTIALS');
        console.log('='.repeat(60));
        console.log(`To: ${email}`);
        console.log(`Subject: Registration Credentials - At-Tanzeel Portal`);
        console.log(`Name: ${firstName}`);
        console.log(`\n👤 USERNAME: ${username}`);
        console.log('📝 Password: (as set during registration)');
        console.log('⏳ Status: Awaiting admin approval');
        console.log('='.repeat(60) + '\n');
        return true;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@attanzeel.edu.ng',
        to: email,
        subject: 'Registration Credentials - At-Tanzeel Portal',
        html: this.getCredentialsEmailTemplate(username, firstName),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Credentials email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending credentials email:', error.message);
      // In development, don't throw - just log
      if (this.isDevelopment) {
        console.log('⚠️  Email failed in development. Credentials were logged above.');
        return true; // Return true so verification continues
      }
      throw new Error('Failed to send credentials email');
    }
  }

  /**
   * Get HTML template for verification email
   */
  getVerificationEmailTemplate(code, firstName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            color: #333333;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            color: #1a73e8;
          }
          .content {
            color: #555555;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .code-box {
            background-color: #f5f5f5;
            border: 2px solid #1a73e8;
            border-radius: 4px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .code-box .code {
            font-size: 32px;
            font-weight: bold;
            color: #1a73e8;
            letter-spacing: 5px;
            font-family: 'Courier New', monospace;
          }
          .expire-notice {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
          .footer {
            text-align: center;
            color: #999999;
            font-size: 12px;
            margin-top: 30px;
            border-top: 1px solid #eeeeee;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
            <p>At-Tanzeel Students Portal</p>
          </div>
          
          <div class="content">
            <p>Hello <strong>${firstName}</strong>,</p>
            
            <p>Thank you for registering with At-Tanzeel. We're excited to have you on board!</p>
            
            <p>To complete your registration, please verify your email by entering the verification code below:</p>
          </div>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <div class="expire-notice">
            <strong>⏰ Important:</strong> This verification code will expire in <strong>1 hour</strong>. Please verify your email within this timeframe.
          </div>
          
          <div class="content">
            <p>If you didn't create this account, please ignore this email.</p>
            
            <p>After verifying your email, you'll receive your login credentials and will be ready to access the portal once admin approves your registration.</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 At-Tanzeel Academy. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get HTML template for credentials email
   */
  getCredentialsEmailTemplate(username, firstName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            color: #333333;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            color: #1a73e8;
          }
          .content {
            color: #555555;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .credential-box {
            background-color: #f5f5f5;
            border: 2px solid #1a73e8;
            border-radius: 4px;
            padding: 20px;
            margin: 30px 0;
          }
          .credential-box .label {
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: bold;
            margin-top: 15px;
          }
          .credential-box .label:first-child {
            margin-top: 0;
          }
          .credential-box .value {
            font-size: 16px;
            font-weight: bold;
            color: #1a73e8;
            font-family: 'Courier New', monospace;
            margin-top: 5px;
          }
          .notice {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            color: #0c5460;
          }
          .footer {
            text-align: center;
            color: #999999;
            font-size: 12px;
            margin-top: 30px;
            border-top: 1px solid #eeeeee;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Registration Credentials</h1>
            <p>At-Tanzeel Students Portal</p>
          </div>
          
          <div class="content">
            <p>Hello <strong>${firstName}</strong>,</p>
            
            <p>Congratulations! Your email has been verified successfully. Your account credentials are ready.</p>
          </div>
          
          <div class="credential-box">
            <div class="label">Username</div>
            <div class="value">${username}</div>
          </div>
          
          <div class="notice">
            <strong>📌 Next Step:</strong> Your account is now awaiting admin approval. Once approved by the administrator, you'll be able to log in to the portal using your credentials.
          </div>
          
          <div class="content">
            <p>You will receive an email notification once your account has been approved by the administrator.</p>
            
            <p>If you have any questions or concerns, please contact the administration office.</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 At-Tanzeel Academy. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Export singleton instance
module.exports = new EmailService();
