import { SwipeInput } from './swipe-core-types';

export const checkRequiredFields = (input: SwipeInput): string | null => {
    if (!input.swiperId || !input.targetId || !input.action) {
        return 'Missing required fields: swiperId, targetId, or action';
    }
    return null;
};

export const checkSelfSwipe = (input: SwipeInput): string | null => {
    if (input.swiperId === input.targetId) {
        return 'Cannot swipe on yourself';
    }
    return null;
};

export const validateSwipeInput = (input: SwipeInput): string | null => {
    const requiredFieldsError = checkRequiredFields(input);
    if (requiredFieldsError) return requiredFieldsError;
    
    const selfSwipeError = checkSelfSwipe(input);
    if (selfSwipeError) return selfSwipeError;
    
    return null;
};