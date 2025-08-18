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
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  await transport.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: 'Your OTP Verification Code',
    text: `Your OTP is: ${otp}`,
    html: `<h1>Your OTP is: ${otp}</h1>
           <p>It is valid for 5 minutes.</p>`,
  });

  // Return OTP so you can save it in DB or verify later
  return otp;
};
