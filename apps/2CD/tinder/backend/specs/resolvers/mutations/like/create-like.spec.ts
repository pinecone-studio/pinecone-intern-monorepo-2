import { GraphQLError } from "graphql";
import Like from "../../../../src/models/like";
import User from "../../../../src/models/user";
import Match from "../../../../src/models/match";
import Message from "../../../../src/models/message";
import { createLike } from "../../../../src/resolvers/mutations/like/create-like";

jest.mock("../../../../src/models/like");
jest.mock("../../../../src/models/user");
jest.mock("../../../../src/models/match");
jest.mock("../../../../src/models/message");

describe("createLike", () => {
  const sender = "senderId";
  const receiver = "receiverId";
  const mockSender = { _id: sender };
  const mockReceiver = { _id: receiver };
  const mockLike = { _id: "likeId", sender, receiver };
  const mockMatch = { _id: "matchId", users: [sender, receiver] };
  const mockMessage = { _id: "messageId", match: "matchId", sender, content: "It's a match! 👋" };

  beforeEach(() => {
    jest.clearAllMocks();
    (User.findById as jest.Mock).mockImplementation((id) => {
      if (id === sender) return Promise.resolve(mockSender);
      if (id === receiver) return Promise.resolve(mockReceiver);
      return Promise.resolve(null);
    });
  });

  it("should create a like and a match if mutual like exists", async () => {
    (Like.findOne as jest.Mock).mockResolvedValueOnce(null);
    (Like.create as jest.Mock).mockResolvedValueOnce(mockLike);
    (Like.findById as jest.Mock).mockResolvedValueOnce(mockLike);
    (Like.findOne as jest.Mock).mockResolvedValueOnce({ _id: "mutualLikeId" });
    (Match.create as jest.Mock).mockResolvedValueOnce(mockMatch);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    (Message.create as jest.Mock).mockResolvedValueOnce(mockMessage);

    const result = await createLike({}, { sender, receiver });

    expect(result).toEqual(mockLike);
    expect(Like.create).toHaveBeenCalledWith({ sender, receiver });
    expect(Match.create).toHaveBeenCalledWith({ users: [sender, receiver] });
    expect(Message.create).toHaveBeenCalledWith({
      match: mockMatch._id,
      sender,
      content: "It's a match! 👋",
    });
  });

  it("should throw error if like already exists", async () => {
    (Like.findOne as jest.Mock).mockResolvedValueOnce({ _id: "existingLikeId" });

    await expect(createLike({}, { sender, receiver })).rejects.toThrow(
      new GraphQLError("Like дарсан байна", {
        extensions: { code: "BAD_REQUEST" },
      })
    );
    expect(Like.create).not.toHaveBeenCalled();
    expect(Match.create).not.toHaveBeenCalled();
    expect(Message.create).not.toHaveBeenCalled();
  });

  it("should create a like without match if mutual like does not exist", async () => {
    (Like.findOne as jest.Mock).mockResolvedValueOnce(null);
    (Like.create as jest.Mock).mockResolvedValueOnce(mockLike);
    (Like.findById as jest.Mock).mockResolvedValueOnce(mockLike);
    (Like.findOne as jest.Mock).mockResolvedValueOnce(null);

    const result = await createLike({}, { sender, receiver });

    expect(result).toEqual(mockLike);
    expect(Like.create).toHaveBeenCalledWith({ sender, receiver });
    expect(Match.create).not.toHaveBeenCalled();
    expect(Message.create).not.toHaveBeenCalled();
  });

  it("should throw error if user not found", async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(createLike({}, { sender, receiver })).rejects.toThrow("Хэрэглэгч олдсонгүй");
  });

  it("should throw error if database operation fails", async () => {
    const dbError = new Error("Database error");
    (User.findById as jest.Mock).mockRejectedValueOnce(dbError);

    await expect(createLike({}, { sender, receiver })).rejects.toThrow(
      new GraphQLError("Алдаа гарлаа", {
        extensions: { code: "INTERNAL_SERVER_ERROR", originalError: dbError },
      })
    );
  });
});


