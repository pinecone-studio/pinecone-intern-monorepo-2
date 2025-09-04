// apps/2FH/tinder/backend/specs/resolvers/mutations/create-profile-simple.spec.ts
import { createProfile } from "src/resolvers/mutations/create-profile-mutation";
import { Profile, User } from "src/models";
import { Types } from "mongoose";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { Gender, ProfileResponse } from "src/generated";
import { Context } from "src/types";

jest.mock("src/models");

describe("createProfile Mutation - Simple Test", () => {
  const mockProfileInput = {
    userId: "64d1234567890abcdef12345",
    name: "John Doe",
    gender: Gender.Male,
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a profile successfully", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Profile.create as jest.Mock).mockResolvedValue({});

    // Use type assertion to bypass TypeScript issues
    const result = await (createProfile as any)(
      {},
      { input: mockProfileInput },
      {} as Context,
      {} as GraphQLResolveInfo
    );

    expect(result).toBe(ProfileResponse.Success);
    expect(Profile.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockProfileInput,
        dateOfBirth: expect.any(Date),
      })
    );
  });

  it("should throw error for invalid userId", async () => {
    const invalidInput = { ...mockProfileInput, userId: "invalid" };

    await expect(
      (createProfile as any)({}, { input: invalidInput }, {} as Context, {} as GraphQLResolveInfo)
    ).rejects.toThrow(
      new GraphQLError(
        "Cannot create profile: input must be a 24 character hex string, 12 byte Uint8Array, or an integer"
      )
    );
  });

  it("should throw error when user does not exist", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      (createProfile as any)({}, { input: mockProfileInput }, {} as Context, {} as GraphQLResolveInfo)
    ).rejects.toThrow(
      new GraphQLError("Cannot create profile: User with this userId does not exist")
    );
  });

  it("should throw error for invalid dateOfBirth", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    const invalidInput = { ...mockProfileInput, dateOfBirth: "invalid-date" };

    await expect(
      (createProfile as any)({}, { input: invalidInput }, {} as Context, {} as GraphQLResolveInfo)
    ).rejects.toThrow(new GraphQLError("Cannot create profile: Invalid time value"));
  });

  it("should throw error when Profile.create fails", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Profile.create as jest.Mock).mockRejectedValue(new Error("Database error"));

    await expect(
      (createProfile as any)({}, { input: mockProfileInput }, {} as Context, {} as GraphQLResolveInfo)
    ).rejects.toThrow(new GraphQLError("Cannot create profile: Database error"));
  });

  it("should throw error for non-Error type unknown error", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (Profile.create as jest.Mock).mockRejectedValue("String error");

    await expect(
      (createProfile as any)({}, { input: mockProfileInput }, {} as Context, {} as GraphQLResolveInfo)
    ).rejects.toThrow(new GraphQLError("Cannot create profile: Unknown error occurred"));
  });
});