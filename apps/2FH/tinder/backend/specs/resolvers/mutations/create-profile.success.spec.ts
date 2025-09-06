// apps/2FH/tinder/backend/specs/resolvers/mutations/create-profile.success.spec.ts
import { createProfile } from "src/resolvers/mutations";
import { Profile, User } from "src/models";
import { Types } from "mongoose";
import { Gender, ProfileResponse } from "src/generated";

jest.mock("src/models");

describe("createProfile Mutation", () => {
  const mockProfileInput = {
    userId: "64d1234567890abcdef12345",
    name: "John Doe",
    gender: Gender.Male,
    interestedIn: Gender.Female,
    bio: "Hello world",
    interests: ["coding", "music"],
    profession: "Developer",
    work: "Remote",
    images: ["image1.jpg"],
    dateOfBirth: "1990-01-01",
  };

  const mockUser = {
    _id: new Types.ObjectId(mockProfileInput.userId),
    email: "test@example.com",
  };

  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {
      // Mock implementation - intentionally empty
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("Success case", () => {
    it("should create a profile successfully", async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const createdProfile = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(mockProfileInput.userId),
        name: mockProfileInput.name,
        gender: mockProfileInput.gender,
        bio: mockProfileInput.bio,
        interests: mockProfileInput.interests,
        profession: mockProfileInput.profession,
        work: mockProfileInput.work,
        images: mockProfileInput.images,
        dateOfBirth: new Date(mockProfileInput.dateOfBirth),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (Profile.create as jest.Mock).mockResolvedValue(createdProfile);

      const result = await createProfile!({}, { input: mockProfileInput }, {} as any, {} as any);

      expect(Profile.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockProfileInput,
          dateOfBirth: "1990-01-01T00:00:00.000Z",
        })
      );

      // ProfileResponse enum утгыг шалгах
      expect(result).toBe(ProfileResponse.Success);
      // Эсвэл string утгыг шалгах
      // expect(result).toBe("SUCCESS");

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
})