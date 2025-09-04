import { Types, Document } from 'mongoose';
import { Swipe, ProfileType } from '../models';
import { 
    checkIfMatched, 
    handleNewLike, 
    handleExistingSwipe,
    findNextAvailableProfile 
} from './swipe-helpers';
import { SwipeInput, SwipeResult } from './swipe-core-types';

type ProfileDocument = Document<unknown, any, ProfileType> & ProfileType & { _id: Types.ObjectId };

export const createSwipeRecord = async (input: SwipeInput): Promise<void> => {
    const swipeRecord = new Swipe({
        swiperId: new Types.ObjectId(input.swiperId),
        targetId: new Types.ObjectId(input.targetId),
        action: input.action,
        swipedAt: new Date()
    });
    
    await swipeRecord.save();
};

export const handleDislike = async (swiperId: string, targetId: string): Promise<SwipeResult> => {
    try {
        await createSwipeRecord({ swiperId, targetId, action: 'DISLIKE' });
        return {
            success: true,
            message: 'Dislike recorded',
            response: 'SUCCESS'
        };
    } catch (error) {
        console.error('Error handling dislike:', error);
        return {
            success: false,
            message: 'Error recording dislike',
            response: 'ERROR'
        };
    }
};

export const checkAlreadyMatched = async (swiperId: string, targetId: string): Promise<SwipeResult | null> => {
    const isAlreadyMatched = await checkIfMatched(swiperId, targetId);
    if (isAlreadyMatched) {
        return {
            success: true,
            message: 'Already matched',
            response: 'ALREADY_SWIPED'
        };
    }
    return null;
};

export const checkExistingSwipe = async (swiperId: string, targetId: string): Promise<SwipeResult | null> => {
    const existingSwipeResult = await handleExistingSwipe(swiperId, targetId, 'like');
    if (existingSwipeResult.isMatch) {
        return {
            success: true,
            message: existingSwipeResult.message || 'Already matched',
            response: 'ALREADY_SWIPED',
            match: existingSwipeResult.matchData
        };
    }
    return null;
};

export const processNewLike = async (swiperId: string, targetId: string): Promise<SwipeResult> => {
    const likeResult = await handleNewLike(swiperId, targetId);
    
    if (likeResult.isMatch) {
        await createSwipeRecord({ swiperId, targetId, action: 'LIKE' });
        return {
            success: true,
            message: likeResult.message || 'It\'s a match!',
            response: 'MATCH_CREATED',
            match: likeResult.matchData
        };
    } else {
        await createSwipeRecord({ swiperId, targetId, action: 'LIKE' });
        return {
            success: true,
            message: likeResult.message || 'Like recorded',
            response: 'SUCCESS'
        };
    }
};

export const handleLike = async (swiperId: string, targetId: string): Promise<SwipeResult> => {
    try {
        const alreadyMatched = await checkAlreadyMatched(swiperId, targetId);
        if (alreadyMatched) return alreadyMatched;

        const existingSwipe = await checkExistingSwipe(swiperId, targetId);
        if (existingSwipe) return existingSwipe;

        return await processNewLike(swiperId, targetId);
    } catch (error) {
        console.error('Error handling like:', error);
        return {
            success: false,
            message: 'Error processing like',
            response: 'ERROR'
        };
    }
};

export const getNextProfile = async (swiperId: string): Promise<ProfileDocument | null> => {
    try {
        // Get all swiped user IDs to exclude them
        const swipedUserIds: string[] = [];
        const swipes = await Swipe.find({ swiperId: new Types.ObjectId(swiperId) });
        swipedUserIds.push(...swipes.map(swipe => swipe.targetId.toString()));
        
        return await findNextAvailableProfile(swiperId, swipedUserIds);
    } catch (error) {
        console.error('Error getting next profile:', error);
        return null;
    }
};