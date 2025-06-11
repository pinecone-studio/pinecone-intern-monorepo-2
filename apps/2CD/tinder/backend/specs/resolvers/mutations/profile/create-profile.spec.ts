import { Profile } from "../../../../src/models/profile";
import { createProfile } from "../../../../src/resolvers/mutations/profile/create-profile";
import { Types } from "mongoose";
import { CreateProfileInput } from "../../../../src/types/profile";

jest.mock("../../../../src/models/profile");

describe("createProfile", () => {
  const userId = "507f1f77bcf86cd799439011";
  const mockInput: CreateProfileInput = {
    userId,
    firstName: "Test",
    age: 25,
    gender: "Male",
    lookingFor: "Female",
    bio: "Test Bio",
    interests: ["reading", "gaming"],
    profession: "Engineer",
    education: "Bachelor's",
    images: ["photo1.jpg", "photo2.jpg"],
    isCertified: true,
    location: {
      type: "Point",
      coordinates: [0, 0]
    }
  };

  const mockProfile = {
    _id: new Types.ObjectId("507f1f77bcf86cd799439012"),
    userId: new Types.ObjectId(userId),
    firstName: "Test",
    age: 25,
    gender: "Male",
    lookingFor: "Female",
    bio: "Test Bio",
    interests: ["reading", "gaming"],
    profession: "Engineer",
    education: "Bachelor's",
    images: ["photo1.jpg", "photo2.jpg"],
    isCertified: true,
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    createdAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new profile successfully", async () => {
    (Profile.findOne as jest.Mock).mockResolvedValue(null);
    const mockSave = jest.fn().mockResolvedValue(mockProfile);
    const mockProfileInstance = {
      ...mockProfile,
      save: mockSave
    };
    (Profile as unknown as jest.Mock).mockImplementation(() => mockProfileInstance);

    const result = await createProfile({}, { input: mockInput });

    expect(Profile.findOne).toHaveBeenCalledWith({ userId: new Types.ObjectId(userId) });
    expect(Profile).toHaveBeenCalledWith(mockInput);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toBe(mockProfileInstance);
  });

  it("should throw error if profile already exists", async () => {
    (Profile.findOne as jest.Mock).mockResolvedValue(mockProfile);

    await expect(createProfile({}, { input: mockInput })).rejects.toThrow("Энэ хэрэглэгчийн профайл үүссэн байна");
    expect(Profile).not.toHaveBeenCalled();
  });

  it("should throw error if database operation fails", async () => {
    (Profile.findOne as jest.Mock).mockResolvedValue(null);
    const mockSave = jest.fn().mockRejectedValue(new Error("Database error"));
    const mockProfileInstance = {
      ...mockProfile,
      save: mockSave
    };
    (Profile as unknown as jest.Mock).mockImplementation(() => mockProfileInstance);

    await expect(createProfile({}, { input: mockInput })).rejects.toThrow("Профайл үүсгэхэд алдаа гарлаа");
  });
});
