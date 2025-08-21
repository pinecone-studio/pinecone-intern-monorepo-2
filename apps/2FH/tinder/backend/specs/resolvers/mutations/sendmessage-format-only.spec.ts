import { Types } from "mongoose";
import { sendMessage } from "../../../src/resolvers/mutations/sendmessage-mutation";
import { Message, User } from "../../../src/models";
import { closeServer } from "../../../src/server";
import { Server as SocketIOServer, DefaultEventsMap } from "socket.io";
import mongoose from "mongoose";

jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  connect: jest.fn().mockResolvedValue(undefined),
  connection: {
    close: jest.fn().mockResolvedValue(undefined),
  },
  disconnect: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("../../../src/models", () => ({
  Message: {
    create: jest.fn(),
  },
  User: {
    findById: jest.fn(),
  },
}));
jest.mock("../../../src/server", () => {
  const mockIo: Partial<SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>> | undefined = {
    to: jest.fn().mockReturnValue({
      emit: jest.fn(),
    }),
  };
  return {
    io: mockIo,
    closeServer: jest.fn().mockResolvedValue(undefined),
  };
});
jest.mock("../../../src/generated", () => ({
  MutationResolvers: {},
}));

describe("sendMessage Mutation - Data Formatting Failures", () => {
  const mockSender = {
    _id: new Types.ObjectId("507f1f77bcf86cd799439012"),
    email: "sender@example.com",
    password: "hashedPassword123",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  };

  const mockReceiver = {
    _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
    email: "receiver@example.com",
    password: "hashedPassword456",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  };

  const mockInput = {
    senderId: "507f1f77bcf86cd799439012",
    receiverId: "507f1f77bcf86cd799439013",
    content: "Hello, how are you?",
  };

  const mockContext = {};
  const mockInfo = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(Map.prototype, "get").mockReturnValue(undefined);
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
    (User.findById as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce(mockSender)
      .mockResolvedValueOnce(mockReceiver);
    (Message.create as jest.Mock).mockResolvedValue({
      _id: new Types.ObjectId(),
      sender: new Types.ObjectId(mockInput.senderId),
      receiver: new Types.ObjectId(mockInput.receiverId),
      content: mockInput.content,
      createdAt: new Date(),
    });
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.clearAllTimers();
    jest.spyOn(Map.prototype, "get").mockRestore();
    jest.spyOn(console, "log").mockRestore();
    jest.spyOn(console, "error").mockRestore();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    await closeServer();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("Data Formatting Scenarios", () => {
    it("should handle null user properties", async () => {
      const userWithNullProps = {
        _id: new Types.ObjectId(mockInput.senderId),
        email: null,
        password: null,
        createdAt: null,
        updatedAt: null,
      };
      (User.findById as jest.Mock).mockReset().mockResolvedValueOnce(userWithNullProps).mockResolvedValueOnce(mockReceiver);
      const result = await sendMessage!({}, { input: mockInput }, mockContext, mockInfo);
      expect(result.sender!.email).toBe("");
      expect(result.sender!.password).toBe("");
    });

    it("should handle null message content", async () => {
      (Message.create as jest.Mock).mockResolvedValue({
        _id: new Types.ObjectId(),
        sender: new Types.ObjectId(mockInput.senderId),
        receiver: new Types.ObjectId(mockInput.receiverId),
        content: null,
        createdAt: new Date(),
      });
      const result = await sendMessage!({}, { input: mockInput }, mockContext, mockInfo);
      expect(result.content).toBe("");
    });
  });
});