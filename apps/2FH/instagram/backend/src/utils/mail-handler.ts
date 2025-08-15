import nodemailer from 'nodemailer';
import { GraphQLError } from 'graphql';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@instagram.com',
      to: email,
      subject: 'Password Reset OTP - Instagram',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #E4405F; margin: 0;">Instagram Clone</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">
              We received a request to reset your password. Use the OTP below to complete the process:
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px dashed #E4405F; margin: 30px 0;">
              <h1 style="color: #E4405F; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              This OTP is valid for 10 minutes only.
            </p>
            <p style="color: #999; font-size: 12px; line-height: 1.4;">
              If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2024 Instagram Clone. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    
    if (error instanceof Error) {
      throw new GraphQLError('Failed to send OTP email'),{
        extensions: {
          code: 'EMAIL_SERVICE_ERROR',
        }
      };
    }
    
    throw new GraphQLError('Failed to send OTP email', {
      extensions: {
        code: 'EMAIL_SERVICE_ERROR',
      }
    });
  }
};