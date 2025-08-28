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

describe("getMessages Query - Basic Success Tests", () => {
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

  describe("Basic Functionality", () => {
    it("should fetch all messages without filters", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockMessage])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages({}, {}, mockContext, mockInfo);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockMessage._id.toString());
      expect(result[0].content).toBe("Hello World");
      expect(result[0].sender.email).toBe("sender@example.com");
      expect(result[0].receiver.email).toBe("receiver@example.com");
      expect(Message.find).toHaveBeenCalledWith({});
      expect(mockChain.populate).toHaveBeenCalledWith('sender', 'email password createdAt updatedAt');
      expect(mockChain.populate).toHaveBeenCalledWith('receiver', 'email password createdAt updatedAt');
      expect(mockChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockChain.exec).toHaveBeenCalled();
    });

    it("should handle empty result set", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages({}, {}, mockContext, mockInfo);

      expect(result).toHaveLength(0);
    });

    it("should handle multiple messages", async () => {
      const secondMessage = {
        _id: new Types.ObjectId("507f1f77bcf86cd799439015"),
        sender: mockSender,
        receiver: mockReceiver,
        content: "Second message",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        toObject: () => ({
          _id: new Types.ObjectId("507f1f77bcf86cd799439015"),
          sender: mockSender,
          receiver: mockReceiver,
          content: "Second message",
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
        }),
      };

      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockMessage, secondMessage])
      };
      
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getMessages({}, {}, mockContext, mockInfo);

      expect(result).toHaveLength(2);
      expect(result[0].content).toBe("Hello World");
      expect(result[1].content).toBe("Second message");
    });

    
  });
});