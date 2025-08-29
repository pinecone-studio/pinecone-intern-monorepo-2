import { Types } from 'mongoose';
import { ProfileModel, Match, User } from '../models';

export interface SwipeData {
    swiperId: string;
    swipedId: string;
    action: 'like' | 'dislike';
}

export interface MatchData {
    users: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SwipeResult {
    isMatch: boolean;
    message?: string;
    matchData?: MatchData;
}

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

export const checkProfilesAndMatch = async (swiperId: string, swipedId: string): Promise<SwipeResult> => {
    try {
        const swiperProfile = await ProfileModel.findOne({ userId: swiperId });
        const swipedProfile = await ProfileModel.findOne({ userId: swipedId });

        if (!swiperProfile || !swipedProfile) {
            return { isMatch: false, message: 'Profile not found' };
        }

        // Check if swiped user has swiped on swiper
        const existingSwipe = await Match.findOne({
            users: { $all: [swipedId, swiperId] },
            action: 'like'
        });

        if (existingSwipe) {
            // It's a match!
            const matchData: MatchData = {
                users: [swiperId, swipedId],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            return { isMatch: true, message: 'It\'s a match!', matchData };
        }

        return { isMatch: false, message: 'No match yet' };
    } catch (error) {
        console.error('Error checking profiles and match:', error);
        return { isMatch: false, message: 'Error occurred' };
    }
};

export const syncExistingMatches = async (userId: string): Promise<void> => {
    try {
        const userMatches = await Match.find({ users: userId });

        for (const match of userMatches) {
            const otherUserId = match.likeduserId.toString() === userId ? match.matcheduserId.toString() : match.likeduserId.toString();
            if (otherUserId) {
                // Sync match data if needed
                console.log(`Syncing match between ${userId} and ${otherUserId}`);
            }
        }
    } catch (error) {
        console.error('Error syncing existing matches:', error);
    }
};

export const findNextAvailableProfile = async (userId: string, excludeIds: string[] = []): Promise<any> => {
    try {
        const userProfile = await ProfileModel.findOne({ userId });
        if (!userProfile) return null;

        const query: any = {
            userId: { $ne: userId, $nin: excludeIds },
            gender: userProfile.gender || 'BOTH'
        };

        if (userProfile.interests && userProfile.interests.length > 0) {
            query.interests = { $in: userProfile.interests };
        }

        return await ProfileModel.findOne(query);
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

export const handleExistingSwipe = async (swiperId: string, swipedId: string, action: 'like' | 'dislike'): Promise<SwipeResult> => {
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

export const handleNewLike = async (swiperId: string, swipedId: string): Promise<SwipeResult> => {
    try {
        const newMatch = new Match({
            users: [swiperId, swipedId],
            action: 'like',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newMatch.save();

        // Check if it's a match
        const isMatch = await checkIfMatched(swiperId, swipedId);

        if (isMatch) {
            return { isMatch: true, message: 'It\'s a match!' };
        }

        return { isMatch: false, message: 'Like recorded' };
    } catch (error) {
        console.error('Error handling new like:', error);
        return { isMatch: false, message: 'Error occurred' };
    }
};

export const getSwipedUserIds = async (userId: string): Promise<string[]> => {
    try {
        const swipes = await Match.find({
            $or: [{ likeduserId: userId }, { matcheduserId: userId }]
        });
        return swipes.map(swipe => {
            const otherUserId = swipe.likeduserId.toString() === userId ? swipe.matcheduserId.toString() : swipe.likeduserId.toString();
            return otherUserId;
        });
    } catch (error) {
        console.error('Error getting swiped user IDs:', error);
        return [];
    }
}; 