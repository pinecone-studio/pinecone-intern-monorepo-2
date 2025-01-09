import { MutationResolvers } from '../../../generated';
import { OTPModel } from '../../../models/otp';
import nodemailer from 'nodemailer';
import { generateHtmlTemplate } from 'src/utils/generate-html-template';
import { UserModel } from 'src/models';

export const createsOTP: MutationResolvers['createsOTP'] = async (_, { email }) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  const oldOTP = await OTPModel.findOne({ email });
  if (oldOTP) {
    if (oldOTP.expirationDate > new Date()) {
      return oldOTP;
    }
    await OTPModel.deleteOne({ email });
  }

  const otp = generateOTP();
  await sendEmail(otp, email);

  const otpObj = await OTPModel.create({
    email,
    OTP: otp,
    expirationDate: new Date(Date.now() + 10 * 60 * 1000),
  });

  return otpObj;
};

const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  return otp;
};

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SEND_GRID_EMAIL_KEY,
  },
});

const mailOptions = {
  from: 'zolookorzoloo@gmail.com', // This should be your verified sender email (can be any email)
  to: 'zolookorzoloo@gmail.com', // The recipient's email
  subject: 'Test Email',
  html: 'This is a test email sent using Nodemailer and SendGrid.',
  // html: generateHtmlTemplate({otp}),
};

const sendEmail = (otp: string, email: string) => {
  transporter.sendMail({ ...mailOptions, html: generateHtmlTemplate(otp), to: email });
};
