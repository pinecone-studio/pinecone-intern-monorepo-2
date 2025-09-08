import { config as configDotenv } from 'dotenv';
import { createTransport } from 'nodemailer';

configDotenv();

const { EMAIL_PASS, EMAIL_USER } = process.env;

const transport = createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});
export const sendUserVerificationLink = async (baseURL: string, email: string) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log('📨 Sending OTP:', otp, 'to', email);

  try {
    const result = await transport.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Your OTP Verification Code',
      text: `Your OTP is: ${otp}`,
      html: `<h1>Your OTP is: ${otp}</h1><p>It is valid for 5 minutes.</p>`,
    });

    console.log('✅ Email sent:', result);

    return otp;
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    throw new Error('Email sending failed');
  }
};
