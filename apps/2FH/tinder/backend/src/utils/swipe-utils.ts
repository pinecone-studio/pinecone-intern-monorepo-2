import { Types } from "mongoose";
import { Profile } from "src/models";

export const findNextAvailableProfile = async (excludedUserIds: Types.ObjectId[]) => {
  const profile = await Profile.findOne({
    userId: { $nin: excludedUserIds }
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
  const swipedIds = await Profile.distinct('userId', { swiperId });
  return [...swipedIds, new Types.ObjectId(swiperId)];
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