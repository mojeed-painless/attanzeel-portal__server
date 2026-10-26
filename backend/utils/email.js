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
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT || 587);

    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true' || smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      console.log(`📧 Email configured with SMTP host: ${smtpHost}`);
      return;
    }

    console.warn('⚠️ SMTP configuration is missing. Email is in mock mode. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in the server .env to send real emails.');
    this.transporter = null;
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
  async sendCredentialsEmail(email, username, firstName = 'User', password = '', userClass = '', department = '') {
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
        console.log(`📝 PASSWORD: ${password || '(not provided)'}`);
        if (userClass) console.log(`🏫 CLASS: ${userClass}`);
        if (department) console.log(`📚 DEPARTMENT: ${department}`);
        console.log('⏳ Status: Awaiting admin approval');
        console.log('='.repeat(60) + '\n');
        return true;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@attanzeel.edu.ng',
        to: email,
        subject: 'Registration Credentials - At-Tanzeel Portal',
        html: this.getCredentialsEmailTemplate(username, firstName, password, userClass, department),
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
<html lang="en">
<head>
  <style>
    body,
    html {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #f5f6f8;
      font-family: Arial, Helvetica, sans-serif;
      -webkit-text-size-adjust: 100%;
    }

    table {
      border-spacing: 0;
      border-collapse: collapse;
    }

    img {
      border: 0;
      display: block;
    }

    a {
      text-decoration: none;
    }

    .email-card {
      width: 100%;
      max-width: 620px;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
    }

    .email-header {
      padding: 38px 20px 34px;
      text-align: center;
      background-color: #f8faff;
      border-bottom: 1px solid #edf0f5;
    }

    .brand-icon {
      width: 66px;
      height: 66px;
      margin: 0 auto 14px;
      border: 3px solid #12356a;
      border-radius: 22px 22px 22px 5px;
      transform: rotate(-2deg);
      box-sizing: border-box;
      line-height: 60px;
      font-size: 34px;
      color: #dca72e;
      font-weight: bold;
    }

    .brand-name {
      margin: 0;
      color: #102f60;
      font-size: 27px;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .brand-subtitle {
      margin: 8px 0 0;
      color: #52698d;
      font-size: 12px;
      letter-spacing: 4px;
    }

    .email-content {
      padding: 38px 42px 20px;
      text-align: center;
    }

    .email-title {
      margin: 0;
      color: #102f60;
      font-size: 30px;
      line-height: 1.3;
      font-weight: 750;
    }

    .gold-divider {
      width: 54px;
      height: 4px;
      background-color: #e4ad31;
      border-radius: 5px;
      margin: 22px auto 30px;
      font-size: 0;
      line-height: 0;
    }

    .greeting {
      margin: 0 0 16px;
      color: #102f60;
      font-size: 20px;
      line-height: 1.5;
      font-weight: bold;
    }

    .email-description {
      margin: 0 auto 28px;
      color: #52678c;
      font-size: 16px;
      line-height: 1.8;
    }

    .code-container {
      width: 100%;
      margin: 0 auto 28px;
    }

    .code-box {
      background-color: #edf4ff;
      border: 1px solid #dbe8ff;
      border-radius: 9px;
      padding: 18px 8px;
      text-align: center;
    }

    .verification-code {
      color: #1767e8;
      font-size: 30px;
      line-height: 1.4;
      font-weight: bold;
      letter-spacing: 8px;
      white-space: nowrap;
    }

    .code-label {
      margin: 10px 0 0;
      color: #61779b;
      font-size: 12px;
    }

    .button-container {
      margin: 0 auto 18px;
      text-align: center;
    }

    .verify-button {
      display: inline-block;
      padding: 17px 25px;
      background-color: #1767ed;
      border-radius: 9px;
      color: #ffffff !important;
      font-size: 16px;
      font-weight: bold;
      line-height: 1.4;
      text-align: center;
    }

    .alternative-text {
      margin: 0 0 30px;
      color: #61769a;
      font-size: 14px;
      line-height: 1.7;
    }

    .expiration-box {
      margin: 0 0 28px;
      padding: 17px 15px;
      background-color: #fff6df;
      border: 1px solid #ffebba;
      border-radius: 9px;
      color: #9b6500;
      font-size: 14px;
      line-height: 1.6;
      text-align: center;
    }

    .expiration-title {
      margin: 0 0 3px;
      font-weight: bold;
    }

    .expiration-description {
      margin: 0;
    }

    .security-notice {
      border-top: 1px solid #e8edf5;
      padding: 24px 0 12px;
      color: #60759a;
      font-size: 13px;
      line-height: 1.8;
      text-align: center;
    }

    .email-footer {
      padding: 15px 20px 30px;
      text-align: center;
      background-color: #ffffff;
    }

    .footer-copyright {
      margin: 0 0 8px;
      color: #536b92;
      font-size: 13px;
    }

    .footer-motto {
      margin: 0;
      color: #8090ad;
      font-size: 11px;
      letter-spacing: 1.5px;
    }

    .footer-accent {
      width: 45px;
      height: 2px;
      display: inline-block;
      background-color: #e3b340;
      vertical-align: middle;
    }

    @media only screen and (max-width: 600px) {
      .email-card {
        width: 100% !important;
        border-radius: 0 !important;
      }

      .email-content {
        padding: 32px 20px 15px !important;
      }

      .email-header {
        padding: 30px 15px !important;
      }

      .email-title {
        font-size: 25px !important;
      }

      .brand-name {
        font-size: 23px !important;
      }

      .brand-subtitle {
        font-size: 10px !important;
        letter-spacing: 3px !important;
      }

      .greeting {
        font-size: 18px !important;
      }

      .email-description {
        font-size: 15px !important;
      }

      .verification-code {
        font-size: 25px !important;
        letter-spacing: 5px !important;
      }

      .verify-button {
        display: block !important;
        padding: 16px 12px !important;
      }

      .expiration-box {
        padding: 15px 10px !important;
      }
    }
  </style>
</head>

<body style="margin:0; padding:0; background-color:#f5f6f8;">

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color:#f5f6f8;"
  >
    <tr>
      <td align="center" style="padding:30px 12px;">
        <table
          role="presentation"
          class="email-card"
          width="620"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            max-width:620px;
            background-color:#ffffff;
            border-radius:12px;
            overflow:hidden;
          "
        >
          <tr>
            <td
              class="email-header"
              align="center"
              style="
                padding:38px 20px 34px;
                text-align:center;
                background-color:#f8faff;
                border-bottom:1px solid #edf0f5;
              "
            >
              <div
                style="
                  width:64px;
                  height:64px;
                  line-height:64px;
                  margin:0 auto 14px;
                  color:#dca72e;
                  font-size:42px;
                  font-weight:bold;
                  text-align:center;
                "
              >
                ✧
              </div>

              <h1
                class="brand-name"
                style="
                  margin:0;
                  color:#102f60;
                  font-size:27px;
                  font-weight:800;
                  letter-spacing:2px;
                "
              >
                AT-TANZEEL
              </h1>

              <p
                class="brand-subtitle"
                style="
                  margin:8px 0 0;
                  color:#52698d;
                  font-size:12px;
                  letter-spacing:4px;
                "
              >
                STUDENTS PORTAL
              </p>

            </td>
          </tr>

          <tr>
            <td
              class="email-content"
              align="center"
              style="
                padding:38px 42px 20px;
                text-align:center;
              "
            >

              <h2
                class="email-title"
                style="
                  margin:0;
                  color:#102f60;
                  font-size:30px;
                  line-height:1.3;
                  font-weight:750;
                "
              >
                Verify your email address
              </h2>

              <div
                class="gold-divider"
                style="
                  width:54px;
                  height:4px;
                  background-color:#e4ad31;
                  border-radius:5px;
                  margin:22px auto 30px;
                  font-size:0;
                "
              >&nbsp;</div>

              <p
                class="greeting"
                style="
                  margin:0 0 16px;
                  color:#102f60;
                  font-size:20px;
                  line-height:1.5;
                  font-weight:bold;
                "
              >
                Assalamu alaikum, 
                <span 
                  style="
                    text-transform: capitalize;
                  "
                >${firstName}</span>
              </p>

              <p
                class="email-description"
                style="
                  margin:0 auto 28px;
                  color:#52678c;
                  font-size:16px;
                  line-height:1.8;
                "
              >
                Thank you for registering with At-Tanzeel.
                <br>
                Please confirm your email address to complete
                your registration.
              </p>

              <table
                role="presentation"
                class="code-container"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin:0 auto 28px;"
              >
                <tr>
                  <td
                    align="center"
                    style="
                      background-color:#edf4ff;
                      border:1px solid #dbe8ff;
                      border-radius:9px;
                      padding:18px 8px;
                      text-align:center;
                    "
                  >
                    <span
                      class="verification-code"
                      style="
                        color:#1767e8;
                        font-size:30px;
                        line-height:1.4;
                        font-weight:bold;
                        letter-spacing:8px;
                        white-space:nowrap;
                      "
                    >
                      ${code}
                    </span>
                  </td>
                </tr>
              </table>

              <p
                class="alternative-text"
                style="
                  margin:0 0 30px;
                  color:#61769a;
                  font-size:14px;
                  line-height:1.7;
                "
              >
                enter the code on the verification page.
              </p>

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin:0 0 28px;"
              >
                <tr>
                  <td
                    class="expiration-box"
                    align="center"
                    style="
                      padding:17px 15px;
                      background-color:#fff6df;
                      border:1px solid #ffebba;
                      border-radius:9px;
                      color:#9b6500;
                      font-size:14px;
                      line-height:1.6;
                      text-align:center;
                    "
                  >
                    <p style="margin:0 0 3px; font-weight:bold;">
                      ⏱ This code expires in 1 hour.
                    </p>

                    <p style="margin:0;">
                      Please verify your email before the code expires.
                    </p>
                  </td>
                </tr>
              </table>

              <div
                class="security-notice"
                style="
                  border-top:1px solid #e8edf5;
                  padding:24px 0 12px;
                  color:#60759a;
                  font-size:13px;
                  line-height:1.8;
                  text-align:center;
                "
              >
                If you didn't create an account with At-Tanzeel,
                you can safely ignore this email.
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td
              class="email-footer"
              align="center"
              style="
                padding:15px 20px 30px;
                text-align:center;
                background-color:#ffffff;
              "
            >

              <p
                class="footer-copyright"
                style="
                  margin:0 0 8px;
                  color:#536b92;
                  font-size:13px;
                "
              >
                <span class="footer-accent"
                  style="
                    display:inline-block;
                    width:35px;
                    height:1px;
                    background-color:#e3eaf5;
                    vertical-align:middle;
                  "
                ></span>

                &nbsp; © 2026 At-Tanzeel Academy &nbsp;

                <span class="footer-accent"
                  style="
                    display:inline-block;
                    width:35px;
                    height:1px;
                    background-color:#e3eaf5;
                    vertical-align:middle;
                  "
                ></span>
              </p>

              <p
                class="footer-motto"
                style="
                  margin:0;
                  color:#8090ad;
                  font-size:11px;
                  letter-spacing:1.5px;
                "
              >
                Knowledge &bull; Virtues &bull; Excellence
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `;
  }

  /**
   * Get HTML template for credentials email
   */
  getCredentialsEmailTemplate(username, firstName, password = '', userClass = '', department = '') {
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
            <p>Hello 
            <strong
              style="
                text-transform: capitalize;
              "
            >${firstName}</strong>,</p>
            
            <p>Congratulations! Your email has been verified successfully. Your account credentials are ready.</p>
          </div>
          
          <div class="credential-box">
            <div class="label">Username</div>
            <div class="value">${username}</div>

            <div class="label">Password</div>
            <div class="value">${password}</div>

            ${userClass ? `<div class="label">Class</div><div class="value">${userClass}</div>` : ''}
            ${department ? `<div class="label">Department</div><div class="value">${department}</div>` : ''}
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
