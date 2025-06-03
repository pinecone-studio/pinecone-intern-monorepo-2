import nodemailer from 'nodemailer';

type OtpType = {
  email: string;
  otp: string;
};
export const sendOtp = async (_: unknown, { input }: { input: OtpType }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: input.email,
    subject: 'Your OTP Verification Code',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #5F2DF5; text-align: center;">Restaurant</h2>
          <h3 style="text-align: center;">Таны нэг удаагийн нууц үг</h3>
          <div style="background-color: #f2f2f2; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${input.otp}</h1>
          </div>
          <p style="text-align: center; color: #666;">Энэ нууц үг 10 минутын дараа устана</p>
        </div>
      `,
  };

  await transporter.sendMail(mailOptions);
  return {
    success: true,
    message: 'Otp send successfuly',
  };
};
