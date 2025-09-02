import { forgotPassword} from 'src/resolvers/mutations/forgot-reset-password';
import { PasswordResetResponse } from 'src/generated';
import { User } from 'src/models';
import { OtpToken } from 'src/models/otp-token';
import { sendUserVerificationLink } from 'src/utils/mail-handler';

jest.mock('src/models');
jest.mock('src/models/otp-token', () => ({ OtpToken: { findOne: jest.fn(), create: jest.fn(), findOneAndDelete: jest.fn(), deleteOne: jest.fn() } }));
jest.mock('src/utils/mail-handler');
jest.mock('bcryptjs');
const mockEmail = "test@example.com";
const mockOtp = "123456";
const mockUser = {
  email: mockEmail,
  password: "oldPassword",
  save: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.EMAIL_USER = 'test@example.com';
  process.env.EMAIL_PASS = 'test-password';
});

describe("forgotPassword", () => {
  it("should return error if email credentials not configured", async () => {
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
    
    const res = await forgotPassword!({}, { input: { email: mockEmail } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Email service not configured");
  });

  it("should return error if email not registered", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const res = await forgotPassword!({}, { input: { email: mockEmail } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Email not registered");
  });

  it("should create OTP if user exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpToken.findOneAndDelete as jest.Mock).mockResolvedValue({});
    (OtpToken.create as jest.Mock).mockResolvedValue({});

    const res = await forgotPassword!({}, { input: { email: mockEmail } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Success);
    expect(res.message).toBe("OTP sent to your email");
    expect(OtpToken.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: mockEmail, otp: mockOtp, expiresAt: expect.any(Date) })
    );
  });

  it("should handle internal server error on User.findOne", async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));
    const res = await forgotPassword!({}, { input: { email: mockEmail } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Internal server error: DB error");
  });

  it("should handle internal server error on OtpToken.create", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpToken.findOneAndDelete as jest.Mock).mockResolvedValue({});
    (OtpToken.create as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await forgotPassword!({}, { input: { email: mockEmail } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Internal server error: DB error");
  });

  it("should handle non-Error exception", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpToken.findOneAndDelete as jest.Mock).mockResolvedValue({});
    (OtpToken.create as jest.Mock).mockRejectedValue("String error");

    const res = await forgotPassword!({}, { input: { email: mockEmail } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Internal server error: Unknown error");
  });
});
