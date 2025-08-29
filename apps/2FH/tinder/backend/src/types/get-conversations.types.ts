import { Types } from 'mongoose';

export interface ConversationOutput {
    user: {
        id: string;
        email: string;
        password: string;
        createdAt: string;
        updatedAt: string;
    };
    profile: {
        id: string;
        userId: string;
        name: string;
        gender: string;
        bio: string;
        interests: string[];
        profession: string;
        likes: string[];
        matches: string[];
        work: string;
        images: string[];
        dateOfBirth: string;
        createdAt: string;
        updatedAt: string;
    };
    messages: Array<{
        id: string;
        sender: {
            id: string;
            email: string;
            password: string;
            createdAt: string;
            updatedAt: string;
        };
        receiver: {
            id: string;
            email: string;
            password: string;
            createdAt: string;
            updatedAt: string;
        };
        content: string;
        createdAt: string;
    }>;
}

export interface ConversationInput {
    userId: string;
    limit?: number;
    offset?: number;
}

export interface Match {
    _id: Types.ObjectId;
    likeduserId: Types.ObjectId;
    matcheduserId: Types.ObjectId;
    matchedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Profile {
    _id: Types.ObjectId;
    name: string;
    bio: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'both';
    images: string[];
    interests: string[];
    profession: string;
    work: string;
    userId: Types.ObjectId;
    likes: Types.ObjectId[];
    matches: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export const ERRORS = {
    FETCH_FAILED: "Failed to fetch conversations",
    INVALID_USER_ID: "Invalid user ID",
    USER_NOT_FOUND: "User not found",
    PROFILE_NOT_FOUND: "Profile not found",
    UNAUTHORIZED: "Unauthorized access",
    VALIDATION_ERROR: "Validation error",
    INTERNAL_ERROR: "Internal server error"
} as const;

export type ErrorType = keyof typeof ERRORS; 