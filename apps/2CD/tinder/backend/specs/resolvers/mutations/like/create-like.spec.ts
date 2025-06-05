import Like from "src/models/like";
import Match from "src/models/match";
import Message from "src/models/message";
import { createLike } from "src/resolvers/mutations/like/create-like";
import User from "src/models/user";

jest.mock("src/models/like");
jest.mock("src/models/match");
jest.mock("src/models/message");
jest.mock("src/models/user");

describe("createLike", () => {
  const from = "user1";
  const to = "user2";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a like and a match if mutual like exists", async () => {
    (Like.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({});

    const mockLike = {
      populate: jest.fn().mockReturnThis(),
    };
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({}); 
    (Like.create as jest.Mock).mockResolvedValue(mockLike);
    (Match.create as jest.Mock).mockResolvedValue({ _id: 'matchId' });
    (Message.create as jest.Mock).mockResolvedValue({});

    const result = await createLike({}, { from, to });

    expect(Like.findOne).toHaveBeenNthCalledWith(1, { from, to });
    expect(Like.create).toHaveBeenCalledWith(expect.objectContaining({ from, to }));
    expect(Like.findOne).toHaveBeenNthCalledWith(2, { from: to, to: from });
    expect(Match.create).toHaveBeenCalledWith({ users: [from, to] });
    expect(Message.create).toHaveBeenCalledWith({
      match: 'matchId',
      sender: from,
      content: "It's a match!",
    });
    expect(mockLike.populate).toHaveBeenCalledWith("from");
    expect(mockLike.populate).toHaveBeenCalledWith("to");
    expect(result).toBe(mockLike);
  });

  it("should throw an error if like already exists", async () => {
    (Like.findOne as jest.Mock).mockResolvedValueOnce({});

    await expect(createLike({}, { from, to })).rejects.toThrow("Like already exists");
    expect(Like.create).not.toHaveBeenCalled();
    expect(Match.create).not.toHaveBeenCalled();
    expect(Message.create).not.toHaveBeenCalled();
  });

  it("should create a like without match if mutual like does not exist", async () => {
    (Like.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const mockLike = {
      populate: jest.fn().mockReturnThis(),
    };

    (Like.create as jest.Mock).mockResolvedValue(mockLike);

    const result = await createLike({}, { from, to });

    expect(Match.create).not.toHaveBeenCalled();
    expect(Message.create).not.toHaveBeenCalled();
    expect(result).toBe(mockLike);
  });
  it("should catch and throw an error if something goes wrong inside try block", async () => {
  (Like.findOne as jest.Mock).mockResolvedValueOnce(null); 
  (Like.create as jest.Mock).mockImplementation(() => {
    throw new Error("Database error");
  });

  await expect(createLike({}, { from, to })).rejects.toThrow("Failed to create like: ");
});

});


