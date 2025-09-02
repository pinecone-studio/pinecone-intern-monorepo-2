// apps/2FH/tinder/backend/specs/resolvers/mutations/create-profile-failure.spec.ts
import { createProfile } from "src/resolvers/mutations";
import { Profile, User } from "src/models";
import { Types } from "mongoose";
import { GraphQLError } from "graphql";
import { Gender } from "src/generated";

jest.mock("src/models");

describe("createProfile Mutation - Failure", () => {
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

  it("should throw GraphQLError if user does not exist", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      createProfile!({}, { input: mockProfileInput }, {} as any, {} as any)
    ).rejects.toThrow(
      new GraphQLError("Cannot create profile: User with this userId does not exist")
    );

    expect(Profile.create).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should throw GraphQLError if dateOfBirth is invalid", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const invalidInput = { ...mockProfileInput, dateOfBirth: "invalid-date" };

    await expect(
      createProfile!({}, { input: invalidInput }, {} as any, {} as any)
    ).rejects.toThrow(new GraphQLError("Cannot create profile: Invalid time value"));

    expect(Profile.create).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should throw GraphQLError if userId is invalid", async () => {
    const invalidInput = { ...mockProfileInput, userId: "invalid-user-id" };

    await expect(
      createProfile!({}, { input: invalidInput }, {} as any, {} as any)
    ).rejects.toThrow(
      new GraphQLError(
        "Cannot create profile: input must be a 24 character hex string, 12 byte Uint8Array, or an integer"
      )
    );

    expect(Profile.create).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should throw GraphQLError if Profile.create fails", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Profile.create as jest.Mock).mockRejectedValue(new Error("Database error"));

    await expect(
      createProfile!({}, { input: mockProfileInput }, {} as any, {} as any)
    ).rejects.toThrow(new GraphQLError("Cannot create profile: Database error"));

    expect(Profile.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockProfileInput,
        dateOfBirth: expect.any(Date),
      })
    );
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should throw GraphQLError for non-Error type unknown error", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Profile.create as jest.Mock).mockRejectedValue("Unknown error");

    await expect(
      createProfile!({}, { input: mockProfileInput }, {} as any, {} as any)
    ).rejects.toThrow(
      new GraphQLError("Cannot create profile: Unknown error occurred")
    );

    expect(Profile.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockProfileInput,
        dateOfBirth: expect.any(Date),
      })
    );
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});