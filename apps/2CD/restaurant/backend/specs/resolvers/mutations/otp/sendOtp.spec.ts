import nodemailer from 'nodemailer';
import { sendOtp } from 'src/resolvers/mutations';

const sendMailMock = jest.fn().mockResolvedValue(true);

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: sendMailMock,
  })),
}));

describe('sendOtp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAIL_USER = 'testuser@example.com';
    process.env.EMAIL_PASSWORD = 'testpassword';
  });

  it('should send OTP email and return success response', async () => {
    const input = {
      email: 'user@example.com',
      otp: '123456',
    };

    const result = await sendOtp(undefined, { input });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'testuser@example.com',
        pass: 'testpassword',
      },
    });

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'testuser@example.com',
        to: input.email,
        subject: 'Your OTP Verification Code',
        html: expect.stringContaining(input.otp),
      })
    );

    expect(result).toEqual({
      success: true,
      message: 'Otp send successfuly',
    });
  });
});
