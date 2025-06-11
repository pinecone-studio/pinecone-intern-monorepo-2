import { GraphQLError } from 'graphql';
import { createDislike } from "../../../../src/resolvers/mutations/dislike/create-dislike";
import Dislike from "../../../../src/models/dislike";
import User from "../../../../src/models/user";

jest.mock("../../../../src/models/dislike");
jest.mock("../../../../src/models/user");

describe("createDislike Query", () => {
  const senderId = "507f1f77bcf86cd799439011";
  const receiverId = "507f1f77bcf86cd799439012";

  const mockUser = {
    _id: senderId,
    name: "Test User",
    email: "test@example.com",
  };

  const mockDislike = {
    _id: "507f1f77bcf86cd799439013",
    sender: senderId,
    receiver: receiverId,
    createdAt: new Date("2025-06-09T17:09:29.201Z"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new dislike successfully", async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (Dislike.findOne as jest.Mock).mockResolvedValueOnce(null);
    (Dislike.create as jest.Mock).mockResolvedValueOnce(mockDislike);

    const result = await createDislike({}, { sender: senderId, receiver: receiverId });

    expect(result).toEqual(mockDislike);
    expect(User.findById).toHaveBeenCalledWith(senderId);
    expect(Dislike.findOne).toHaveBeenCalledWith({ sender: senderId, receiver: receiverId });
    expect(Dislike.create).toHaveBeenCalledWith({ sender: senderId, receiver: receiverId });
  });

  it("should throw error if user not found", async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(createDislike({}, { sender: senderId, receiver: receiverId }))
      .rejects.toThrow(new GraphQLError("Хэрэглэгч олдсонгүй", {
        extensions: { code: "NOT_FOUND" },
      }));
  });

  it("should throw error if dislike already exists", async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (Dislike.findOne as jest.Mock).mockResolvedValueOnce(mockDislike);

    await expect(createDislike({}, { sender: senderId, receiver: receiverId }))
      .rejects.toThrow(new GraphQLError("Dislike дарсан байна", {
        extensions: { code: "BAD_REQUEST" },
      }));
  });

  it("should throw error if database operation fails", async () => {
    const dbError = new Error("Database error");
    (User.findById as jest.Mock).mockRejectedValueOnce(dbError);

    await expect(createDislike({}, { sender: senderId, receiver: receiverId }))
      .rejects.toThrow(new GraphQLError("Алдаа гарлаа", {
        extensions: { code: "INTERNAL_SERVER_ERROR", originalError: dbError },
      }));
  });
}); 