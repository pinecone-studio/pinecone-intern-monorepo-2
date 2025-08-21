import { User } from 'src/models';
import { generateOTP, sendOTPEmail } from 'src/utils';
import { forgotPassword, otpStorage } from 'src/resolvers/mutations/user/forgot-password-mutation';

jest.mock('src/models');
jest.mock('src/utils');

const mockedUser = User as jest.Mocked<typeof User>;
const mockedGenerateOTP = generateOTP as jest.MockedFunction<typeof generateOTP>;
const mockedSendOTPEmail = sendOTPEmail as jest.MockedFunction<typeof sendOTPEmail>;

type MockUser = {
  id: string;
  email?: string | null;
  userName: string;
}
describe('forgotPassword - Main Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    otpStorage.clear();
  });
  afterEach(() => {
    jest.clearAllTimers();
  });
  describe('when user is found by email', () => {
    const mockUser: MockUser = { 
      id: '1', 
      email: 'test@example.com', 
      userName: 'testuser' 
    };
    beforeEach(() => {
      mockedUser.findOne.mockResolvedValue(mockUser);
      mockedGenerateOTP.mockReturnValue('123456');
      mockedSendOTPEmail.mockResolvedValue(undefined);
    });
    it('should successfully send OTP when identifier is email', async () => {
      const input = { identifier: 'test@example.com' };
      const result = await forgotPassword(null, { input });
      expect(result).toBe(true);
      expect(mockedUser.findOne).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
      expect(mockedGenerateOTP).toHaveBeenCalled();
      expect(mockedSendOTPEmail).toHaveBeenCalledWith('test@example.com', '123456');
      expect(otpStorage.has('test@example.com')).toBe(true);
    });
    it('should handle email with different case', async () => {
      const input = { identifier: 'TEST@EXAMPLE.COM' };
      await forgotPassword(null, { input });
      expect(mockedUser.findOne).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
      expect(otpStorage.has('test@example.com')).toBe(true);
    });
    it('should trim whitespace from email', async () => {
      const input = { identifier: '  test@example.com  ' };
      await forgotPassword(null, { input });
      expect(mockedUser.findOne).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
    });
  });
  describe('when user is found by username', () => {
    const mockUser: MockUser = { 
      id: '1', 
      email: 'test@example.com', 
      userName: 'testuser' 
    };
    beforeEach(() => {
      mockedUser.findOne.mockResolvedValue(mockUser);
      mockedGenerateOTP.mockReturnValue('123456');
      mockedSendOTPEmail.mockResolvedValue(undefined);
    });
    it('should successfully send OTP when identifier is username', async () => {
      const input = { identifier: 'testuser' };
      const result = await forgotPassword(null, { input });
      expect(result).toBe(true);
      expect(mockedUser.findOne).toHaveBeenCalledWith({
        userName: 'testuser'
      });
      expect(mockedSendOTPEmail).toHaveBeenCalledWith('test@example.com', '123456');
      expect(otpStorage.has('test@example.com')).toBe(true);
    });
    it('should handle username with different case', async () => {
      const input = { identifier: 'TESTUSER' };
      await forgotPassword(null, { input });
      expect(mockedUser.findOne).toHaveBeenCalledWith({
        userName: 'testuser'
      });
    });
  });
  describe('OTP storage functionality', () => {
    const mockUser: MockUser = { 
      id: '1', 
      email: 'test@example.com',
      userName: 'testuser'
    };
    beforeEach(() => {
      mockedUser.findOne.mockResolvedValue(mockUser);
      mockedGenerateOTP.mockReturnValue('123456');
      mockedSendOTPEmail.mockResolvedValue(undefined);
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });
    it('should store OTP with correct expiration', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const input = { identifier: 'test@example.com' };
      await forgotPassword(null, { input });
      const storedOTP = otpStorage.get('test@example.com');
      expect(storedOTP).toEqual({
        otp: '123456',
        expiresAt: now + 10 * 60 * 1000
      });
    });
    it('should clean up expired OTP after 10 minutes', async () => {
      const input = { identifier: 'test@example.com' };
      await forgotPassword(null, { input });
      expect(otpStorage.has('test@example.com')).toBe(true);
      jest.advanceTimersByTime(10 * 60 * 1000);
      expect(otpStorage.has('test@example.com')).toBe(false);
    });
    it('should overwrite existing OTP for same email', async () => {
      otpStorage.set('test@example.com', { otp: 'old123', expiresAt: Date.now() + 5000 });
      const input = { identifier: 'test@example.com' };
      await forgotPassword(null, { input });
      const storedOTP = otpStorage.get('test@example.com');
      expect(storedOTP?.otp).toBe('123456');
    });
  });
});