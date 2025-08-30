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

describe('sendVerificationEmail - Success Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOtpStorage.clear();
    mockSetTimeout.mockClear();
    mockGenerateOTP.mockReturnValue('123456');
    mockSendEmail.mockResolvedValue(undefined);
  });

  it('should send verification email successfully', async () => {
    const input = { email: 'test@example.com' };
    const result = await sendVerificationEmail(null, { input });

    expect(mockGenerateOTP).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith('test@example.com', '123456');
    expect(result).toBe(true);
  });

  it('should store OTP in storage with correct key', async () => {
    const input = { email: 'TEST@EXAMPLE.COM' };
    await sendVerificationEmail(null, { input });

    const storedData = mockOtpStorage.get('verification_test@example.com');
    expect(storedData).toBeDefined();
    expect(storedData?.otp).toBe('123456');
    expect(storedData?.expiresAt).toBeGreaterThan(Date.now());
    expect(storedData?.expiresAt).toBeLessThanOrEqual(Date.now() + 10 * 60 * 1000);
  });

  it('should handle email with whitespace and mixed case', async () => {
    const input = { email: '  Test@Example.COM  ' };
    await sendVerificationEmail(null, { input });

    const storedData = mockOtpStorage.get('verification_test@example.com');
    expect(storedData).toBeDefined();
    expect(mockSendEmail).toHaveBeenCalledWith('  Test@Example.COM  ', '123456');
  });

  it('should set up cleanup timeout', async () => {
    const input = { email: 'test@example.com' };
    await sendVerificationEmail(null, { input });

    expect(mockSetTimeout).toHaveBeenCalledWith(
      expect.any(Function),
      10 * 60 * 1000 // 10 minutes
    );
  });

  it('should generate different OTPs for multiple requests', async () => {
    mockGenerateOTP
      .mockReturnValueOnce('123456')
      .mockReturnValueOnce('654321');

    await sendVerificationEmail(null, { input: { email: 'test1@example.com' } });
    await sendVerificationEmail(null, { input: { email: 'test2@example.com' } });

    const stored1 = mockOtpStorage.get('verification_test1@example.com');
    const stored2 = mockOtpStorage.get('verification_test2@example.com');

    expect(stored1?.otp).toBe('123456');
    expect(stored2?.otp).toBe('654321');
  });
})