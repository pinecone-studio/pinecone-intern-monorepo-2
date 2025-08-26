import { verifyOtp} from 'src/resolvers/mutations/forgot-reset-password';
import { PasswordResetResponse } from 'src/generated';
import { OtpToken } from 'src/models/otp-token';


jest.mock('src/models');
jest.mock('src/models/otp-token', () => ({ OtpToken: { findOne: jest.fn(), create: jest.fn(), findOneAndDelete: jest.fn(), deleteOne: jest.fn() } }));
jest.mock('src/utils/mail-handler');
jest.mock('bcryptjs');
const mockEmail = "test@example.com";
const mockOtp = "123456";

beforeEach(() => {
  jest.clearAllMocks();
});
describe("verifyOtp", () => {
  it("should return error if OTP not found", async () => {
    (OtpToken.findOne as jest.Mock).mockResolvedValue(null);
    const res = await verifyOtp!({}, { input: { email: mockEmail, otp: mockOtp } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("OTP not found");
  });

  it("should return error if OTP incorrect", async () => {
    (OtpToken.findOne as jest.Mock).mockResolvedValue({ otp: "000000", expiresAt: new Date(Date.now() + 10000) });
    const res = await verifyOtp!({}, { input: { email: mockEmail, otp: mockOtp } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Incorrect OTP");
  });

  it("should return error if OTP expired", async () => {
    (OtpToken.findOne as jest.Mock).mockResolvedValue({ otp: mockOtp, expiresAt: new Date(Date.now() - 10000) });
    const res = await verifyOtp!({}, { input: { email: mockEmail, otp: mockOtp } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("OTP expired");
  });

  it("should verify OTP successfully", async () => {
    (OtpToken.findOne as jest.Mock).mockResolvedValue({ otp: mockOtp, expiresAt: new Date(Date.now() + 10000) });
    const res = await verifyOtp!({}, { input: { email: mockEmail, otp: mockOtp } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Success);
    expect(res.message).toBe("OTP verified successfully");
  });

  it("should handle internal server error", async () => {
    (OtpToken.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));
    const res = await verifyOtp!({}, { input: { email: mockEmail, otp: mockOtp } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Internal server error");
  });
});
