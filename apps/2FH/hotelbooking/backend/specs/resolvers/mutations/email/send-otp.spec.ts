import { OtpModel } from 'src/models/otp-model';
import { sendOtp } from 'src/resolvers/mutations';
import { sendEmail } from 'src/utils/sent-email';

jest.mock('src/models/otp-model', () => ({
  OtpModel: { create: jest.fn() },
}));
jest.mock('src/utils/sent-email', () => ({
  sendEmail: jest.fn(),
}));

describe('sendOtp', () => {
  const mockEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate otp, save to db, send email and return message', async () => {
    (OtpModel.create as jest.Mock).mockResolvedValueOnce({});
    (sendEmail as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await sendOtp({}, { email: mockEmail });

    expect(OtpModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockEmail,
        otp: expect.any(String), // otp нь random байна
        expiresAt: expect.any(Date),
      })
    );
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: mockEmail,
        subject: 'Your signup OTP',
        text: expect.stringContaining('Your OTP code is'),
      })
    );
    expect(result).toEqual({ message: 'OTP sent' });
  });
});
