/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSwipeFeed } from "../../../../src/resolvers/queries/user/swipe-feed";
import User from "../../../../src/models/user";
import Dislike from "../../../../src/models/dislike";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";

jest.mock("../../../../src/models/user");
jest.mock("../../../../src/models/dislike");

describe("getSwipeFeed resolver", () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const limit = 10;
  const excludeIds: string[] = [];
  
  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    name: "Test User",
    email: "test@example.com",
    photos: ["photo1.jpg", "photo2.jpg"],
    bio: "Test bio",
    age: 25,
    gender: "male",
    location: "Test Location",
  };

  const mockDislike = {
    _id: new mongoose.Types.ObjectId(),
    sender: new mongoose.Types.ObjectId(userId),
    receiver: new mongoose.Types.ObjectId(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return users for swipe feed", async () => {
    // Mock Dislike.find
    const mockDislikeFind = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockDislike]),
    };
    (Dislike.find as jest.Mock).mockReturnValue(mockDislikeFind);

    // Mock User.aggregate
    (User.aggregate as jest.Mock).mockResolvedValue([mockUser]);

    // Mock User.find
    const mockUserFind = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockUser]),
    };
    (User.find as jest.Mock).mockReturnValue(mockUserFind);

    const result = await getSwipeFeed({}, { userId, limit, excludeIds });

    expect(Dislike.find).toHaveBeenCalledWith({ sender: userId });
    expect(User.aggregate).toHaveBeenCalled();
    expect(User.find).toHaveBeenCalled();
    expect(result).toEqual([mockUser]);
  });

  it("should return empty array when no users found", async () => {
    // Mock Dislike.find
    const mockDislikeFind = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    };
    (Dislike.find as jest.Mock).mockReturnValue(mockDislikeFind);

    // Mock User.aggregate
    (User.aggregate as jest.Mock).mockResolvedValue([]);

    const result = await getSwipeFeed({}, { userId, limit, excludeIds });

    expect(Dislike.find).toHaveBeenCalledWith({ sender: userId });
    expect(User.aggregate).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should handle excludeIds correctly", async () => {
    const validId1 = new mongoose.Types.ObjectId().toString();
    const validId2 = new mongoose.Types.ObjectId().toString();
    const excludeIds = [validId1, validId2];
    const mockAggregatedUser = { _id: new mongoose.Types.ObjectId() };

    // Mock Dislike.find
    const mockDislikeFind = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    };
    (Dislike.find as jest.Mock).mockReturnValue(mockDislikeFind);

    // Mock User.aggregate
    (User.aggregate as jest.Mock).mockResolvedValue([mockAggregatedUser]);

    // Mock User.find
    const mockUserFind = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockUser]),
    };
    (User.find as jest.Mock).mockReturnValue(mockUserFind);

    const result = await getSwipeFeed({}, { userId, limit, excludeIds });

    // Verify the aggregate call with correct excludeIds
    expect(User.aggregate).toHaveBeenCalledWith([
      {
        $match: {
          _id: { 
            $nin: expect.arrayContaining([
              new mongoose.Types.ObjectId(validId1),
              new mongoose.Types.ObjectId(validId2)
            ])
          },
        },
      },
      {
        $sample: { size: limit },
      },
    ]);

    // Verify the find call with correct user ID
    expect(User.find).toHaveBeenCalledWith({
      _id: { $in: [mockAggregatedUser._id] },
    });

    // Verify the result
    expect(result).toEqual([mockUser]);
  });

  it("should handle populated user data correctly", async () => {
    const populatedUser = {
      ...mockUser,
      profile: {
        bio: "Test bio",
        photos: ["photo1.jpg"],
        location: "Test Location",
      },
    };

    // Mock Dislike.find
    const mockDislikeFind = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    };
    (Dislike.find as jest.Mock).mockReturnValue(mockDislikeFind);

    // Mock User.aggregate
    (User.aggregate as jest.Mock).mockResolvedValue([mockUser]);

    // Mock User.find
    const mockUserFind = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([populatedUser]),
    };
    (User.find as jest.Mock).mockReturnValue(mockUserFind);

    const result = await getSwipeFeed({}, { userId, limit, excludeIds });

    expect(User.find).toHaveBeenCalledWith({
      _id: { $in: [mockUser._id] },
    });

    expect(result).toEqual([populatedUser]);
  });

  it("should throw error if aggregate operation fails", async () => {
    const error = new Error("Aggregate failed");
    
    // Mock Dislike.find
    const mockDislikeFind = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    };
    (Dislike.find as jest.Mock).mockReturnValue(mockDislikeFind);

    // Mock User.aggregate to fail
    (User.aggregate as jest.Mock).mockRejectedValue(error);

    await expect(getSwipeFeed({}, { userId, limit, excludeIds }))
      .rejects.toThrow(new GraphQLError('Алдаа гарлаа', {
        extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error },
      }));
  });

  it("should throw error if find operation fails", async () => {
    const error = new Error("Find failed");
    
    // Mock Dislike.find
    const mockDislikeFind = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    };
    (Dislike.find as jest.Mock).mockReturnValue(mockDislikeFind);

    // Mock User.aggregate
    (User.aggregate as jest.Mock).mockResolvedValue([mockUser]);

    // Mock User.find to fail
    const mockUserFind = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockRejectedValue(error),
    };
    (User.find as jest.Mock).mockReturnValue(mockUserFind);

    await expect(getSwipeFeed({}, { userId, limit, excludeIds }))
      .rejects.toThrow(new GraphQLError('Алдаа гарлаа', {
        extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error },
      }));
  });

  it("should throw error if dislike find operation fails", async () => {
    const error = new Error("Dislike find failed");
    
    // Mock Dislike.find to fail
    const mockDislikeFind = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockRejectedValue(error),
    };
    (Dislike.find as jest.Mock).mockReturnValue(mockDislikeFind);

    await expect(getSwipeFeed({}, { userId, limit, excludeIds }))
      .rejects.toThrow(new GraphQLError('Алдаа гарлаа', {
        extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error },
      }));
  });

  it("should handle invalid ObjectId in excludeIds", async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    const excludeIds = [validId, 'invalid-id'];
    const mockAggregatedUser = { _id: new mongoose.Types.ObjectId() };

    // Mock Dislike.find
    const mockDislikeFind = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    };
    (Dislike.find as jest.Mock).mockReturnValue(mockDislikeFind);

    // Mock User.aggregate
    (User.aggregate as jest.Mock).mockResolvedValue([mockAggregatedUser]);

    // Mock User.find
    const mockUserFind = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockUser]),
    };
    (User.find as jest.Mock).mockReturnValue(mockUserFind);

    const result = await getSwipeFeed({}, { userId, limit, excludeIds });

    // Verify the aggregate call with correct excludeIds
    expect(User.aggregate).toHaveBeenCalledWith([
      {
        $match: {
          _id: { 
            $nin: expect.arrayContaining([
              new mongoose.Types.ObjectId(validId)
            ])
          },
        },
      },
      {
        $sample: { size: limit },
      },
    ]);

    // Verify the find call with correct user ID
    expect(User.find).toHaveBeenCalledWith({
      _id: { $in: [mockAggregatedUser._id] },
    });

    // Verify the result
    expect(result).toEqual([mockUser]);
  });
}); 