/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLError } from "graphql";
import User from "../../../../src/models/user";
import { Profile } from "../../../../src/models/profile";
import Match from "../../../../src/models/match";
import Like from "../../../../src/models/like";
import Message from "../../../../src/models/message";
import { getAllUsers } from "../../../../src/resolvers/queries/user/get-all-users";
import mongoose from "mongoose";

jest.mock('../../../../src/models/user');
jest.mock('../../../../src/models/profile');
jest.mock('../../../../src/models/match');
jest.mock('../../../../src/models/like');
jest.mock('../../../../src/models/message');

describe("getAllUsers Query", () => {
  const mockUserId = new mongoose.Types.ObjectId();
  const mockUser = {
    _id: mockUserId,
    name: "Test User",
    email: "test@example.com",
    toObject: () => ({
      _id: mockUserId,
      name: "Test User",
      email: "test@example.com",
    }),
  };

  const mockProfile = {
    _id: new mongoose.Types.ObjectId(),
    userId: mockUserId,
    bio: "Test bio",
    age: 25,
  };

  const mockMatch = {
    _id: new mongoose.Types.ObjectId(),
    users: [mockUser],
  };

  const mockLikeFrom = {
    _id: new mongoose.Types.ObjectId(),
    sender: mockUserId,
    receiver: new mongoose.Types.ObjectId(),
  };

  const mockLikeTo = {
    _id: new mongoose.Types.ObjectId(),
    sender: new mongoose.Types.ObjectId(),
    receiver: mockUserId,
  };

  const mockMessage = {
    _id: new mongoose.Types.ObjectId(),
    sender: mockUserId,
    content: "Test message",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all users with related information", async () => {
    // Mock User.find
    (User.find as jest.Mock).mockResolvedValue([mockUser]);

    // Mock Profile.find
    (Profile.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([mockProfile]),
    });

    // Mock Match.find
    (Match.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockMatch]),
    });

    // Mock Like.find for likesFrom
    (Like.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockLikeFrom]),
    });

    // Mock Like.find for likesTo
    (Like.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockLikeTo]),
    });

    // Mock Message.find
    (Message.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockMessage]),
    });

    const result = await getAllUsers();

    expect(result).toEqual([
      {
        ...mockUser.toObject(),
        profile: mockProfile,
        matches: [mockMatch],
        likesFrom: [mockLikeFrom],
        likesTo: [mockLikeTo],
        messages: [mockMessage],
      },
    ]);
  });

  it("should throw error if no users found", async () => {
    // Mock User.find to return empty array
    (User.find as jest.Mock).mockResolvedValue([]);

    await expect(getAllUsers())
      .rejects.toThrow(new GraphQLError("Хэрэглэгчид олдсонгүй", {
        extensions: { code: "NOT_FOUND" },
      }));
  });

  it("should throw error if database operation fails", async () => {
    const error = new Error("Database error");
    
    // Mock User.find to throw error
    (User.find as jest.Mock).mockRejectedValue(error);

    await expect(getAllUsers())
      .rejects.toThrow(new GraphQLError("Алдаа гарлаа", {
        extensions: { code: "INTERNAL_SERVER_ERROR", originalError: error },
      }));
  });

  it("should handle empty related data", async () => {
    // Mock User.find
    (User.find as jest.Mock).mockResolvedValue([mockUser]);

    // Mock Profile.find
    (Profile.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([]),
    });

    // Mock Match.find
    (Match.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });

    // Mock Like.find for likesFrom
    (Like.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });

    // Mock Like.find for likesTo
    (Like.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });

    // Mock Message.find
    (Message.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });

    const result = await getAllUsers();

    expect(result).toEqual([
      {
        ...mockUser.toObject(),
        profile: null,
        matches: [],
        likesFrom: [],
        likesTo: [],
        messages: [],
      },
    ]);
  });

  it("should handle multiple users with different related data", async () => {
    const mockUser2Id = new mongoose.Types.ObjectId();
    const mockUser2 = {
      _id: mockUser2Id,
      name: "Test User 2",
      email: "test2@example.com",
      toObject: () => ({
        _id: mockUser2Id,
        name: "Test User 2",
        email: "test2@example.com",
      }),
    };

    // Mock User.find
    (User.find as jest.Mock).mockResolvedValue([mockUser, mockUser2]);

    // Mock Profile.find
    (Profile.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([mockProfile]),
    });

    // Mock Match.find
    (Match.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockMatch]),
    });

    // Mock Like.find for likesFrom
    (Like.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockLikeFrom]),
    });

    // Mock Like.find for likesTo
    (Like.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockLikeTo]),
    });

    // Mock Message.find
    (Message.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockMessage]),
    });

    const result = await getAllUsers();

    expect(result).toEqual([
      {
        ...mockUser.toObject(),
        profile: mockProfile,
        matches: [mockMatch],
        likesFrom: [mockLikeFrom],
        likesTo: [mockLikeTo],
        messages: [mockMessage],
      },
      {
        ...mockUser2.toObject(),
        profile: null,
        matches: [],
        likesFrom: [],
        likesTo: [],
        messages: [],
      },
    ]);
  });
});
