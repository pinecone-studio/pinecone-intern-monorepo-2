import { GraphQLError } from "graphql";
import { getMessages, getMessage } from "../../../src/resolvers/queries/get-messages.resolvers";
import { Message } from "../../../src/models";
import mongoose from "mongoose";
import { closeServer } from "../../../src/server";

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
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock("../../../src/server", () => ({
  closeServer: jest.fn().mockResolvedValue(undefined),
}));

describe("getMessages Query - Database Failures", () => {
  const mockContext = {};
  const mockInfo = {} as any;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, "log").mockImplementation(() => {
      // Mock console.log to prevent output during tests
      return;
    });
    jest.spyOn(console, "error").mockImplementation(() => {
      // Mock console.error to prevent output during tests
      return;
    });
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.clearAllTimers();
    jest.spyOn(console, "log").mockRestore();
    jest.spyOn(console, "error").mockRestore();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    await closeServer();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("getMessages - Database Failures", () => {
    it("should handle database errors gracefully", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("Database connection failed")),
      };
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      await expect(
        getMessages({}, {}, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Failed to fetch messages", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      );

      expect(console.error).toHaveBeenCalledWith("Unexpected error in getMessages:", expect.any(Error));
    });

    it("should handle populate errors gracefully", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("Population failed")),
      };
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      await expect(
        getMessages({}, {}, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Failed to fetch messages", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      );
    });
  });

  describe("getMessage - Database Failures", () => {
    it("should throw error when message not found", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      (Message.findById as jest.Mock).mockReturnValue(mockChain);

      await expect(
        getMessage({}, { id: "507f1f77bcf86cd799439014" }, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Message not found", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        })
      );
    });

    it("should handle database errors gracefully", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("Database connection failed")),
      };
      (Message.findById as jest.Mock).mockReturnValue(mockChain);

      await expect(
        getMessage({}, { id: "507f1f77bcf86cd799439014" }, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Failed to fetch messages", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      );

      expect(console.error).toHaveBeenCalledWith("Unexpected error in getMessage:", expect.any(Error));
    });

    it("should handle populate errors gracefully", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("Population failed")),
      };
      (Message.findById as jest.Mock).mockReturnValue(mockChain);

      await expect(
        getMessage({}, { id: "507f1f77bcf86cd799439014" }, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Failed to fetch messages", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      );
    });
  });
}); 