// apps/2FH/tinder/backend/src/mutations/swipe-helpers.ts
import { Types } from "mongoose";
import { Profile as ProfileModel } from "src/models";
import { SwipeProfile } from "../types/swipe-types";
import { 
  processLikeForMutualMatch, 
  findNextAvailableProfile, 
  getSwipedUserIds 
} from "./swipe-utils";

export { findNextAvailableProfile, getSwipedUserIds };

export const syncExistingMatches = async (userId: string) => {
  try {
    const profile = await ProfileModel.findOne({ userId });
    if (!profile) return;
    
    if (hasValidLikes(profile)) {
      await processLikesForMatches(profile);
    }
  } catch (error) {
    return;
  }
};

const hasValidLikes = (profile: any): boolean => {
  return profile.likes && Array.isArray(profile.likes);
};

const processLikesForMatches = async (profile: any) => {
  await Promise.all(profile.likes.map((likedUserId: Types.ObjectId) => 
    processLikeForMutualMatch(profile, likedUserId)
  ));
};

export const createMatchObject = (swiperProfile: SwipeProfile, targetProfile: SwipeProfile) => {
  return {
    likeduserId: {
      userId: swiperProfile.userId.toString(),
      name: swiperProfile.name,
      likes: swiperProfile.likes.map((id: any) => id.toString()),
      matches: swiperProfile.matches.map((id: any) => id.toString()),
    },
    matcheduserId: {
      userId: targetProfile.userId.toString(),
      name: targetProfile.name,
      likes: targetProfile.likes.map((id: any) => id.toString()),
      matches: targetProfile.matches.map((id: any) => id.toString()),
    },
  };
};

export const checkIfMatched = (swiperProfile: SwipeProfile, targetProfile: SwipeProfile, targetObjectId: Types.ObjectId, swiperObjectId: Types.ObjectId) => {
  if (!hasValidProfiles(swiperProfile, targetProfile)) return false;
  
  const swiperHasTarget = swiperProfile.matches.some((id: Types.ObjectId) => id.equals(targetObjectId));
  const targetHasSwiper = targetProfile.matches.some((id: Types.ObjectId) => id.equals(swiperObjectId));
  
  return swiperHasTarget && targetHasSwiper;
};

const hasValidProfiles = (swiperProfile: SwipeProfile, targetProfile: SwipeProfile): boolean => {
  return !!(swiperProfile && targetProfile && swiperProfile.matches && targetProfile.matches);
};

export const checkProfilesAndMatch = async (swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  const profiles = await getProfiles(swiperObjectId, targetObjectId);
  if (!profiles) return null;
  
  const isMatch = checkIfMatched(profiles.swiper, profiles.target, targetObjectId, swiperObjectId);
  if (isMatch) {
    return createMatchObject(profiles.swiper, profiles.target);
  }
  return null;
};

const getProfiles = async (swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  const swiperProfile = await ProfileModel.findOne({ userId: swiperObjectId });
  const targetProfile = await ProfileModel.findOne({ userId: targetObjectId });
  
  if (!swiperProfile || !targetProfile) return null;
  
  return { swiper: swiperProfile, target: targetProfile };
};

export const handleExistingSwipe = async (existingSwipe: any, swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  if (existingSwipe.action === "LIKE") {
    return await checkProfilesAndMatch(swiperObjectId, targetObjectId);
  }
  return null;
};

export const checkTargetLikedSwiper = async (targetObjectId: Types.ObjectId, swiperObjectId: Types.ObjectId) => {
  const targetProfile = await ProfileModel.findOne({ userId: targetObjectId });
  if (!targetProfile || !targetProfile.likes || !Array.isArray(targetProfile.likes)) return false;
  return targetProfile.likes.some((id: Types.ObjectId) => id.equals(swiperObjectId));
};

export const addUsersToMatches = async (swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  await ProfileModel.findOneAndUpdate(
    { userId: swiperObjectId },
    { $addToSet: { matches: targetObjectId } }
  );
  await ProfileModel.findOneAndUpdate(
    { userId: targetObjectId },
    { $addToSet: { matches: swiperObjectId } }
  );
};

export const refreshProfilesAfterMatch = async (swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  const updatedSwiperProfile = await ProfileModel.findOne({ userId: swiperObjectId });
  const updatedTargetProfile = await ProfileModel.findOne({ userId: targetObjectId });
  if (!updatedSwiperProfile || !updatedTargetProfile) return null;
  return createMatchObject(updatedSwiperProfile, updatedTargetProfile);
};

export const addTargetToSwiperLikes = async (swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  await ProfileModel.findOneAndUpdate(
    { userId: swiperObjectId },
    { $addToSet: { likes: targetObjectId } }
  );
};

export const handleNewLike = async (swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId, _swiperId: string) => {
  const isMatch = await checkTargetLikedSwiper(targetObjectId, swiperObjectId);
  await addTargetToSwiperLikes(swiperObjectId, targetObjectId);
  
  if (isMatch) {
    return await processMatch(swiperObjectId, targetObjectId);
  }
  return null;
};

const processMatch = async (swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  await addUsersToMatches(swiperObjectId, targetObjectId);
  return await refreshProfilesAfterMatch(swiperObjectId, targetObjectId);
};