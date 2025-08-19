import { GraphQLError } from "graphql";
import { Swipe, Match, Profile, User } from "src/models";
import { Types } from "mongoose";
import { MutationResolvers, SwipeAction, SwipeResponse, SwipeResult } from "src/generated";

// Validation functions
const validateUserIds = (swiperId: string, targetId: string) => {
  if (!Types.ObjectId.isValid(swiperId) || !Types.ObjectId.isValid(targetId)) {
    throw new GraphQLError("Invalid user ID format");
  }
  if (swiperId === targetId) {
    throw new GraphQLError("Cannot swipe on your own profile");
  }
};

const validateUsersExist = async (swiperId: string, targetId: string) => {
  const [swiper, target] = await Promise.all([
    User.findById(swiperId), 
    User.findById(targetId)
  ]);
  if (!swiper || !target) {
    throw new GraphQLError("One or both users not found");
  }
};

const checkAlreadySwiped = async (swiperId: string, targetId: string) => {
  return await Swipe.findOne({ swiperId, targetId });
};

const checkForMatch = async (swiperId: string, targetId: string) => {
  return await Swipe.findOne({ swiperId: targetId, targetId: swiperId, action: SwipeAction.Like });
};

const createMatch = async (user1Id: string, user2Id: string) => {
  try {
    return await Match.create({ likeduserId: user1Id, matcheduserId: user2Id, matchedAt: new Date() });
  } catch (error: unknown) {
    throw new GraphQLError(`Failed to create match: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const getNextProfile = async (swiperId: string) => {
  const swipedUserIds = await Swipe.find({ swiperId }).distinct('targetId');
  swipedUserIds.push(new Types.ObjectId(swiperId));
  return await Profile.findOne({ userId: { $nin: swipedUserIds } });
};

// Helper function to handle match creation logic
const handleMatchCreation = async (swiperId: string, targetId: string, action: SwipeAction): Promise<unknown | null> => {
  if (action === SwipeAction.Dislike) return null;
  const targetSwipe = await checkForMatch(swiperId, targetId);
  if (!targetSwipe || targetSwipe.action !== SwipeAction.Like) return null;
  return await createMatch(swiperId, targetId);
};

// Helper function to check if object has toJSON method
const hasToJSONMethod = (obj: unknown): obj is { toJSON: () => unknown } => {
  if (obj === null || typeof obj !== 'object') return false;
  if (!('toJSON' in obj)) return false;
  return typeof (obj as { toJSON: () => unknown }).toJSON === 'function';
};

// Helper function to safely extract toJSON from an object
const safeToJSON = (obj: unknown): unknown => {
  return hasToJSONMethod(obj) ? obj.toJSON() : obj;
};

// Helper function to safely convert object to GraphQL type
const convertToGraphQLType = <T>(obj: unknown): T | undefined => {
  const converted = safeToJSON(obj);
  return (converted as T) || undefined;
};

// Helper function to build swipe result
const buildSwipeResult = (
  success: boolean,
  message: string,
  response: SwipeResponse,
  match?: unknown | null,
  nextProfile?: unknown | null
): SwipeResult => ({
  success,
  message,
  response,
  match: convertToGraphQLType(match),
  nextProfile: convertToGraphQLType(nextProfile)
});

// Separate function to determine message and response type
const getSwipeResultDetails = (isMatch: boolean, action: SwipeAction) => {
  if (isMatch) {
    return {
      message: "It's a match! 🎉",
      responseType: SwipeResponse.MatchCreated
    };
  }
  
  return {
    message: `Successfully ${action.toLowerCase()}d profile`,
    responseType: SwipeResponse.Success
  };
};

const performSwipe = async (swiperId: string, targetId: string, action: SwipeAction): Promise<SwipeResult> => {
  validateUserIds(swiperId, targetId);
  await validateUsersExist(swiperId, targetId);
  
  const existingSwipe = await checkAlreadySwiped(swiperId, targetId);
  if (existingSwipe) {
    return buildSwipeResult(false, "Already swiped on this profile", SwipeResponse.AlreadySwiped);
  }
  
  await Swipe.create({ swiperId, targetId, action });
  const match = await handleMatchCreation(swiperId, targetId, action);
  const nextProfile = await getNextProfile(swiperId);
  
  const isMatch = !!match;
  const { message, responseType } = getSwipeResultDetails(isMatch, action);
  
  return buildSwipeResult(true, message, responseType, match, nextProfile);
};

export const swipe: MutationResolvers["swipe"] = async (_, { input }): Promise<SwipeResult> => {
  const { swiperId, targetId, action } = input;
  try {
    return await performSwipe(swiperId, targetId, action);
  } catch (error: unknown) {
    throw new GraphQLError(`Swipe failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const performUndoSwipe = async (userId: string): Promise<SwipeResponse> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new GraphQLError("Invalid user ID format");
  }
  
  const lastSwipe = await Swipe.findOne({ swiperId: userId }).sort({ createdAt: -1 });
  if (!lastSwipe) return SwipeResponse.Error;
  
  await Swipe.findByIdAndDelete(lastSwipe._id);
  return SwipeResponse.Success;
};

export const undoLastSwipe: MutationResolvers["undoLastSwipe"] = async (_, { userId }): Promise<SwipeResponse> => {
  try {
    return await performUndoSwipe(userId);
  } catch (error: unknown) {
    throw new GraphQLError(`Failed to undo swipe: ${error instanceof Error ? error.message : String(error)}`);
  }
};