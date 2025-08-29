import { Types } from 'mongoose';
import { ConversationOutput } from '../types/get-conversations.types';

export interface ConversationData {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    name: string;
    gender: string;
    bio: string;
    interests: string[];
    profession: string;
    likes: Types.ObjectId[];
    matches: Types.ObjectId[];
    work: string;
    images: string[];
    dateOfBirth: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserData {
    _id: Types.ObjectId;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MessageData {
    _id: Types.ObjectId;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    content: string;
    createdAt: Date;
}

export const formatConversation = (
    user: UserData,
    profile: ConversationData,
    messages: MessageData[]
): ConversationOutput => {
    return {
        user: {
            id: user._id.toString(),
            email: user.email,
            password: user.password,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        },
        profile: {
            id: profile._id.toString(),
            userId: profile.userId.toString(),
            name: profile.name,
            gender: profile.gender,
            bio: profile.bio,
            interests: profile.interests,
            profession: profile.profession,
            likes: profile.likes.map(id => id.toString()),
            matches: profile.matches.map(id => id.toString()),
            work: profile.work,
            images: profile.images,
            dateOfBirth: profile.dateOfBirth,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString(),
        },
        messages: messages.map(message => ({
            id: message._id.toString(),
            sender: {
                id: message.sender.toString(),
                email: '', // Will be populated if needed
                password: '',
                createdAt: '',
                updatedAt: '',
            },
            receiver: {
                id: message.receiver.toString(),
                email: '', // Will be populated if needed
                password: '',
                createdAt: '',
                updatedAt: '',
            },
            content: message.content,
            createdAt: message.createdAt.toISOString(),
        })),
    };
}; 