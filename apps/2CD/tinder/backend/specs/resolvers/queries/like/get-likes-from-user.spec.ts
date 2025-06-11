import { getLikesFromUser } from "../../../../src/resolvers/queries/like/get-likes-from-user";
import User from "../../../../src/models/user";
import Like from "../../../../src/models/like";
import mongoose from "mongoose";

jest.mock("../../../../src/models/user");
jest.mock("../../../../src/models/like");

describe("getLikesFromUser", () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const mockUser = {
    _id: new mongoose.Types.ObjectId(userId),
    name: "Test User",
    email: "test@example.com",
  };

  const mockLikes = [
    {
      _id: new mongoose.Types.ObjectId(),
      sender: mockUser._id,
      receiver: new mongoose.Types.ObjectId(),
    },
  ];

  const mockPopulate = jest.fn().mockReturnThis();
  const mockSort = jest.fn().mockReturnThis();
  const mockLean = jest.fn().mockResolvedValue(mockLikes);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of likes from a user, populated and sorted", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Like.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
      sort: mockSort,
      lean: mockLean,
    });

    const result = await getLikesFromUser({}, { userId });

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(Like.find).toHaveBeenCalledWith({ sender: mockUser._id });
    expect(mockPopulate).toHaveBeenCalledWith("sender");
    expect(mockPopulate).toHaveBeenCalledWith("receiver");
    expect(result).toBe(mockLikes);
  });

  it("should return empty array if no likes found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Like.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
      sort: mockSort,
      lean: jest.fn().mockResolvedValue([]),
    });

    const result = await getLikesFromUser({}, { userId });

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(Like.find).toHaveBeenCalledWith({ sender: mockUser._id });
    expect(mockPopulate).toHaveBeenCalledWith("sender");
    expect(mockPopulate).toHaveBeenCalledWith("receiver");
    expect(result).toEqual([]);
  });

  it("should throw error if user not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(getLikesFromUser({}, { userId })).rejects.toThrow("Хэрэглэгч олдсонгүй");
  });

  it("should throw error if database operation fails", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Like.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
      sort: mockSort,
      lean: jest.fn().mockRejectedValue(new Error("Алдаа гарлаа")),
    });

    await expect(getLikesFromUser({}, { userId })).rejects.toThrow("Алдаа гарлаа");
  });
});
