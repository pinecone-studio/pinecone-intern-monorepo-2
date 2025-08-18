import { MutationResolvers, UpdateProfileInput, ProfileResponse } from "src/generated";
import { Profile, User } from "src/models";
import { GraphQLError } from "graphql";

async function validateUserExists(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new GraphQLError("User with this userId does not exist");
  return user;
}

async function validateProfileExists(userId: string) {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new GraphQLError("Profile not found");
  return profile;
}

function buildProfileUpdateData(input: UpdateProfileInput): Partial<UpdateProfileInput & { updatedAt: string }> {
  const { userId, ...updateFields } = input; // userId-г хасна
  const updateData: Partial<UpdateProfileInput & { updatedAt: string }> = {
    ...updateFields,
    updatedAt: new Date().toISOString(),
  };
  if (input.dateOfBirth) {
    updateData.dateOfBirth = new Date(input.dateOfBirth).toISOString();
  }
  return updateData;
}

export const updateProfile: MutationResolvers["updateProfile"] = async (
  _,
  { input }
) => {
  try {
    await validateUserExists(input.userId);
    await validateProfileExists(input.userId);

    const updateData = buildProfileUpdateData(input);
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: input.userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedProfile) throw new GraphQLError("Failed to update profile");

    console.log("Profile updated successfully:", updatedProfile._id);
    return ProfileResponse.Success;
  } catch (err) {
    if (!(err instanceof GraphQLError)) {
      console.error("Failed to update profile:", err);
      throw new GraphQLError("Unknown error occurred");
    }
    throw err;
  }
};