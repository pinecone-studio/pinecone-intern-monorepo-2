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

describe("getMessages Query - Filtering Tests", () => {
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

  describe("Filter Tests", () => {
    it("should fetch messages filtered by senderId", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockMessage])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages({}, { senderId: "507f1f77bcf86cd799439012" }, mockContext, mockInfo);

      expect(result).toHaveLength(1);
      expect(Message.find).toHaveBeenCalledWith({ sender: new Types.ObjectId("507f1f77bcf86cd799439012") });
    });

    it("should fetch messages filtered by receiverId", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockMessage])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages({}, { receiverId: "507f1f77bcf86cd799439013" }, mockContext, mockInfo);

      expect(result).toHaveLength(1);
      expect(Message.find).toHaveBeenCalledWith({ receiver: new Types.ObjectId("507f1f77bcf86cd799439013") });
    });

    it("should fetch messages filtered by both senderId and receiverId", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockMessage])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages(
        {},
        { senderId: "507f1f77bcf86cd799439012", receiverId: "507f1f77bcf86cd799439013" },
        mockContext,
        mockInfo
      );

      expect(result).toHaveLength(1);
      expect(Message.find).toHaveBeenCalledWith({
        sender: new Types.ObjectId("507f1f77bcf86cd799439012"),
        receiver: new Types.ObjectId("507f1f77bcf86cd799439013"),
      });
    });

    it("should fetch messages with undefined filters", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockMessage])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages({}, { senderId: undefined, receiverId: undefined }, mockContext, mockInfo);

      expect(result).toHaveLength(1);
      expect(Message.find).toHaveBeenCalledWith({});
    });
  });
});