/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { me } from "../../../../src/resolvers/queries/user/me";
import User from "../../../../src/models/user";
import { Profile } from "../../../../src/models/profile";
import Match from "../../../../src/models/match";
import Like from "../../../../src/models/like";
import Dislike from "../../../../src/models/dislike";
import Message from "../../../../src/models/message";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";

jest.mock("../../../../src/models/user");
jest.mock("../../../../src/models/profile");
jest.mock("../../../../src/models/match");
jest.mock("../../../../src/models/like");
jest.mock("../../../../src/models/dislike");
jest.mock("../../../../src/models/message");

describe("me resolver success cases", () => {
  const userId = new mongoose.Types.ObjectId();
  const otherUserId = new mongoose.Types.ObjectId();
  const profileId = new mongoose.Types.ObjectId();
  const matchId = new mongoose.Types.ObjectId();
  const likeFromId = new mongoose.Types.ObjectId();
  const likeToId = new mongoose.Types.ObjectId();
  const dislikeFromId = new mongoose.Types.ObjectId();
  const dislikeToId = new mongoose.Types.ObjectId();
  const messageId = new mongoose.Types.ObjectId();

  const mockUser = {
    _id: userId,
    name: "Test User",
    email: "test@example.com",
    toObject: () => ({
      _id: userId,
      name: "Test User",
      email: "test@example.com"
    })
  };

  const mockProfile = {
    _id: profileId,
    userId: userId,
    bio: "Test bio",
    toObject: () => ({
      _id: profileId,
      userId: userId,
      bio: "Test bio"
    })
  };

  const mockMatches = [
    {
      _id: matchId,
      user1Id: userId,
      user2Id: otherUserId,
      toObject: () => ({
        _id: matchId,
        user1Id: userId,
        user2Id: otherUserId
      })
    }
  ];

  const mockLikesFrom = [
    {
      _id: likeFromId,
      fromUserId: userId,
      toUserId: otherUserId,
      toObject: () => ({
        _id: likeFromId,
        fromUserId: userId,
        toUserId: otherUserId
      })
    }
  ];

  const mockLikesTo = [
    {
      _id: likeToId,
      fromUserId: otherUserId,
      toUserId: userId,
      toObject: () => ({
        _id: likeToId,
        fromUserId: otherUserId,
        toUserId: userId
      })
    }
  ];

  const mockDislikesFrom = [
    {
      _id: dislikeFromId,
      fromUserId: userId,
      toUserId: otherUserId,
      toObject: () => ({
        _id: dislikeFromId,
        fromUserId: userId,
        toUserId: otherUserId
      })
    }
  ];

  const mockDislikesTo = [
    {
      _id: dislikeToId,
      fromUserId: otherUserId,
      toUserId: userId,
      toObject: () => ({
        _id: dislikeToId,
        fromUserId: otherUserId,
        toUserId: userId
      })
    }
  ];

  const mockMessages = [
    {
      _id: messageId,
      fromUserId: userId,
      toUserId: otherUserId,
      content: "Test message",
      toObject: () => ({
        _id: messageId,
        fromUserId: userId,
        toUserId: otherUserId,
        content: "Test message"
      })
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Profile.findOne as jest.Mock).mockResolvedValue(mockProfile);
    (Match.find as jest.Mock).mockResolvedValue(mockMatches);
    (Like.find as jest.Mock).mockImplementation((query) => {
      if (query.fromUserId?.toString() === userId.toString()) {
        return mockLikesFrom;
      }
      if (query.toUserId?.toString() === userId.toString()) {
        return mockLikesTo;
      }
      return [];
    });
    (Dislike.find as jest.Mock).mockImplementation((query) => {
      if (query.fromUserId?.toString() === userId.toString()) {
        return mockDislikesFrom;
      }
      if (query.toUserId?.toString() === userId.toString()) {
        return mockDislikesTo;
      }
      return [];
    });
    (Message.find as jest.Mock).mockResolvedValue(mockMessages);
  });

  it("should return the current user with all related data", async () => {
    const result = await me({}, {}, { user: { id: userId.toString() } });

    expect(result).toEqual({
      _id: userId,
      name: "Test User",
      email: "test@example.com",
      profile: {
        _id: profileId,
        userId: userId,
        bio: "Test bio"
      },
      matches: [{
        _id: matchId,
        user1Id: userId,
        user2Id: otherUserId
      }],
      likesFrom: [{
        _id: likeFromId,
        fromUserId: userId,
        toUserId: otherUserId
      }],
      likesTo: [{
        _id: likeToId,
        fromUserId: otherUserId,
        toUserId: userId
      }],
      dislikesFrom: [{
        _id: dislikeFromId,
        fromUserId: userId,
        toUserId: otherUserId
      }],
      dislikesTo: [{
        _id: dislikeToId,
        fromUserId: otherUserId,
        toUserId: userId
      }],
      messages: [{
        _id: messageId,
        fromUserId: userId,
        toUserId: otherUserId,
        content: "Test message"
      }]
    });
  }, 10000);

  it("should handle missing related data gracefully", async () => {
    (Profile.findOne as jest.Mock).mockResolvedValue(null);
    (Match.find as jest.Mock).mockResolvedValue([]);
    (Like.find as jest.Mock).mockResolvedValue([]);
    (Dislike.find as jest.Mock).mockResolvedValue([]);
    (Message.find as jest.Mock).mockResolvedValue([]);

    const result = await me({}, {}, { user: { id: userId.toString() } });

    expect(result).toEqual({
      _id: userId,
      name: "Test User",
      email: "test@example.com",
      profile: null,
      matches: [],
      likesFrom: [],
      likesTo: [],
      dislikesFrom: [],
      dislikesTo: [],
      messages: []
    });
  }, 10000);

  it("should handle GraphQLError in catch block", async () => {
    const error = new GraphQLError("Test error", {
      extensions: { code: "TEST_ERROR" }
    });
    (User.findById as jest.Mock).mockRejectedValue(error);

    await expect(me({}, {}, { user: { id: userId.toString() } }))
      .rejects.toThrow(error);
  }, 10000);

  it("should handle non-GraphQLError in catch block", async () => {
    const error = new Error("Database error");
    (User.findById as jest.Mock).mockRejectedValue(error);

    await expect(me({}, {}, { user: { id: userId.toString() } }))
      .rejects.toThrow(new GraphQLError("Алдаа гарлаа", {
        extensions: { code: "INTERNAL_SERVER_ERROR", originalError: error }
      }));
  }, 10000);

  it("should handle null documents in mapDocumentsToObjects", async () => {
    (Match.find as jest.Mock).mockResolvedValue(null);
    (Like.find as jest.Mock).mockResolvedValue(null);
    (Dislike.find as jest.Mock).mockResolvedValue(null);
    (Message.find as jest.Mock).mockResolvedValue(null);

    const result = await me({}, {}, { user: { id: userId.toString() } });

    expect(result).toEqual({
      _id: userId,
      name: "Test User",
      email: "test@example.com",
      profile: {
        _id: profileId,
        userId: userId,
        bio: "Test bio"
      },
      matches: [],
      likesFrom: [],
      likesTo: [],
      dislikesFrom: [],
      dislikesTo: [],
      messages: []
    });
  }, 10000);
});
