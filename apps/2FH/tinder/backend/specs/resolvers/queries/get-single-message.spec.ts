import { Types } from "mongoose";
import { getMessage } from "../../../src/resolvers/queries/get-messages.resolvers";
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

const mockMessage = {
  _id: new Types.ObjectId("507f1f77bcf86cd799439014"),
  sender: mockSender,
  receiver: mockReceiver,
  content: "Hello World",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  toObject: () => ({
    _id: new Types.ObjectId("507f1f77bcf86cd799439014"),
    sender: mockSender,
    receiver: mockReceiver,
    content: "Hello World",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
  }),
};

describe("getMessage Query - Single Message Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {
      // Mock console.error to prevent output during tests
    });
  });

  afterAll(async () => {
    await closeServer();
    await mongoose.disconnect();
  });

  describe("Single Message Success", () => {
    it("should fetch message by ID", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockMessage)
      };
      
      (Message.findById as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessage({}, { id: "507f1f77bcf86cd799439014" }, mockContext, mockInfo);

      expect(result.id).toBe(mockMessage._id.toString());
      expect(result.content).toBe("Hello World");
      expect(result.sender.email).toBe("sender@example.com");
      expect(result.receiver.email).toBe("receiver@example.com");
      expect(Message.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439014");
      expect(mockChain.populate).toHaveBeenCalledWith('sender', 'email password createdAt updatedAt');
      expect(mockChain.populate).toHaveBeenCalledWith('receiver', 'email password createdAt updatedAt');
      expect(mockChain.exec).toHaveBeenCalled();
    });

    it("should handle null user properties in single message", async () => {
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
        exec: jest.fn().mockResolvedValue(messageWithNullProps)
      };
      
      (Message.findById as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessage({}, { id: "507f1f77bcf86cd799439014" }, mockContext, mockInfo);

      expect(result.sender.email).toBe("");
      expect(result.sender.password).toBe("");
      expect(result.content).toBe("");
      expect(result.sender.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(result.receiver.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

  });
});