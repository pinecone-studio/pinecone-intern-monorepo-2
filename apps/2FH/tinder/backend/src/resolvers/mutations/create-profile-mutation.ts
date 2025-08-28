// src/resolvers/mutations/create-profile-mutation.ts
import { GraphQLError } from "graphql";
import { Profile, User } from "src/models";
import { Types } from "mongoose";
import { MutationResolvers, ProfileResponse } from "src/generated";

// Validation функцууд
const validateUserId = (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new GraphQLError(
      "Cannot create profile: input must be a 24 character hex string, 12 byte Uint8Array, or an integer"
    );
  }
};

const validateUserExists = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new GraphQLError("Cannot create profile: User with this userId does not exist");
  }
  return user;
};

const validateDateOfBirth = (dateOfBirth: string) => {
  const parsedDate = new Date(dateOfBirth);
  if (isNaN(parsedDate.getTime())) {
    throw new GraphQLError("Cannot create profile: Invalid time value");
  }
  return parsedDate;
};

export const createProfile: MutationResolvers["createProfile"] = async (
  _:unknown,
  { input },
): Promise<ProfileResponse> => {
  const { userId, dateOfBirth } = input;

  // Validation-ууд
  validateUserId(userId);
  await validateUserExists(userId);
  const parsedDate = validateDateOfBirth(dateOfBirth);

  try {
    await Profile.create({
      ...input,
      dateOfBirth: parsedDate,
    });

    return ProfileResponse.Success;
  } catch (error: unknown) {
    throw new GraphQLError(`Cannot create profile: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
  }
};