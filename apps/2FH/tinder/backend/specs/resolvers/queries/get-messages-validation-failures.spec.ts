import { GraphQLError } from "graphql";
import { getMessages, getMessage } from "../../../src/resolvers/queries/get-messages.resolvers";
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

jest.mock("../../../src/server", () => ({
  closeServer: jest.fn().mockResolvedValue(undefined),
}));

describe("getMessages Query - Validation Failures", () => {
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

  describe("getMessages - Validation Failures", () => {
    it("should throw error for invalid senderId", async () => {
      await expect(
        getMessages({}, { senderId: "invalid-id" }, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Invalid userId format", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      );
    });

    it("should throw error for invalid receiverId", async () => {
      await expect(
        getMessages({}, { receiverId: "invalid-id" }, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Invalid userId format", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      );
    });

    it("should throw error for both invalid senderId and receiverId", async () => {
      await expect(
        getMessages({}, { senderId: "invalid-sender", receiverId: "invalid-receiver" }, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Invalid userId format", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      );
    });
  });

  describe("getMessage - Validation Failures", () => {
    it("should throw error for invalid message ID", async () => {
      await expect(
        getMessage({}, { id: "invalid-id" }, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Invalid ID format", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      );
    });

    it("should throw error for empty message ID", async () => {
      await expect(
        getMessage({}, { id: "" }, mockContext, mockInfo)
      ).rejects.toThrow(
        new GraphQLError("Invalid ID format", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      );
    });
  });
}); 