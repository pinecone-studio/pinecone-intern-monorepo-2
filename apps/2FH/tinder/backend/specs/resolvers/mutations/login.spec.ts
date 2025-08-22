 import { login } from "src/resolvers/mutations/login";
import { User } from "src/models";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserResponse } from "src/generated";
 
jest.mock("src/models", () => ({
  User: { findOne: jest.fn() },
}));
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
 
describe("login mutation", () => {
  const mockUser = {
    _id: "507f1f77bcf86cd799439012",
    email: "test@example.com",
    password: "hashedPassword123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
 
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });
 
  it("should return error if email is not registered", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
 
    const result = await login!({}, { email: "wrong@example.com", password: "password123" }, {} as any, {} as any);
 
    expect(result.status).toBe(UserResponse.Error);
    expect(result.message).toBe("Email address not registered");
    expect(result.token).toBeUndefined();
    expect(result.user).toBeUndefined();
  });
 
  it("should return error if password is incorrect", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(false);
 
    const result = await login!({}, { email: "test@example.com", password: "wrongpassword" }, {} as any, {} as any);
 
    expect(result.status).toBe(UserResponse.Error);
    expect(result.message).toBe("Incorrect password");
    expect(result.token).toBeUndefined();
    expect(result.user).toBeUndefined();
  });
 
  it("should handle jwt.sign exception and return error", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw new Error("JWT generation error");
    });
 
    const result = await login!({}, { email: "test@example.com", password: "password123" }, {} as any, {} as any);
 
    expect(result.status).toBe(UserResponse.Error);
    expect(result.message).toBe("JWT generation error");
    expect(result.token).toBeUndefined();
    expect(result.user).toBeUndefined();
  });
 
  it("should login successfully and return token + user", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockedToken123");
 
    const result = await login!({}, { email: "test@example.com", password: "password123" }, {} as any, {} as any);
 
    expect(bcryptjs.compare).toHaveBeenCalledWith("password123", mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    expect(result.status).toBe(UserResponse.Success);
    expect(result.message).toBe("Login successful");
    expect(result.token).toBe("mockedToken123");
    expect(result.user?.email).toBe("test@example.com");
  });
 
  it("should return error if JWT secret is not configured", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
 
    const previousSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
 
    const result = await login!({}, { email: "test@example.com", password: "password123" }, {} as any, {} as any);
 
    expect(result.status).toBe(UserResponse.Error);
    expect(result.message).toBe("JWT secret is not configured");
    expect(result.token).toBeUndefined();
    expect(result.user).toBeUndefined();
 
    process.env.JWT_SECRET = previousSecret;
  });
 
  it("should handle general exception and return error", async () => {
    (User.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });
 
    const result = await login!({}, { email: "test@example.com", password: "password123" }, {} as any, {} as any);
 
    expect(result.status).toBe(UserResponse.Error);
    expect(result.message).toBe("Database error");
    expect(result.token).toBeUndefined();
    expect(result.user).toBeUndefined();
  });
  it("should handle non-Error exception and return unknown error", async () => {
    (User.findOne as jest.Mock).mockImplementation(() => {
      throw "string error"; // Error биш exception
    });
  
    const result = await login!({}, { email: "test@example.com", password: "password123" }, {} as any, {} as any);
  
    expect(result.status).toBe(UserResponse.Error);
    expect(result.message).toBe("Unknown error during login"); // else branch
    expect(result.token).toBeUndefined();
    expect(result.user).toBeUndefined();
  });
});