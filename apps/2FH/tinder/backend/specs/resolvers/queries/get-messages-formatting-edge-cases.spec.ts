import { Types } from "mongoose";
import { getMessages } from "../../../src/resolvers/queries/get-messages.resolvers";
import { Message } from "../../../src/models";
import mongoose from "mongoose";
import { closeServer } from "../../../src/server";

jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  connect: jest.fn().mockResolvedValue(undefined),
  connection: {
    readyState: 1,
    close: jest.fn().mockResolvedValue(undefined),
  },
  disconnect: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../../src/models", () => ({
  Message: {
    find: jest.fn(),
    findById: jest.fn(),
  },
  User: {
    findById: jest.fn(),
  },
}));

jest.mock("../../../src/server", () => ({
  closeServer: jest.fn(),
  userSockets: new Map(),
  io: undefined,
  httpServer: undefined,
}));

const mockContext = {};
const mockInfo = {};

describe("getMessages Query - Formatting Edge Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {
      // Mock console.error to prevent output during tests
      return;
    });
  });

  afterAll(async () => {
    await closeServer();
    await mongoose.disconnect();
  });

  describe("Formatting Edge Cases", () => {
    it("should handle message without toObject method", async () => {
      const messageWithoutToObject = {
        _id: new Types.ObjectId("507f1f77bcf86cd799439018"),
        sender: {
          _id: new Types.ObjectId("507f1f77bcf86cd799439012"),
          email: "sender@example.com",
          password: "hashedpassword",
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        receiver: {
          _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
          email: "receiver@example.com",
          password: "hashedpassword",
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        content: "Test message",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        // No toObject method
      };

      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([messageWithoutToObject])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages({}, {}, mockContext, mockInfo);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(messageWithoutToObject._id.toString());
      expect(result[0].content).toBe("Test message");
    });

    it("should handle message with null user to trigger fallback", async () => {
      const messageWithNullUser = {
        _id: new Types.ObjectId("507f1f77bcf86cd799439019"),
        sender: null, // This should trigger the || operator in formatUser
        receiver: {
          _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
          email: "receiver@example.com",
          password: "hashedpassword",
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        content: "Test message with null sender",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        toObject: () => ({
          _id: new Types.ObjectId("507f1f77bcf86cd799439019"),
          sender: null,
          receiver: {
            _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
            email: "receiver@example.com",
            password: "hashedpassword",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
          },
          content: "Test message with null sender",
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
        }),
      };

      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([messageWithNullUser])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages({}, {}, mockContext, mockInfo);

      expect(result).toHaveLength(1);
      expect(result[0].sender.email).toBe("");
      expect(result[0].sender.password).toBe("");
      expect(result[0].receiver.email).toBe("receiver@example.com");
      expect(result[0].content).toBe("Test message with null sender");
    });
  });
}); 