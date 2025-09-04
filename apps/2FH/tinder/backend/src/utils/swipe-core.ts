import { Types } from 'mongoose';
import { Profile } from '../models';
import { validateSwipeInput } from './swipe-core-validation';
import { 
    handleDislike, 
    handleLike, 
    getNextProfile 
} from './swipe-core-handlers';
import { SwipeInput, SwipeResult } from './swipe-core-types';

const validateProfilesExist = async (input: SwipeInput): Promise<SwipeResult | null> => {
    console.log('Looking for swiper profile:', input.swiperId);
    const swiperProfile = await Profile.findOne({ userId: new Types.ObjectId(input.swiperId) });
    console.log('Swiper profile found:', !!swiperProfile);
    
    console.log('Looking for target profile:', input.targetId);
    const targetProfile = await Profile.findOne({ userId: new Types.ObjectId(input.targetId) });
    console.log('Target profile found:', !!targetProfile);
    
    if (!swiperProfile) {
        return {
            success: false,
            message: `Swiper profile not found for userId: ${input.swiperId}`,
            response: 'ERROR'
        };
    }
    
    if (!targetProfile) {
        return {
            success: false,
            message: `Target profile not found for userId: ${input.targetId}`,
            response: 'ERROR'
        };
    }
    
    return null;
};

const handleSwipeAction = async (input: SwipeInput): Promise<SwipeResult> => {
    if (input.action === 'DISLIKE') {
        return await handleDislike(input.swiperId, input.targetId);
    } else if (input.action === 'LIKE' || input.action === 'SUPER_LIKE') {
        return await handleLike(input.swiperId, input.targetId);
    } else {
        return {
            success: false,
            message: 'Invalid swipe action',
            response: 'ERROR'
        };
    }
};

const addNextProfileIfNeeded = async (result: SwipeResult, swiperId: string): Promise<SwipeResult> => {
    if (result.success && result.response === 'SUCCESS') {
        const nextProfile = await getNextProfile(swiperId);
        if (nextProfile) {
            result.nextProfile = nextProfile;
        } else {
            result.response = 'NO_MORE_PROFILES';
            result.message = 'No more profiles available';
        }
    }
    return result;
};

const handleValidationError = (validationError: string): SwipeResult => {
    console.log('Validation error:', validationError);
    return {
        success: false,
        message: validationError,
        response: 'ERROR'
    };
};

const processSwipeRequest = async (input: SwipeInput): Promise<SwipeResult> => {
    // Check if profiles exist
    const profileError = await validateProfilesExist(input);
    if (profileError) return profileError;

    // Handle different swipe actions
    const result = await handleSwipeAction(input);

    // Get next profile if successful
    return await addNextProfileIfNeeded(result, input.swiperId);
};

const handleSwipeError = (error: unknown): SwipeResult => {
    console.error('Error in swipe mutation:', error);
    return {
        success: false,
        message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        response: 'ERROR'
    };
};

export const swipe = async (_: unknown, { input }: { input: SwipeInput }): Promise<SwipeResult> => {
    try {
        console.log('Swipe mutation called with input:', input);
        
        // Validate input
        const validationError = validateSwipeInput(input);
        if (validationError) {
            return handleValidationError(validationError);
        }

        const result = await processSwipeRequest(input);
        console.log('Swipe result:', result);
        return result;
    } catch (error) {
        return handleSwipeError(error);
    }
};