import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

type SendEmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export const sendEmail = async ({ to, subject, text, html }: SendEmailOptions) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(`Email could not be sent: ${error}`,);
  }
};
