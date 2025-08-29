
import { Types } from "mongoose";
import { Profile as ProfileModel } from "../models";
import { SwipeProfile } from "../types/swipe-types";

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

export const processLikeForMutualMatch = async (profile: any, likedUserId: Types.ObjectId) => {
  const likedProfile = await ProfileModel.findOne({ userId: likedUserId });
  return likedProfile && likedProfile.likes.some(id => id.equals(profile._id));
};