import { GraphQLError } from "graphql";
import { Types } from "mongoose";
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

describe("messages Query - Error Handling Edge Cases", () => {
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

  describe("Error Handling Edge Cases", () => {
    it("should preserve GraphQLError when re-throwing", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(
          new GraphQLError("Custom error", { extensions: { code: "CUSTOM_ERROR" } })
        ),
      };
      (Message.find as jest.Mock).mockReturnValue(mockChain);

      await expect(
        getMessages({}, {}, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Custom error", { extensions: { code: "CUSTOM_ERROR" } })
      );
    });

    it("should handle unexpected error types", async () => {
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue("String error"),
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

    it("should handle unexpected error in main getMessages resolver", async () => {
      // Mock Types.ObjectId.isValid to throw an unexpected error
      const originalIsValid = Types.ObjectId.isValid;
      Types.ObjectId.isValid = jest.fn().mockImplementation(() => {
        throw new Error("Unexpected validation error");
      });

      await expect(
        getMessages({}, { senderId: "507f1f77bcf86cd799439012" }, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Failed to fetch messages", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      );

      expect(console.error).toHaveBeenCalledWith("Unexpected error in getMessages:", expect.any(Error));
      Types.ObjectId.isValid = originalIsValid;
    });

    it("should handle unexpected error in main getMessage resolver", async () => {
      // Mock Types.ObjectId.isValid to throw an unexpected error
      const originalIsValid = Types.ObjectId.isValid;
      Types.ObjectId.isValid = jest.fn().mockImplementation(() => {
        throw new Error("Unexpected validation error");
      });

      await expect(
        getMessage({}, { id: "507f1f77bcf86cd799439014" }, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Failed to fetch messages", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        })
      );

      expect(console.error).toHaveBeenCalledWith("Unexpected error in getMessage:", expect.any(Error));
      Types.ObjectId.isValid = originalIsValid;
    });
  });
}); 