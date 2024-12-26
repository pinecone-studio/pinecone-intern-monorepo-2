import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

type QrCodeImages = string[];

export const sendEmailWithQr = async (email: string, qrCodeImages: QrCodeImages): Promise<void> => {
  console.log(qrCodeImages);

  // Generate unique cid for each QR code
  const attachments = qrCodeImages.map((qrCodeDataUrl, index) => ({
    filename: `qr-code-${index + 1}.png`,
    content: qrCodeDataUrl.split('base64,')[1], // Strip out the base64 prefix
    encoding: 'base64',
    cid: `qr-code-${index + 1}`, // Unique CID for each image
  }));

  // Create HTML content with cid references for inline images
  const qrImagesHtml = qrCodeImages.map((_, index) => `<img src="cid:qr-code-${index + 1}" alt="QR Code ${index + 1}" style="max-width: 150px; margin: 10px;" />`).join('<br/>');

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your QR Codes for Tickets',
    text: 'You have received your QR codes for your tickets.',
    html: `<div style="overflow: auto;">
          <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
            <hr style="border: none; border-top: 1px solid #eee;" />
    
            <p style="font-size: 1.1em;">
              Сайн байна уу? Танд энэ өдрийн мэнд хүргэе.
            </p>
            <p>Таны худалдан авалтанд баярлалаа, таны тасалбаруудын QR илгээлээ, qr-code болгон өөрийн гэсэн мэдээлэлийн агуулсан байгаа:</p>
            
            ${qrImagesHtml}
    
            <p style="font-size: 0.9em;">
              Хүндэтгэсэн,
              <br />
              Concert-Ticket LLC
            </p>
            <hr style="border: none; border-top: 1px solid #eee;" />
          </div>
        </div>`,
    attachments, // Attach images
  });
};
