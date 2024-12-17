import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: true,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export const sendResetPassUrlToMail = async (email: string, resetToken: string) => {
  const resetUrl = `https://intern-1cd-instagram-frontend-prod.vercel.app/resetpassword?resetToken=${resetToken}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset password link - Instagram project - intern',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset account password</h2>
          <p>Hello,</p>
          <p>Instagram project intern -  We received a request to reset the password for your account.</p>
          <p>If you made this request, click the link below to change your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px;
                      display: inline-block;">
              Reset password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            this link will expire after 5 minutes.
          </p>
          <p style="color: #666; font-size: 14px;">
            If you did not make this request, please ignore this email.
          </p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">
            © ${new Date().getFullYear()} Instagram project intern. copyright
          </p>
        </div>
      `,
  });
};
