// apps/2FH/tinder/backend/src/mutations/swipe-core.ts
import { GraphQLError } from "graphql";
import { Types } from "mongoose";
import { Swipe, User } from "src/models";
import {
  getSwipedUserIds,
  syncExistingMatches,
  handleExistingSwipe,
  handleNewLike
} from "./swipe-helpers";
import { findNextAvailableProfile } from "./swipe-utils";
import { SwipeInput } from "../types/swipe-types";

type SwipeAction = 'LIKE' | 'DISLIKE' | 'SUPER_LIKE';

const validateUserIds = (swiperId: string, targetId: string) => {
  if (!Types.ObjectId.isValid(swiperId) || !Types.ObjectId.isValid(targetId)) {
    throw new GraphQLError("Swipe failed: Invalid user ID format");
  }
};

const handleExistingSwipeCase = async (existingSwipe: any, swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  const match = await handleExistingSwipe(existingSwipe, swiperObjectId, targetObjectId);
  return {
    success: false,
    message: "You have already swiped this profile",
    response: "ALREADY_SWIPED",
    match,
    nextProfile: null,
  };
};

const createSuccessResponse = (action: SwipeAction, match: any, nextProfile: any) => {
  return {
    success: true,
    message: `Successfully ${action.toLowerCase()}d profile`,
    response: match ? "MATCH_CREATED" : "SUCCESS",
    match,
    nextProfile,
  };
};

const validateAndPrepareSwipe = (swiperId: string, targetId: string) => {
  validateUserIds(swiperId, targetId);
  if (swiperId === targetId) {
    throw new GraphQLError("Swipe failed: Cannot swipe on your own profile");
  }
  return {
    swiperObjectId: new Types.ObjectId(swiperId),
    targetObjectId: new Types.ObjectId(targetId)
  };
};

const checkUsersExist = async (swiperId: string, targetId: string) => {
  const swiperUser = await User.findById(swiperId);
  const targetUser = await User.findById(targetId);
  if (!swiperUser || !targetUser) {
    throw new GraphQLError("Swipe failed: One or both users not found");
  }
};

const createSwipeAndGetMatch = async (swiperId: string, targetId: string, action: SwipeAction, swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  await Swipe.create({ 
    swiperId: swiperObjectId, 
    targetId: targetObjectId, 
    action,
    swipedAt: new Date()
  });
  let match = null;
  if (action === "LIKE") {
    match = await handleNewLike(swiperObjectId, targetObjectId, swiperId);
  }
  return match;
};

const getNextProfile = async (swiperId: string) => {
  const swipedUserIds = await getSwipedUserIds(swiperId);
  return await findNextAvailableProfile(swipedUserIds);
};

const handleSwipeCreation = async (swiperId: string, targetId: string, action: SwipeAction, swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  try {
    const match = await createSwipeAndGetMatch(swiperId, targetId, action, swiperObjectId, targetObjectId);
    const nextProfile = await getNextProfile(swiperId);
    return createSuccessResponse(action, match, nextProfile);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError(`Swipe failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const swipe = async (_: unknown, { input }: { input: SwipeInput }) => {
  const { swiperId, targetId, action } = input;
  const typedAction: SwipeAction = action as SwipeAction;
  const { swiperObjectId, targetObjectId } = validateAndPrepareSwipe(swiperId, targetId);
  await checkUsersExist(swiperId, targetId);
  await syncExistingMatches(swiperId);
  await syncExistingMatches(targetId);
  const existingSwipe = await Swipe.findOne({ swiperId, targetId });
  if (existingSwipe) {
    return await handleExistingSwipeCase(existingSwipe, swiperObjectId, targetObjectId);
  }
  return await handleSwipeCreation(swiperId, targetId, typedAction, swiperObjectId, targetObjectId);
};