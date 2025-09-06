import { Types } from 'mongoose';
import { Profile, Match } from '../models';
import { SwipeResult } from './swipe-types';

const addLikeToProfile = async (swiperObjectId: Types.ObjectId, swipedObjectId: Types.ObjectId): Promise<void> => {
    // Add the swiper's ID to the target user's likes array
    await Profile.findOneAndUpdate(
        { userId: swipedObjectId },
        { $addToSet: { likes: swiperObjectId } }
    );
};

const checkForMutualLike = async (swiperObjectId: Types.ObjectId, swipedObjectId: Types.ObjectId): Promise<boolean> => {
    // Check if the swiped user has already liked the swiper (mutual like)
    const swipedProfile = await Profile.findOne({ userId: swipedObjectId });
    return swipedProfile?.likes.some(likeId => likeId.toString() === swiperObjectId.toString()) || false;
};

const createMatchRecord = async (swiperId: string, swipedId: string): Promise<void> => {
    const newMatch = new Match({
        users: [swiperId, swipedId],
        action: 'like',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    await newMatch.save();
};

const addMatchToProfiles = async (swiperObjectId: Types.ObjectId, swipedObjectId: Types.ObjectId): Promise<void> => {
    await Promise.all([
        Profile.findOneAndUpdate(
            { userId: swiperObjectId },
            { $addToSet: { matches: swipedObjectId } }
        ),
        Profile.findOneAndUpdate(
            { userId: swipedObjectId },
            { $addToSet: { matches: swiperObjectId } }
        )
    ]);
};

const processMutualLike = async (swiperId: string, swipedId: string, swiperObjectId: Types.ObjectId, swipedObjectId: Types.ObjectId): Promise<SwipeResult> => {
    await addMatchToProfiles(swiperObjectId, swipedObjectId);
    await createMatchRecord(swiperId, swipedId);

    const [swiperProfile, swipedProfile] = await Promise.all([
        Profile.findOne({ userId: swiperObjectId }),
        Profile.findOne({ userId: swipedObjectId })
    ]);

    return { 
        isMatch: true, 
        message: 'It\'s a match!',
        matchData: {
            users: [swiperId, swipedId],
            createdAt: new Date(),
            updatedAt: new Date(),
            likeduserId: swiperProfile || undefined,
            matcheduserId: swipedProfile || undefined
        }
    };
};

export const handleNewLike = async (swiperId: string, swipedId: string): Promise<SwipeResult> => {
    try {
        const swiperObjectId = new Types.ObjectId(swiperId);
        const swipedObjectId = new Types.ObjectId(swipedId);

        await addLikeToProfile(swiperObjectId, swipedObjectId);
        const isMutualLike = await checkForMutualLike(swiperObjectId, swipedObjectId);

        if (isMutualLike) {
            return await processMutualLike(swiperId, swipedId, swiperObjectId, swipedObjectId);
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