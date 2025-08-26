import { resetPassword } from "src/resolvers/mutations/forgot-reset-password";
import { PasswordResetResponse } from "src/generated";
import { User } from "src/models";
import { OtpToken } from "src/models/otp-token";
import bcrypt from "bcryptjs";

jest.mock('src/models');
jest.mock('src/models/otp-token', () => ({ OtpToken: { findOne: jest.fn(), create: jest.fn(), findOneAndDelete: jest.fn(), deleteOne: jest.fn() } }));
jest.mock('src/utils/mail-handler');
jest.mock('bcryptjs');
const mockEmail = "test@example.com";
const mockUser = {
  email: mockEmail,
  password: "oldPassword",
  save: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("resetPassword", () => {
  const newPassword = "newPassword";

  it("should return error if user not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const res = await resetPassword!({}, { input: { email: mockEmail, newPassword } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("User not found");
  });

  it("should reset password successfully", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (OtpToken.deleteOne as jest.Mock).mockResolvedValue({});

    const res = await resetPassword!({}, { input: { email: mockEmail, newPassword } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Success);
    expect(res.message).toBe("Password reset successfully");
    expect(mockUser.password).toBe("hashedPassword");
    expect(mockUser.save).toHaveBeenCalled();
    expect(OtpToken.deleteOne).toHaveBeenCalledWith({ email: mockEmail });
  });

  it("should handle internal server error on User.findOne", async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));
    const res = await resetPassword!({}, { input: { email: mockEmail, newPassword } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Internal server error");
  });

  it("should handle internal server error on bcrypt.hash", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error("Hash error"));
    const res = await resetPassword!({}, { input: { email: mockEmail, newPassword } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Internal server error");
  });

  it("should handle internal server error on user.save", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ ...mockUser, save: jest.fn().mockRejectedValue(new Error("Save error")) });
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    const res = await resetPassword!({}, { input: { email: mockEmail, newPassword } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Internal server error");
  });

  it("should handle internal server error on OtpToken.deleteOne", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (OtpToken.deleteOne as jest.Mock).mockRejectedValue(new Error("Delete error"));

    const res = await resetPassword!({}, { input: { email: mockEmail, newPassword } }, {} as any, {} as any);
    expect(res.status).toBe(PasswordResetResponse.Error);
    expect(res.message).toBe("Internal server error");
  });
});
