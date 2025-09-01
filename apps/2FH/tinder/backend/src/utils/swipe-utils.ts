import { Types } from "mongoose";
import { Profile, Swipe } from "../models";

export const findNextAvailableProfile = async (excludedProfileIds: Types.ObjectId[]) => {
  const profile = await Profile.findOne({
    _id: { $nin: excludedProfileIds }
  });

  if (!profile) return null;

  return {
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    name: profile.name,
    gender: profile.gender.toLowerCase() as 'male' | 'female' | 'both',
    bio: profile.bio,
    interests: profile.interests,
    profession: profile.profession,
    work: profile.work,
    images: profile.images,
    dateOfBirth: profile.dateOfBirth,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    likes: profile.likes ? profile.likes.map((id: any) => id.toString()) : [],
    matches: profile.matches ? profile.matches.map((id: any) => id.toString()) : [],
  };
};

export const getSwipedUserIds = async (swiperId: string) => {
  // Get all swiped user IDs from Swipe collection
  const swipedProfiles = await Swipe.find({ 
    swiperId: new Types.ObjectId(swiperId) 
  }).select('targetId');
  
  // Extract target user IDs
  const swipedUserIds = swipedProfiles.map(swipe => swipe.targetId);
  
  // Also exclude the swiper's own profile
  const swiperProfile = await Profile.findOne({ userId: new Types.ObjectId(swiperId) });
  if (swiperProfile) {
    swipedUserIds.push(swiperProfile._id);
  }
  
  return swipedUserIds;
};

export const checkMutualLike = async (profile: any, likedUserId: Types.ObjectId) => {
  const likedProfile = await Profile.findOne({ userId: likedUserId });
  return likedProfile && likedProfile.likes.some((id: any) => id.equals(profile.userId));
};

export const addMutualMatch = async (profile: any, likedUserId: Types.ObjectId) => {
  await Profile.findOneAndUpdate(
    { userId: profile.userId },
    { $addToSet: { matches: likedUserId } }
  );
  await Profile.findOneAndUpdate(
    { userId: likedUserId },
    { $addToSet: { matches: profile.userId } }
  );
};