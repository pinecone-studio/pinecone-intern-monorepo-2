import { Profile, Match, ProfileType } from '../models';
import { SwipeResult, MatchData } from './swipe-types';
import { Document, Types } from 'mongoose';

type ProfileDocument = Document<unknown, any, ProfileType> & ProfileType & { _id: Types.ObjectId };

export const checkIfMatched = async (userId1: string, userId2: string): Promise<boolean> => {
    try {
        const match = await Match.findOne({
            users: { $all: [userId1, userId2] }
        });
        return !!match;
    } catch (error) {
        console.error('Error checking if matched:', error);
        return false;
    }
};

const validateProfiles = async (swiperId: string, swipedId: string): Promise<{ swiperProfile: ProfileType | null; swipedProfile: ProfileType | null }> => {
    const swiperProfile = await Profile.findOne({ userId: swiperId });
    const swipedProfile = await Profile.findOne({ userId: swipedId });
    return { swiperProfile, swipedProfile };
};

const checkForExistingSwipe = async (swipedId: string, swiperId: string): Promise<boolean> => {
    const existingSwipe = await Match.findOne({
        users: { $all: [swipedId, swiperId] },
        action: 'like'
    });
    return !!existingSwipe;
};

const createMatchData = (swiperId: string, swipedId: string): MatchData => {
    return {
        users: [swiperId, swipedId],
        createdAt: new Date(),
        updatedAt: new Date()
    };
};

const handleProfileValidation = (swiperProfile: ProfileType | null, swipedProfile: ProfileType | null): SwipeResult | null => {
    if (!swiperProfile || !swipedProfile) {
        return { isMatch: false, message: 'Profile not found' };
    }
    return null;
};

export const checkProfilesAndMatch = async (swiperId: string, swipedId: string): Promise<SwipeResult> => {
    try {
        const { swiperProfile, swipedProfile } = await validateProfiles(swiperId, swipedId);
        
        const validationResult = handleProfileValidation(swiperProfile, swipedProfile);
        if (validationResult) return validationResult;

        const hasExistingSwipe = await checkForExistingSwipe(swipedId, swiperId);

        if (hasExistingSwipe) {
            const matchData = createMatchData(swiperId, swipedId);
            return { isMatch: true, message: 'It\'s a match!', matchData };
        }

        return { isMatch: false, message: 'No match yet' };
    } catch (error) {
        console.error('Error checking profiles and match:', error);
        return { isMatch: false, message: 'Error occurred' };
    }
};

const getOtherUserId = (match: Record<string, unknown>, userId: string): string | null => {
    const likedUserId = match.likeduserId as string;
    const matchedUserId = match.matcheduserId as string;
    const otherUserId = likedUserId === userId ? matchedUserId : likedUserId;
    return otherUserId || null;
};

const processMatchSync = (userId: string, otherUserId: string): void => {
    // Sync match data if needed
    console.log(`Syncing match between ${userId} and ${otherUserId}`);
};

export const syncExistingMatches = async (userId: string): Promise<void> => {
    try {
        const userMatches = await Match.find({ users: userId });

        for (const match of userMatches) {
            const otherUserId = getOtherUserId(match as unknown as Record<string, unknown>, userId);
            if (otherUserId) {
                processMatchSync(userId, otherUserId);
            }
        }
    } catch (error) {
        console.error('Error syncing existing matches:', error);
    }
};

const buildBaseQuery = (userId: string, excludeIds: string[], userProfile: ProfileType): Record<string, unknown> => {
    return {
        userId: { $ne: userId, $nin: excludeIds },
        gender: userProfile.gender || 'BOTH'
    };
};

const addInterestsToQuery = (query: Record<string, unknown>, userProfile: ProfileType): void => {
    if (userProfile.interests && userProfile.interests.length > 0) {
        query.interests = { $in: userProfile.interests };
    }
};

export const findNextAvailableProfile = async (userId: string, excludeIds: string[] = []): Promise<ProfileDocument | null> => {
    try {
        const userProfile = await Profile.findOne({ userId });
        if (!userProfile) return null;

        const query = buildBaseQuery(userId, excludeIds, userProfile);
        addInterestsToQuery(query, userProfile);

        return await Profile.findOne(query);
    } catch (error) {
        console.error('Error finding next available profile:', error);
        return null;
    }
};

export const createMatchObject = (user1Id: string, user2Id: string): MatchData => {
    return {
        users: [user1Id, user2Id],
        createdAt: new Date(),
        updatedAt: new Date()
    };
};

export const handleExistingSwipe = async (swiperId: string, swipedId: string, _action: 'like' | 'dislike'): Promise<SwipeResult> => {
    try {
        const existingMatch = await Match.findOne({
            users: { $all: [swiperId, swipedId] }
        });

        if (existingMatch) {
            // For matches, we can't update the action - it's already a match
            return { isMatch: true, message: 'Already matched' };
        }

        return { isMatch: false, message: 'No existing swipe' };
    } catch (error) {
        console.error('Error handling existing swipe:', error);
        return { isMatch: false, message: 'Error occurred' };
    }
};