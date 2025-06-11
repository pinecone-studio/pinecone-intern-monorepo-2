import { getDislikesFromUser } from "../../../../src/resolvers/queries/dislike/get-dislikes-from-user";
import User from "../../../../src/models/user";
import Dislike from "../../../../src/models/dislike";
import mongoose from "mongoose";

jest.mock("../../../../src/models/user");
jest.mock("../../../../src/models/dislike");

describe("getDislikesFromUser", () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const mockUser = {
    _id: new mongoose.Types.ObjectId(userId),
    name: "Test User",
    email: "test@example.com",
  };

  const mockDislikes = [
    {
      _id: new mongoose.Types.ObjectId(),
      sender: mockUser._id,
      receiver: new mongoose.Types.ObjectId(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return dislikes from user", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    const mockPopulate = jest.fn().mockReturnThis();
    (Dislike.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockDislikes),
    });

    const result = await getDislikesFromUser({}, { userId });

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(Dislike.find).toHaveBeenCalledWith({ sender: mockUser._id });
    expect(result).toBe(mockDislikes);
  });

  it("should return empty array if no dislikes found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    const mockPopulate = jest.fn().mockReturnThis();
    (Dislike.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });

    const result = await getDislikesFromUser({}, { userId });

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(Dislike.find).toHaveBeenCalledWith({ sender: mockUser._id });
    expect(result).toEqual([]);
  });

  it("should throw error if user not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(getDislikesFromUser({}, { userId })).rejects.toThrow("Хэрэглэгч олдсонгүй");
  });

  it("should throw error if database operation fails", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    const mockPopulate = jest.fn().mockReturnThis();
    (Dislike.find as jest.Mock).mockReturnValue({
      populate: mockPopulate,
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockRejectedValue(new Error("Error")),
    });

    await expect(getDislikesFromUser({}, { userId })).rejects.toThrow("Алдаа гарлаа");
  });
}); 