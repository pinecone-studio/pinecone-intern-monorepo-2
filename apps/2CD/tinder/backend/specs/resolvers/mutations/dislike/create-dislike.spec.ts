import { GraphQLError } from "graphql";
import { createDislike } from "../../../../src/resolvers/mutations/dislike/create-dislike";
import User from "../../../../src/models/user";
import Dislike from "../../../../src/models/dislike";

jest.mock("../../../../src/models/user");
jest.mock("../../../../src/models/dislike");

describe("createDislike", () => {
  const sender = "senderId";
  const receiver = "receiverId";
  const mockSender = { _id: sender };
  const mockReceiver = { _id: receiver };
  const mockDislike = { _id: "dislikeId", sender, receiver };

  beforeEach(() => {
    jest.clearAllMocks();
    (User.findById as jest.Mock).mockImplementation((id) => {
      if (id === sender) return Promise.resolve(mockSender);
      if (id === receiver) return Promise.resolve(mockReceiver);
      return Promise.resolve(null);
    });
  });

  it("should create a new dislike successfully", async () => {
    (Dislike.findOne as jest.Mock).mockResolvedValueOnce(null);
    (Dislike.create as jest.Mock).mockResolvedValueOnce(mockDislike);

    const result = await createDislike({}, { sender, receiver });

    expect(result).toEqual(mockDislike);
    expect(Dislike.create).toHaveBeenCalledWith({ sender, receiver });
  });

  it("should throw error if dislike already exists", async () => {
    (Dislike.findOne as jest.Mock).mockResolvedValueOnce({ _id: "existingDislikeId" });

    await expect(createDislike({}, { sender, receiver }))
      .rejects.toThrow("Dislike дарсан байна");
    expect(Dislike.create).not.toHaveBeenCalled();
  });

  it("should throw error if user not found", async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(createDislike({}, { sender, receiver }))
      .rejects.toThrow("Хэрэглэгч олдсонгүй");
  });

  it("should throw error if database operation fails", async () => {
    const dbError = new Error("Database error");
    (User.findById as jest.Mock).mockRejectedValueOnce(dbError);

    await expect(createDislike({}, { sender, receiver }))
      .rejects.toThrow(
        new GraphQLError("Алдаа гарлаа", {
          extensions: { code: "INTERNAL_SERVER_ERROR", originalError: dbError },
        })
      );
  });
}); 