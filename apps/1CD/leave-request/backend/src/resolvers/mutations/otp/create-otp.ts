import { GraphQLResolveInfo } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { OTPModel } from '../../../models/otp';
import { findUserByEmail } from '../../queries';
import nodemailer from 'nodemailer';

export const createsOTP: MutationResolvers['createsOTP'] = async (_, { email }) => {

  

  const user = await findUserByEmail!({}, { email }, {}, {} as GraphQLResolveInfo);
  if (!user) {
    throw new Error('User not found');
  }
  const oldOTP = await OTPModel.findOne({ email });
  if (oldOTP && oldOTP.expirationDate > new Date()) {
    throw new Error('Old OTP is not expired');
  }

  const otp = generateOTP();
  
  const otpObj = await OTPModel.create({
    email,
    OTP: otp,
    expirationDate: new Date(Date.now() + 10 * 60 * 1000),
  });

  
  sendEmail(otp)
  
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
  from: 'zolookorzoloo@gmail.com',   // This should be your verified sender email (can be any email)
  to: 'zolookorzoloo@gmail.com',     // The recipient's email
  subject: 'Test Email',
  text: 'This is a test email sent using Nodemailer and SendGrid.',
};

const sendEmail = (otp: string) => {
  transporter.sendMail({...mailOptions, text: otp});
};