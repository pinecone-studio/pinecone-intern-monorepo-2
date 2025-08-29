import { Types } from "mongoose";
import { GraphQLError } from "graphql";
import { User, ProfileModel, Message, Match } from "../../models";
import { formatConversation } from "../../utils/get-conversations.formatting";
import { validateUserId } from "../../utils/get-conversations.validation";
import { ERRORS } from "../../types/get-conversations.types";

const createConversationForMatch = async (match: any, userProfile: any, userId: string) => {
    // Determine the other user in the conversation
    const otherUserId = match.likeduserId.equals(userProfile._id)
        ? match.matcheduserId
        : match.likeduserId;

    // Get the other user's profile
    const otherProfile = await ProfileModel.findById(otherUserId);
    if (!otherProfile) return null;

    // Get the other user's basic info
    const otherUser = await User.findById(otherProfile.userId);
    if (!otherUser) return null;

    // Get messages between these two users
    const messages = await Message.find({
        $or: [
            { sender: otherUser._id, receiver: new Types.ObjectId(userId) },
            { sender: new Types.ObjectId(userId), receiver: otherUser._id }
        ]
    }).sort({ createdAt: -1 });

    return formatConversation(otherUser, otherProfile, messages);
};

const fetchUserConversations = async (userId: string) => {
    // First, get the user's profile to find their matches
    const userProfile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });

    if (!userProfile) {
        throw new GraphQLError(ERRORS.USER_NOT_FOUND, {
            extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
    }

    // Get all matches for this user
    const matches = await Match.find({
        $or: [
            { likeduserId: userProfile._id },
            { matcheduserId: userProfile._id }
        ]
    });

    if (matches.length === 0) {
        return [];
    }

    // Get conversation data for each match
    const conversations = await Promise.all(
        matches.map(match => createConversationForMatch(match, userProfile, userId))
    );

    // Filter out null conversations and return
    return conversations.filter((conv: any) => conv !== null);
};

const validateUserIdInput = (userId: string): void => {
    if (typeof userId !== 'string' || !userId) {
        throw new GraphQLError(ERRORS.INVALID_USER_ID, {
            extensions: { code: "BAD_USER_INPUT" },
        });
    }
};

const handleConversationsError = (error: unknown): never => {
    if (error instanceof GraphQLError) {
        throw error;
    }
    console.error("Unexpected error in getConversations:", error);
    throw new GraphQLError(ERRORS.FETCH_FAILED, {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
};

export const getConversations = async (
    _: unknown,
    { userId }: { userId: string },
    _context: unknown,
    _info: unknown
) => {
    try {
        validateUserIdInput(userId);
        validateUserId(userId);
        const conversations = await fetchUserConversations(userId);

        if (conversations.length === 0) {
            return [];
        }

        return conversations;
    } catch (error) {
        return handleConversationsError(error);
    }
}; 