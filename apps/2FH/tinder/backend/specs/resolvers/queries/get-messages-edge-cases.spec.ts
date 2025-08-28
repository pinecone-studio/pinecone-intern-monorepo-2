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

const mockSender = {
  _id: new Types.ObjectId("507f1f77bcf86cd799439012"),
  email: "sender@example.com",
  password: "hashedpassword",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

const mockReceiver = {
  _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
  email: "receiver@example.com",
  password: "hashedpassword",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

describe("getMessages Query - Edge Cases", () => {
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

  describe("Null Property Handling", () => {
    it("should handle null user properties gracefully", async () => {
      const messageWithNullProps = {
        _id: new Types.ObjectId("507f1f77bcf86cd799439014"),
        sender: {
          _id: new Types.ObjectId("507f1f77bcf86cd799439012"),
          email: null,
          password: null,
          createdAt: undefined,
          updatedAt: undefined,
        },
        receiver: {
          _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
          email: null,
          password: null,
          createdAt: undefined,
          updatedAt: undefined,
        },
        content: null,
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        toObject: () => messageWithNullProps,
      };

      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([messageWithNullProps])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages({}, {}, mockContext, mockInfo);

      expect(result).toHaveLength(1);
      expect(result[0].sender.email).toBe("");
      expect(result[0].sender.password).toBe("");
      expect(result[0].content).toBe("");
      expect(result[0].sender.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(result[0].receiver.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("should handle messages with toObject method", async () => {
      const messageWithToObject = {
        _id: new Types.ObjectId("507f1f77bcf86cd799439014"),
        sender: mockSender,
        receiver: mockReceiver,
        content: "Hello with toObject",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        toObject: function() { return this; },
      };

      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([messageWithToObject])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages({}, {}, mockContext, mockInfo);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(messageWithToObject._id.toString());
      expect(result[0].content).toBe("Hello with toObject");
    });

    it("should handle messages without toObject method", async () => {
      const messageWithoutToObject = {
        _id: new Types.ObjectId("507f1f77bcf86cd799439015"),
        sender: mockSender,
        receiver: mockReceiver,
        content: "Hello without toObject method",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
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
      expect(result[0].content).toBe("Hello without toObject method");
    });
  });
});