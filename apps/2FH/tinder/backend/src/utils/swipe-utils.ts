// apps/2FH/tinder/backend/src/utils/swipe-utils.ts
import { Types } from "mongoose";
import { Profile as ProfileModel, Swipe } from "src/models";
import { SwipeProfile } from "../types/swipe-types";
import { GraphQLError } from "graphql";

// Helper function to get swiped user IDs
export const getSwipedUserIds = async (userId: string): Promise<Types.ObjectId[]> => {
  try {
    const swipedUserIds = await Swipe.find({ swiperId: userId })
      .distinct('targetId');
    
    // Add the user's own ID to exclude it
    swipedUserIds.push(new Types.ObjectId(userId));
    
    return swipedUserIds;
  } catch (error: unknown) {
    throw new GraphQLError(`Failed to get swiped user IDs: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const checkMutualLike = async (profile: SwipeProfile, likedUserId: Types.ObjectId) => {
  const likedProfile = await ProfileModel.findOne({ userId: likedUserId });
  return likedProfile && likedProfile.likes.some(id => id.equals(profile.userId));
};

export const addMutualMatch = async (profile: SwipeProfile, likedUserId: Types.ObjectId) => {
  await ProfileModel.findOneAndUpdate(
    { userId: profile.userId },
    { $addToSet: { matches: likedUserId } }
  );
  await ProfileModel.findOneAndUpdate(
    { userId: likedUserId },
    { $addToSet: { matches: profile.userId } }
  );
};

export const processLikeForMutualMatch = async (profile: SwipeProfile, likedUserId: Types.ObjectId) => {
  const isMutual = await checkMutualLike(profile, likedUserId);
  if (isMutual) {
    await addMutualMatch(profile, likedUserId);
  }
};

// Helper function to find next available profile
export const findNextAvailableProfile = async (swipedUserIds: Types.ObjectId[]) => {
  try {
    const profile = await ProfileModel.findOne({
      userId: { $nin: swipedUserIds }
    });
    
    if (!profile) return null;
    
    // Return the profile data in the expected format
    return {
      userId: profile.userId.toString(),
      name: profile.name,
      images: profile.images,
      profession: profile.profession,
    };
  } catch (error: unknown) {
    throw new GraphQLError(`Failed to find next available profile: ${error instanceof Error ? error.message : String(error)}`);
  }
};
