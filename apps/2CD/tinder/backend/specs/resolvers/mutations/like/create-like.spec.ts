import Like from "src/models/like";
import Match from "src/models/match";
import { createLike } from "src/resolvers/mutations/like/create-like";

jest.mock("src/models/like");
jest.mock("src/models/match");

describe("createLike", () => {
  const from = "user1";
  const to = "user2";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a like and a match if mutual like exists", async () => {
    (Like.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // No existing like (from → to)
      .mockResolvedValueOnce({}); // Mutual like exists (to → from)

    const mockLike = {
      populate: jest.fn().mockReturnThis(),
    };

    (Like.create as jest.Mock).mockResolvedValue(mockLike);
    (Match.create as jest.Mock).mockResolvedValue({});

    const result = await createLike({}, { from, to });

    expect(Like.findOne).toHaveBeenNthCalledWith(1, { from, to });
    expect(Like.create).toHaveBeenCalledWith(expect.objectContaining({ from, to }));
    expect(Like.findOne).toHaveBeenNthCalledWith(2, { from: to, to: from });
    expect(Match.create).toHaveBeenCalledWith({ users: [from, to] });
    expect(mockLike.populate).toHaveBeenCalledWith("from");
    expect(mockLike.populate).toHaveBeenCalledWith("to");
    expect(result).toBe(mockLike);
  });

  it("should throw an error if like already exists", async () => {
    (Like.findOne as jest.Mock).mockResolvedValueOnce({}); // existing like found

    await expect(createLike({}, { from, to })).rejects.toThrow("Failed to create like");
    expect(Like.create).not.toHaveBeenCalled();
    expect(Match.create).not.toHaveBeenCalled();
  });

  it("should create a like without match if mutual like does not exist", async () => {
    (Like.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // no existing like
      .mockResolvedValueOnce(null); // no mutual like

    const mockLike = {
      populate: jest.fn().mockReturnThis(),
    };

    (Like.create as jest.Mock).mockResolvedValue(mockLike);

    const result = await createLike({}, { from, to });

    expect(Match.create).not.toHaveBeenCalled();
    expect(result).toBe(mockLike);
  });
});
