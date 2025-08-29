import { sendVerificationEmail } from 'src/resolvers/mutations/user/send-verification-email-mutation';
import { generateOTP, sendVerificationEmail as sendEmail } from 'src/utils';
import { otpStorage } from 'src/resolvers/mutations/user/forgot-password-mutation';

jest.mock('src/utils');
jest.mock('src/resolvers/mutations/user/forgot-password-mutation', () => ({
  otpStorage: new Map()
}));

const mockGenerateOTP = generateOTP as jest.MockedFunction<typeof generateOTP>;
const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;
const mockOtpStorage = otpStorage as jest.Mocked<Map<string, { otp: string; expiresAt: number }>>;

const mockSetTimeout = jest.spyOn(global, 'setTimeout').mockImplementation((_callback, _delay) => {
  return 123 as unknown as NodeJS.Timeout;
});

describe('sendVerificationEmail - OTP Storage Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOtpStorage.clear();
    mockSetTimeout.mockClear();
    mockSendEmail.mockResolvedValue(undefined);
  });

  it('should overwrite existing OTP for same email', async () => {
    const input = { email: 'test@example.com' };

    // First request
    mockGenerateOTP.mockReturnValueOnce('111111');
    await sendVerificationEmail(null, { input });
    expect(mockOtpStorage.get('verification_test@example.com')?.otp).toBe('111111');

    // Second request should overwrite
    mockGenerateOTP.mockReturnValueOnce('222222');
    await sendVerificationEmail(null, { input });
    expect(mockOtpStorage.get('verification_test@example.com')?.otp).toBe('222222');
  });

  it('should handle multiple different emails simultaneously', async () => {
    mockGenerateOTP
      .mockReturnValueOnce('111111')
      .mockReturnValueOnce('222222')
      .mockReturnValueOnce('333333');

    await sendVerificationEmail(null, { input: { email: 'user1@example.com' } });
    await sendVerificationEmail(null, { input: { email: 'user2@example.com' } });
    await sendVerificationEmail(null, { input: { email: 'user3@example.com' } });

    expect(mockOtpStorage.get('verification_user1@example.com')?.otp).toBe('111111');
    expect(mockOtpStorage.get('verification_user2@example.com')?.otp).toBe('222222');
    expect(mockOtpStorage.get('verification_user3@example.com')?.otp).toBe('333333');
  });

  it('should register cleanup function that removes expired OTP', async () => {
    mockGenerateOTP.mockReturnValue('123456');
    const input = { email: 'test@example.com' };
    await sendVerificationEmail(null, { input });

    // Get the cleanup function that was passed to setTimeout
    const cleanupFunction = mockSetTimeout.mock.calls[0]?.[0] as () => void;
    
    // Verify OTP exists before cleanup
    expect(mockOtpStorage.get('verification_test@example.com')).toBeDefined();
    
    // Execute the cleanup function
    cleanupFunction();
    
    // Verify OTP is removed after cleanup
    expect(mockOtpStorage.get('verification_test@example.com')).toBeUndefined();
  });
})