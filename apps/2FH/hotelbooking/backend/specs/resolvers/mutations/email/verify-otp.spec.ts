import { OtpModel } from 'src/models/otp-model';
import { verifyOtp } from 'src/resolvers/mutations';

jest.mock('src/models/otp-model', () => ({
  OtpModel: {
    findOne: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

describe('verifyOtp', () => {
  const mockEmail = 'test@example.com';
  const mockOtp = '1234';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. should verify OTP and delete record when valid', async () => {
    const mockRecord = { _id: 'otpId', email: mockEmail, otp: mockOtp };

    (OtpModel.findOne as jest.Mock).mockReturnValueOnce({
      sort: jest.fn().mockResolvedValueOnce(mockRecord),
    });
    (OtpModel.deleteOne as jest.Mock).mockResolvedValueOnce({});

    const result = await verifyOtp({}, { input: { email: mockEmail, otp: mockOtp } });

    expect(OtpModel.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockEmail,
        otp: mockOtp,
        expiresAt: expect.any(Object),
      })
    );
    expect(OtpModel.deleteOne).toHaveBeenCalledWith({ _id: mockRecord._id });
    expect(result).toEqual({ message: 'OTP verified' });
  });

  it('2. should throw error if OTP not found or expired', async () => {
    (OtpModel.findOne as jest.Mock).mockReturnValueOnce({
      sort: jest.fn().mockResolvedValueOnce(null),
    });

    await expect(verifyOtp({}, { input: { email: mockEmail, otp: mockOtp } })).rejects.toThrow('Invalid OTP or OTP expired');

    expect(OtpModel.deleteOne).not.toHaveBeenCalled();
  });
});
