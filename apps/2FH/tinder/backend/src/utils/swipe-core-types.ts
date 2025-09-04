import { ProfileType } from '../models';
import { Document, Types } from 'mongoose';

type ProfileDocument = Document<unknown, any, ProfileType> & ProfileType & { _id: Types.ObjectId };

export interface SwipeInput {
    swiperId: string;
    targetId: string;
    action: 'LIKE' | 'DISLIKE' | 'SUPER_LIKE';
}

export interface SwipeResult {
    success: boolean;
    message: string;
    response: 'SUCCESS' | 'ERROR' | 'ALREADY_SWIPED' | 'MATCH_CREATED' | 'NO_MORE_PROFILES';
    match?: {
        likeduserId?: ProfileDocument;
        matcheduserId?: ProfileDocument;
    };
    nextProfile?: ProfileDocument;
}