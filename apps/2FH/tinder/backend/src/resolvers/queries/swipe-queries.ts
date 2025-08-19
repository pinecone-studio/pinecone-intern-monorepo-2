// src/resolvers/queries/swipe-queries.ts
import { GraphQLError } from "graphql";
import { Swipe, Profile } from "src/models";
import { Types } from "mongoose";

interface GetSwipeHistoryArgs {
  userId: string;
}

interface GetNextProfileArgs {
  userId: string;
}

interface GetSwipedProfilesArgs {
  userId: string;
}

export const getSwipeHistory = async (
  _: unknown,
  { userId }: GetSwipeHistoryArgs,
  __: unknown,
  ___: unknown
) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new GraphQLError("Invalid user ID format");
    }

    const swipes = await Swipe.find({ swiperId: userId })
      .sort({ createdAt: -1 })
      .populate('targetId', 'name images profession');

    return swipes.map(swipe => ({
      id: swipe._id.toString(),
      swiperId: swipe.swiperId.toString(),
      targetId: swipe.targetId._id.toString(),
      action: swipe.action,
      swipedAt: swipe.swipedAt
    }));
  } catch (error: unknown) {
    throw new GraphQLError(`Failed to get swipe history: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Helper function to get swiped user IDs
const getSwipedUserIds = async (userId: string): Promise<Types.ObjectId[]> => {
  const swipedUserIds = await Swipe.find({ swiperId: userId })
    .distinct('targetId');
  
  // Add the user's own ID to exclude it
  swipedUserIds.push(new Types.ObjectId(userId));
  
  return swipedUserIds;
};

// Helper function to find next available profile
const findNextAvailableProfile = async (swipedUserIds: Types.ObjectId[]) => {
  return await Profile.findOne({
    userId: { $nin: swipedUserIds }
  }).populate('userId', 'name images profession');
};

export const getNextProfile = async (
  _: unknown,
  { userId }: GetNextProfileArgs,
  __: unknown,
  ___: unknown
) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new GraphQLError("Invalid user ID format");
    }

    const swipedUserIds = await getSwipedUserIds(userId);
    const nextProfile = await findNextAvailableProfile(swipedUserIds);

    return nextProfile;
  } catch (error: unknown) {
    throw new GraphQLError(`Failed to get next profile: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getSwipedProfiles = async (
  _: unknown,
  { userId }: GetSwipedProfilesArgs,
  __: unknown,
  ___: unknown
) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new GraphQLError("Invalid user ID format");
    }

    // Get all swiped profiles
    const swipes = await Swipe.find({ swiperId: userId })
      .populate('targetId', 'name images profession bio interests');

    // Get the actual profile data for each swiped user
    const profileIds = swipes.map(swipe => swipe.targetId._id);
    const profiles = await Profile.find({ userId: { $in: profileIds } });

    return profiles;
  } catch (error: unknown) {
    throw new GraphQLError(`Failed to get swiped profiles: ${error instanceof Error ? error.message : String(error)}`);
  }
}; 