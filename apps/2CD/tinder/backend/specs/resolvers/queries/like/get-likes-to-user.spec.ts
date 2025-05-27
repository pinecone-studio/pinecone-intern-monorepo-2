import Like from "src/models/like";
import { getLikesToUser } from "src/resolvers/queries/like/get-likes-to-user";

jest.mock("src/models/like");

describe("getLikesToUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return likes received by a user, with populated from/to, sorted by createdAt descending", async () => {
    const mockUserId = "user123";
    const mockLikes = [
      {
        from: { _id: "user456", username: "Bob" },
        to: { _id: "user123", username: "Alice" },
        createdAt: new Date("2023-01-01"),
      },
    ];

    const sortMock = jest.fn().mockResolvedValue(mockLikes);
    const populateToMock = jest.fn().mockReturnValue({ sort: sortMock });
    const populateFromMock = jest.fn().mockReturnValue({ populate: populateToMock });
    (Like.find as jest.Mock).mockReturnValue({ populate: populateFromMock });

    const result = await getLikesToUser({}, { userId: mockUserId });

    expect(Like.find).toHaveBeenCalledWith({ to: mockUserId });
    expect(populateFromMock).toHaveBeenCalledWith("from");
    expect(populateToMock).toHaveBeenCalledWith("to");
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual(mockLikes);
  });
});
