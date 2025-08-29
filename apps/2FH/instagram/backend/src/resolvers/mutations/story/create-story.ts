import { Story } from "src/models";
import { User } from "src/models/user";
import { GraphQLError } from "graphql";
import { Types } from "mongoose";

interface CreateStoryInput {
    image: string;
}

const validateInput = (input: CreateStoryInput): void => {
    if (!input.image || !input.image.trim()) {
        throw new GraphQLError("Image is required");
    }
};

const getExpiredAt = (): Date => {
    const now = new Date();
    const expiredAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); 
    return expiredAt;
};

const updateUserStory = async (userId: string, storyId: string): Promise<void> => {
    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { $push: { stories: storyId } }, 
        { new: true }
    );
    
    if (!updatedUser) {
        throw new GraphQLError("Failed to update user with new story");
    }
};

const validateUserAuthentication = (userId: string): void => {
    if (!userId) {
        throw new GraphQLError("User is not authenticated");
    }
};

const validateUserExists = async (userId: string): Promise<void> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new GraphQLError("User not found");
    }
};

const handleError = (error: unknown): never => {
    if (error instanceof GraphQLError) {
        throw error;
    }
    
    throw new GraphQLError(
        "Failed to create story: " + (error instanceof Error ? error.message : "Unknown error")
    );
};

export const createStory = async (
    _: unknown,
    { input }: { input: CreateStoryInput },
    context: { userId: string }
) => {
    try {
        const authorId = context.userId;
        
        validateUserAuthentication(authorId);
        await validateUserExists(authorId);
        validateInput(input);
        
        const { image } = input;
        const expiredAt = getExpiredAt();
        
        const newStory = await Story.create({
            author: new Types.ObjectId(authorId),
            image,
            expiredAt
        });
        
        await updateUserStory(authorId, newStory._id.toString());
        
        return newStory;
    } catch (error) {
        handleError(error);
    }
};