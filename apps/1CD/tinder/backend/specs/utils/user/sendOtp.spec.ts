import nodemailer from 'nodemailer';
import { GraphQLError } from 'graphql';
import { sendOtpMail } from '../../../src/utils/user/send-otp-email';


jest.mock('nodemailer');

describe('sendOtpMail', () => {
  const mockTransporter = {
    sendMail: jest.fn()
  };

  beforeEach(() => {

    jest.clearAllMocks();
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
  });

  it('should send an email successfully', async () => {
    // Arrange
    const testEmail = 'cypress@gmail.com';
    const testOtp = '0000';

    mockTransporter.sendMail.mockResolvedValue({
      messageId: 'test-message-id'
    });


    const result = await sendOtpMail(testEmail, testOtp);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'tomorbatmonhtsatsral@gmail.com',
        pass: process.env.OTP_SECRET
      },
      debug: true
    });

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'tomorbatmonhtsatsral@gmail.com',
      to: testEmail,
      subject: 'OTP Verification',
      text: `Your OTP is: ${testOtp}. This OTP will expire in 5 minutes!`
    });

    expect(result).toBe('Email sent successfully');
  });

  it('should throw a GraphQLError when email sending fails', async () => {

    const testEmail = 'test@example.com';
    const testOtp = '123456';


    mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));


    await expect(sendOtpMail(testEmail, testOtp)).rejects.toThrow(GraphQLError);
    await expect(sendOtpMail(testEmail, testOtp)).rejects.toMatchObject({
      extensions: {
        code: 'FAILED_OTP'
      }
    });
  });
});