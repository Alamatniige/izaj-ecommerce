interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface ResetPasswordEmailData {
  resetUrl: string;
  userName?: string;
  expiryHours: number;
}

interface ConfirmationEmailData {
  confirmationUrl: string;
  userName?: string;
  expiryHours: number;
}

export function getResetPasswordEmail(data: ResetPasswordEmailData): EmailTemplate {
  const { resetUrl, userName = 'User', expiryHours = 24 } = data;
  
  const subject = 'Reset Your IZAJ Password';
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - IZAJ</title>
      <style>
        body { font-family: 'Jost', 'Segoe UI', sans-serif; line-height: 1.6; color: #000000; background: #ffffff; padding: 20px; }
        .container { max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; }
        .header { background: #000000; color: white; padding: 32px 28px; text-align: center; }
        .logo { font-family: 'Jost', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
        .title { font-family: 'Jost', sans-serif; font-size: 22px; margin-top: 8px; }
        .content { padding: 28px; }
        .content p { font-family: 'Jost', sans-serif; color: #333333; margin: 0 0 14px; }
        .reset-button { display: inline-block; background: #000000; color: white; padding: 12px 24px; text-decoration: none; font-family: 'Poppins', sans-serif; font-weight: 600; border: 2px solid #000000; }
        .reset-button:hover { background: #ffffff; color: #000000; }
        .notice { background: #f8f8f8; border-left: 3px solid #000000; padding: 16px; margin: 18px 0; font-family: 'Jost', sans-serif; color: #333333; }
        .link { word-break: break-all; background: #ffffff; border: 1px solid #e5e5e5; padding: 10px; font-family: monospace; font-size: 13px; }
        .footer { background: #f8f8f8; padding: 22px; text-align: center; border-top: 1px solid #e5e5e5; }
        .footer p { font-family: 'Jost', sans-serif; color: #666666; font-size: 13px; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">IZAJ</div>
          <div class="title">Password Reset Request</div>
        </div>
        
        <div class="content">
          <p>Hello ${userName},</p>
          <p>We received a request to reset your password for your IZAJ account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 16px 0;">
            <a href="${resetUrl}" class="reset-button">Reset My Password</a>
          </div>
          <div class="notice">
            <strong>Important:</strong> This link will expire in ${expiryHours} hours. If you didn't request this, please ignore this email.
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p class="link">${resetUrl}</p>
        </div>
        
        <div class="footer">
          <p>© 2024 IZAJ. All rights reserved.</p>
          <p>This is an automated message. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Password Reset Request - IZAJ
    
    Hello ${userName},
    
    We received a request to reset your password for your IZAJ account. If you made this request, visit the link below to reset your password:
    
    ${resetUrl}
    
    Important Security Information:
    - This link will expire in ${expiryHours} hours
    - If you didn't request this password reset, please ignore this email
    - Never share this link with anyone
    - IZAJ will never ask for your password via email
    
    Need Help?
    If you're having trouble accessing your account or have questions, please contact our support team:
    - Email: support@izaj.com
    - Phone: +63 XXX XXX XXXX
    - Available: Monday - Friday, 9 AM - 6 PM (PHT)
    
    This email was sent from IZAJ. If you didn't request this password reset, you can safely ignore this email.
    
    © 2024 IZAJ. All rights reserved.
    This is an automated message. Please do not reply to this email.
  `;
  
  return { subject, html, text };
}

export function getConfirmationEmail(data: ConfirmationEmailData): EmailTemplate {
  const { confirmationUrl, userName = 'User', expiryHours = 24 } = data;
  
  const subject = 'Confirm Your Email - IZAJ Lighting Centre';
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Confirmation - IZAJ</title>
      <style>
        body { font-family: 'Jost', 'Segoe UI', sans-serif; line-height: 1.6; color: #000000; background: #ffffff; padding: 20px; }
        .container { max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; }
        .header { background: #000000; color: white; padding: 32px 28px; text-align: center; }
        .logo { font-family: 'Jost', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
        .title { font-family: 'Jost', sans-serif; font-size: 22px; margin-top: 8px; }
        .content { padding: 28px; }
        .content p { font-family: 'Jost', sans-serif; color: #333333; margin: 0 0 14px; }
        .greeting { font-family: 'Jost', sans-serif; font-size: 22px; font-weight: 700; color: #000000; margin: 0 0 18px; }
        .confirm-button { display: inline-block; background: #000000; color: white; padding: 14px 28px; text-decoration: none; font-family: 'Jost', sans-serif; font-weight: 600; border: 2px solid #000000; }
        .confirm-button:hover { background: #ffffff; color: #000000; }
        .notice { background: #f8f8f8; border-left: 3px solid #000000; padding: 16px; margin: 18px 0; font-family: 'Jost', sans-serif; color: #333333; }
        .link-container { background: #f8f8f8; border: 1px solid #e5e5e5; padding: 16px; margin: 18px 0; }
        .link-container p { font-family: 'Jost', sans-serif; font-size: 13px; color: #666666; margin-bottom: 8px; }
        .link { word-break: break-all; background: #ffffff; border: 1px solid #e5e5e5; padding: 10px; font-family: monospace; font-size: 13px; color: #333333; }
        .footer { background: #f8f8f8; padding: 22px; text-align: center; border-top: 1px solid #e5e5e5; }
        .footer p { font-family: 'Jost', sans-serif; color: #666666; font-size: 13px; margin: 5px 0; }
        @media (max-width: 600px) { .content, .header, .footer { padding: 20px; } .header .logo { font-size: 24px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">IZAJ Lighting Centre</div>
          <div class="title">Email Confirmation</div>
        </div>
        
        <div class="content">
          <h2 class="greeting">Hello ${userName}!</h2>
          <p>Thank you for creating an account with <strong>IZAJ Lighting Centre</strong>. Please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 26px 0;">
            <a href="${confirmationUrl}" class="confirm-button">Confirm Email Address</a>
          </div>
          <div class="link-container">
            <p>If the button doesn't work, copy and paste this link:</p>
            <p class="link">${confirmationUrl}</p>
          </div>
          <div class="notice">
            <strong>Important:</strong> This confirmation link will expire in ${expiryHours} hours for security reasons. If you didn't create this account, please ignore this email.
          </div>
          <p>If you didn't create an account with IZAJ Lighting Centre, please ignore this email.</p>
          <p style="margin-top: 20px;">Best regards,<br><strong>The IZAJ Lighting Centre Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2024 IZAJ Lighting Centre. All rights reserved.</p>
          <p>For support, contact us at <strong>izajtrading@gmail.com</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Email Confirmation - IZAJ Lighting Centre
    
    Hello ${userName}!
    
    Thank you for creating an account with IZAJ Lighting Centre. To complete your registration, please confirm your email address by visiting this link:
    
    ${confirmationUrl}
    
    Important Security Information:
    - This link will expire in ${expiryHours} hours
    - If you didn't create this account, please ignore this email
    - Never share this link with anyone
    - IZAJ will never ask for your password via email
    
    Welcome to the IZAJ family!
    
    Best regards,
    The IZAJ Lighting Centre Team
    
    © 2024 IZAJ Lighting Centre. All rights reserved.
    For support, contact us at izajtrading@gmail.com
  `;
  
  return { subject, html, text };
}

export function getPasswordResetSuccessEmail(userName: string = 'User'): EmailTemplate {
  const subject = 'Password Successfully Reset - IZAJ';
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful - IZAJ</title>
      <style>
        body { font-family: 'Jost', 'Segoe UI', sans-serif; line-height: 1.6; color: #000000; background: #ffffff; padding: 20px; }
        .container { max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; }
        .header { background: #000000; color: white; padding: 32px 28px; text-align: center; }
        .logo { font-family: 'Jost', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
        .content { padding: 28px; }
        .content p { font-family: 'Jost', sans-serif; color: #333333; margin: 0 0 14px; }
        .tips { background: #f8f8f8; border-left: 3px solid #000000; padding: 16px; margin: 18px 0; }
        .footer { background: #f8f8f8; padding: 22px; text-align: center; border-top: 1px solid #e5e5e5; }
        .footer p { font-family: 'Jost', sans-serif; color: #666666; font-size: 13px; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">IZAJ</div>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Your password has been successfully reset. You can now log in to your IZAJ account with your new password.</p>
          <div class="tips">
            <strong>Security Tips:</strong>
            <ul>
              <li>Use a strong, unique password</li>
              <li>Never share your password with anyone</li>
              <li>Log out from shared or public computers</li>
              <li>Enable two-factor authentication if available</li>
              <li>Regularly update your password</li>
            </ul>
          </div>
          <p>If you didn't make this change or suspect unauthorized access to your account, please contact our support team immediately.</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing IZAJ.</p>
          <p>© 2024 IZAJ. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Password Successfully Reset - IZAJ
    
    Hello ${userName},
    
    Your password has been successfully reset. You can now log in to your IZAJ account with your new password.
    
    Security Tips:
    - Use a strong, unique password
    - Never share your password with anyone
    - Log out from shared or public computers
    - Enable two-factor authentication if available
    - Regularly update your password
    
    If you didn't make this change or suspect unauthorized access to your account, please contact our support team immediately.
    
    Thank you for choosing IZAJ!
    
    © 2024 IZAJ. All rights reserved.
  `;
  
  return { subject, html, text };
}
