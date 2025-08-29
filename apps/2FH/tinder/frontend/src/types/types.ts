export interface MatchedUser {
    id: string;
    userId: string;
    name: string;
    gender: string;
    bio: string;
    interests: string[];
    profession: string;
    work: string;
    images: string[];
    dateOfBirth: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    sender?: {
        id: string;
        email?: string;
    } | null;
    receiver?: {
        id: string;
        email?: string;
    } | null;
} 