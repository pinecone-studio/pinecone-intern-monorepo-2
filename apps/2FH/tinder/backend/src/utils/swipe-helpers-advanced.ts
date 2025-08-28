import { Types } from 'mongoose';
import { Profile as ProfileModel } from 'src/models';
import { SwipeProfile } from '../types/swipe-types';

// Extract individual gender validation checks to reduce complexity
const validateMaleGender = (swiperGender: string, targetGender: string): boolean => {
  return swiperGender === 'male' && targetGender !== 'male';
};

const validateFemaleGender = (swiperGender: string, targetGender: string): boolean => {
  return swiperGender === 'female' && targetGender !== 'female';
};

const validateBothGender = (swiperGender: string, targetGender: string): boolean => {
  return swiperGender === 'both' && !['male', 'female'].includes(targetGender);
};

// Extract gender validation logic to reduce complexity
const validateGenderCompatibility = (swiperGender: string, targetGender: string): boolean => {
  if (validateMaleGender(swiperGender, targetGender)) {
    return false; // Male users can only match with male profiles
  } else if (validateFemaleGender(swiperGender, targetGender)) {
    return false; // Female users can only match with female profiles
  } else if (validateBothGender(swiperGender, targetGender)) {
    return false; // Both users can only match with male or female profiles
  }
  return true;
};

// Extract profile validation logic to reduce complexity
const validateProfiles = (swiperProfile: any, targetProfile: any): boolean => {
  return !!(swiperProfile && targetProfile && targetProfile.likes && Array.isArray(targetProfile.likes));
};

export const checkTargetLikedSwiper = async (targetObjectId: Types.ObjectId, swiperObjectId: Types.ObjectId) => {
  const swiperProfile = await ProfileModel.findOne({ userId: swiperObjectId });
  const targetProfile = await ProfileModel.findOne({ userId: targetObjectId });
  
  if (!validateProfiles(swiperProfile, targetProfile)) {
    return false;
  }

  // At this point, we know both profiles exist and are valid
  const swiperProfileSafe = swiperProfile!;
  const targetProfileSafe = targetProfile!;

  // Validate gender compatibility
  const swiperGender = swiperProfileSafe.gender.toLowerCase();
  const targetGender = targetProfileSafe.gender.toLowerCase();
  
  if (!validateGenderCompatibility(swiperGender, targetGender)) {
    return false;
  }

  return targetProfileSafe.likes.some((id: Types.ObjectId) => id.equals(swiperObjectId));
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
  const swiperProfile = await ProfileModel.findOne({ userId: swiperObjectId });
  const targetProfile = await ProfileModel.findOne({ userId: targetObjectId });
  
  if (!swiperProfile || !targetProfile) {
    return;
  }

  // Validate gender compatibility
  const swiperGender = swiperProfile.gender.toLowerCase();
  const targetGender = targetProfile.gender.toLowerCase();
  
  if (!validateGenderCompatibility(swiperGender, targetGender)) {
    return;
  }

  await ProfileModel.findOneAndUpdate(
    { userId: swiperObjectId },
    { $addToSet: { likes: targetObjectId } }
  );
};

export const handleExistingSwipe = async (existingSwipe: any, swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  // Check if this is a mutual like that creates a match
  if (existingSwipe.action === 'LIKE') {
    const isMatch = await checkTargetLikedSwiper(targetObjectId, swiperObjectId);
    if (isMatch) {
      return await processMatch(swiperObjectId, targetObjectId);
    }
  }
  return null;
};

export const processLikeForMutualMatch = async (profile: SwipeProfile, likedUserId: Types.ObjectId) => {
  const likedProfile = await ProfileModel.findOne({ userId: likedUserId });
  return likedProfile && likedProfile.likes.some(id => id.equals(profile.userId));
};

export const handleNewLike = async (swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId, _swiperId: string) => {
  // Check for mutual match first
  const isMatch = await checkTargetLikedSwiper(targetObjectId, swiperObjectId);
  
  // Add target to swiper's likes
  await addTargetToSwiperLikes(swiperObjectId, targetObjectId);
  
  // If it's a match, process it
  if (isMatch) {
    return await processMatch(swiperObjectId, targetObjectId);
  }
  
  return null;
};

const processMatch = async (swiperObjectId: Types.ObjectId, targetObjectId: Types.ObjectId) => {
  await addUsersToMatches(swiperObjectId, targetObjectId);
  return await refreshProfilesAfterMatch(swiperObjectId, targetObjectId);
};

// Helper function for creating match object
const createMatchObject = (swiperProfile: any, targetProfile: any) => {
  return {
    likeduserId: {
      userId: swiperProfile.userId,
      name: swiperProfile.name,
      images: swiperProfile.images,
    },
    matcheduserId: {
      userId: targetProfile.userId,
      name: targetProfile.name,
      images: targetProfile.images,
    },
  };
}; 