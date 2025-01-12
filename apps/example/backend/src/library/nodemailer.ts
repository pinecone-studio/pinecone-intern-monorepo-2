import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'developers.pinecone.mn@gmail.com',
    pass: 'aztf hgij kqsj tfac',
  },
});

export const sendEmail = async (to: string, text: string) => {
  const options = {
    from: 'developers.pinecone.mn@gmail.com',
    to,
    subject: 'Reset Password Pinecone Intern',
    text,
  };

  await transporter.sendMail(options);
};
