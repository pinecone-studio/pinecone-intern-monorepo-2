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

describe("getMessages Query - Falsy Values Tests", () => {
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

  describe("Falsy Values Handling", () => {
    it("should handle falsy values in user fields", async () => {
      const messageWithFalsyValues = {
        _id: new Types.ObjectId("507f1f77bcf86cd799439016"),
        sender: {
          _id: new Types.ObjectId("507f1f77bcf86cd799439012"),
          email: null,
          password: null,
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        receiver: {
          _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
          email: null,
          password: null,
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        content: null,
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        toObject: () => ({
          _id: new Types.ObjectId("507f1f77bcf86cd799439016"),
          sender: {
            _id: new Types.ObjectId("507f1f77bcf86cd799439012"),
            email: null,
            password: null,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
          },
          receiver: {
            _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
            email: null,
            password: null,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
          },
          content: null,
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
        }),
      };
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([messageWithFalsyValues])
      };
      (Message.find as jest.Mock).mockReturnValue(mockChain);
      const result = await getMessages({}, {}, mockContext, mockInfo);
      expect(result).toHaveLength(1);
      expect(result[0].sender.email).toBe("");
      expect(result[0].sender.password).toBe("");
      expect(result[0].receiver.email).toBe("");
      expect(result[0].receiver.password).toBe("");
      expect(result[0].content).toBe("");
    });

    it("should handle undefined values in user fields", async () => {
      const messageWithUndefinedValues = {
        _id: new Types.ObjectId("507f1f77bcf86cd799439017"),
        sender: {
          _id: new Types.ObjectId("507f1f77bcf86cd799439012"),
          email: undefined,
          password: undefined,
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        receiver: {
          _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
          email: undefined,
          password: undefined,
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        content: undefined,
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        toObject: () => ({
          _id: new Types.ObjectId("507f1f77bcf86cd799439017"),
          sender: {
            _id: new Types.ObjectId("507f1f77bcf86cd799439012"),
            email: undefined,
            password: undefined,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
          },
          receiver: {
            _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
            email: undefined,
            password: undefined,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
          },
          content: undefined,
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
        }),
      };
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([messageWithUndefinedValues])
      };
      (Message.find as jest.Mock).mockReturnValue(mockChain);
      const result = await getMessages({}, {}, mockContext, mockInfo);
      expect(result).toHaveLength(1);
      expect(result[0].sender.email).toBe("");
      expect(result[0].sender.password).toBe("");
      expect(result[0].receiver.email).toBe("");
      expect(result[0].receiver.password).toBe("");
      expect(result[0].content).toBe("");
    });
  });
}); 