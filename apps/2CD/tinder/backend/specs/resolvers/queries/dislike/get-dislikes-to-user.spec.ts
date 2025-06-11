import { getDislikesToUser } from "../../../../src/resolvers/queries/dislike/get-dislikes-to-user";
import User from "../../../../src/models/user";
import Dislike from "../../../../src/models/dislike";
import mongoose from "mongoose";

jest.mock("../../../../src/models/user");
jest.mock("../../../../src/models/dislike");

describe("getDislikesToUser", () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const mockUser = {
    _id: new mongoose.Types.ObjectId(userId),
    name: "Test User",
    email: "test@example.com",
  };

  const mockDislikes = [
    {
      _id: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: mockUser._id,
    },
  ];

  const mockPopulate = jest.fn().mockReturnThis();
  const mockSort = jest.fn().mockReturnThis();
  const mockLean = jest.fn().mockResolvedValue(mockDislikes);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return dislikes to user", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Dislike.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
      sort: mockSort,
      lean: mockLean,
    });

    const result = await getDislikesToUser({}, { userId });

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(Dislike.find).toHaveBeenCalledWith({ receiver: mockUser._id });
    expect(mockPopulate).toHaveBeenCalledWith("sender");
    expect(mockPopulate).toHaveBeenCalledWith("receiver");
    expect(result).toBe(mockDislikes);
  });

  it("should return empty array if no dislikes found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Dislike.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
      sort: mockSort,
      lean: jest.fn().mockResolvedValue([]),
    });

    const result = await getDislikesToUser({}, { userId });

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(Dislike.find).toHaveBeenCalledWith({ receiver: mockUser._id });
    expect(mockPopulate).toHaveBeenCalledWith("sender");
    expect(mockPopulate).toHaveBeenCalledWith("receiver");
    expect(result).toEqual([]);
  });

  it("should throw error if user not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(getDislikesToUser({}, { userId })).rejects.toThrow("Хэрэглэгч олдсонгүй");
  });

  it("should throw error if database operation fails", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Dislike.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
      sort: mockSort,
      lean: jest.fn().mockRejectedValue(new Error("Алдаа гарлаа")),
    });

    await expect(getDislikesToUser({}, { userId })).rejects.toThrow("Алдаа гарлаа");
  });
}); 