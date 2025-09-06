import { ProfileType } from '../models';
import { Document, Types } from 'mongoose';

type ProfileDocument = Document<unknown, any, ProfileType> & ProfileType & { _id: Types.ObjectId };

export interface SwipeData {
    swiperId: string;
    swipedId: string;
    action: 'like' | 'dislike';
}

export interface MatchData {
    users: string[];
    createdAt: Date;
    updatedAt: Date;
    likeduserId?: ProfileDocument;
    matcheduserId?: ProfileDocument;
}

export interface SwipeResult {
    isMatch: boolean;
    message?: string;
    matchData?: MatchData;
}