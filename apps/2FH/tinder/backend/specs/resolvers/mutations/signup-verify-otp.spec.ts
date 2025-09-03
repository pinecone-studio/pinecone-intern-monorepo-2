import { signUpVerifyOtp } from 'src/resolvers/mutations/signup-verify-otp-mutation';
import { OtpStore } from 'src/models/signup-otp-model';

jest.mock('src/models/signup-otp-model', () => ({
  OtpStore: {
    findOne: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

describe('signUpVerifyOtp', () => {
  const mockEmail = 'test@example.com';
  const mockOtp = '123456';
  const now = new Date();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should verify valid OTP and delete it', async () => {
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes ahead
    (OtpStore.findOne as jest.Mock).mockResolvedValue({ email: mockEmail, otp: mockOtp, expiresAt });
    (OtpStore.deleteOne as jest.Mock).mockResolvedValue({});

    const result = await signUpVerifyOtp!({}, { email: mockEmail, otp: mockOtp }, {} as any, {} as any);

    expect(OtpStore.findOne).toHaveBeenCalledWith({ email: mockEmail, otp: mockOtp });
    expect(OtpStore.deleteOne).toHaveBeenCalledWith({ email: mockEmail });

    expect(result).toEqual({
      input: mockEmail,
      output: 'OTP verified successfully',
    });
  });

  it('should throw error if OTP not found', async () => {
    (OtpStore.findOne as jest.Mock).mockResolvedValue(null);

    await expect(signUpVerifyOtp!({}, { email: mockEmail, otp: mockOtp }, {} as any, {} as any)).rejects.toThrow('Invalid or expired OTP');

    expect(OtpStore.findOne).toHaveBeenCalledWith({ email: mockEmail, otp: mockOtp });
    expect(OtpStore.deleteOne).not.toHaveBeenCalled();
  });

  it('should throw error if OTP is expired', async () => {
    const expiredDate = new Date(now.getTime() - 1); // already expired
    (OtpStore.findOne as jest.Mock).mockResolvedValue({ email: mockEmail, otp: mockOtp, expiresAt: expiredDate });

    await expect(signUpVerifyOtp!({}, { email: mockEmail, otp: mockOtp }, {} as any, {} as any)).rejects.toThrow('Invalid or expired OTP');

    expect(OtpStore.findOne).toHaveBeenCalledWith({ email: mockEmail, otp: mockOtp });
    expect(OtpStore.deleteOne).not.toHaveBeenCalled();
  });
});
