import { Types } from "mongoose";
import { Profile as ProfileModel, Swipe as SwipeModel } from "../models";
export const checkTargetLikedSwiper = async (
  targetUserId: Types.ObjectId,
  swiperUserId: Types.ObjectId
): Promise<boolean> => {
  try {
    const existingSwipe = await SwipeModel.findOne({
      swiperId: targetUserId,
      targetId: swiperUserId,
      action: 'LIKE'
    });
    return !!existingSwipe;
  } catch (error) {
    console.error('Error checking if target liked swiper:', error);
    return false;
  }
};
export const addUsersToMatches = async (
  swiperUserId: Types.ObjectId,
  targetUserId: Types.ObjectId
): Promise<void> => {
  try {
    await Promise.all([
      ProfileModel.updateOne(
        { userId: swiperUserId },
        { $addToSet: { matches: targetUserId } }
      ),
      ProfileModel.updateOne(
        { userId: targetUserId },
        { $addToSet: { matches: swiperUserId } }
      )
    ]);
  } catch (error) {
    console.error('Error adding users to matches:', error);
    throw new Error('Failed to update matches');
  }
};
export const refreshProfilesAfterMatch = async (
  swiperUserId: Types.ObjectId,
  targetUserId: Types.ObjectId
): Promise<{ swiperProfile: any; targetProfile: any } | null> => {
  try {
    const [swiperProfile, targetProfile] = await Promise.all([
      ProfileModel.findOne({ userId: swiperUserId }),
      ProfileModel.findOne({ userId: targetUserId })
    ]);
    if (!swiperProfile || !targetProfile) {
      return null;
    }
    return { swiperProfile, targetProfile };
  } catch (error) {
    console.error('Error refreshing profiles after match:', error);
    return null;
  }
};
export const addTargetToSwiperLikes = async (
  swiperUserId: Types.ObjectId,
  targetUserId: Types.ObjectId
): Promise<void> => {
  try {
    await ProfileModel.updateOne(
      { userId: swiperUserId },
      { $addToSet: { likes: targetUserId } }
    );
  } catch (error) {
    console.error('Error adding target to swiper likes:', error);
    throw new Error('Failed to update matches');
  }
};
const processExistingLike = async (
  swiperObjectId: Types.ObjectId,
  targetObjectId: Types.ObjectId
): Promise<any> => {
  const targetLikedSwiper = await checkTargetLikedSwiper(targetObjectId, swiperObjectId);
  if (targetLikedSwiper) {
    await addUsersToMatches(swiperObjectId, targetObjectId);
    const refreshedProfiles = await refreshProfilesAfterMatch(swiperObjectId, targetObjectId);
    
    if (refreshedProfiles) {
      return {
        type: 'MATCH_CREATED',
        profiles: refreshedProfiles
      };
    }
  }
  return null;
};
export const handleExistingSwipe = async (
  existingSwipe: any,
  swiperObjectId: Types.ObjectId,
  targetObjectId: Types.ObjectId
): Promise<any> => {
  try {
    if (existingSwipe.action === 'LIKE') {
      const matchResult = await processExistingLike(swiperObjectId, targetObjectId);
      if (matchResult) return matchResult;
    }
    return {
      type: 'ALREADY_SWIPED',
      existingSwipe
    };
  } catch (error) {
    console.error('Error handling existing swipe:', error);
    return {
      type: 'ERROR',
      message: 'Failed to process existing swipe'
    };
  }
};
const createMatchIfMutual = async (
  swiperObjectId: Types.ObjectId,
  targetObjectId: Types.ObjectId
): Promise<any> => {
  await addUsersToMatches(swiperObjectId, targetObjectId);
  const refreshedProfiles = await refreshProfilesAfterMatch(swiperObjectId, targetObjectId);
  if (refreshedProfiles) {
    return {
      type: 'MATCH_CREATED',
      profiles: refreshedProfiles
    };
  }
  return null;
};
const processLikeResult = async (
  swiperObjectId: Types.ObjectId,
  targetObjectId: Types.ObjectId
): Promise<any> => {
  const targetLikedSwiper = await checkTargetLikedSwiper(targetObjectId, swiperObjectId);
  
  if (targetLikedSwiper) {
    const matchResult = await createMatchIfMutual(swiperObjectId, targetObjectId);
    if (matchResult) return matchResult;
  }
  
  return {
    type: 'LIKE_ADDED',
    message: 'Like added successfully'
  };
};
export const handleNewLike = async (
  swiperObjectId: Types.ObjectId,
  targetObjectId: Types.ObjectId
): Promise<any> => {
  try {
    await addTargetToSwiperLikes(swiperObjectId, targetObjectId);
    return await processLikeResult(swiperObjectId, targetObjectId);
  } catch (error) {
    console.error('Error handling new like:', error);
    return {
      type: 'ERROR',
      message: 'Failed to process like'
    };
  }
};
