import { Story } from "src/models";
import { GraphQLError } from "graphql";

interface DeleteStoryInput {
    _id: string;
    author: string; 
}

const validateDeleteInput = (input: DeleteStoryInput): void => {
    if (!input.author) {
        throw new GraphQLError("User is not authenticated");
    }
    if (!input._id || !input._id.trim()) {
        throw new GraphQLError("Story ID is required");
    }
};

const handleError = (error: unknown): never => {
    if (error instanceof GraphQLError) {
        throw error;
    }
        
    throw new GraphQLError(
        "Failed to delete story: " + (error instanceof Error ? error.message : "Unknown error")
    );
};

const checkStoryExists = async (storyId: string) => {
    const existingStory = await Story.findById(storyId);
    if (!existingStory) {
        throw new GraphQLError("Story not found");
    }
    return existingStory;
};

const checkStoryOwnership = (story: { author: { toString(): string } }, authorId: string) => {
    if (story.author.toString() !== authorId) {
        throw new GraphQLError("Not authorized to delete this story");
    }
};

const performStoryDeletion = async (storyId: string) => {
    const deletedStory = await Story.findByIdAndDelete(storyId);
    return deletedStory ? true : false;
};

export const deleteStory = async (
    _: unknown,
    { _id }: { _id: string },
    context: { user?: { id: string } } 
) => {
    try {
        const author = context.user?.id;
        
        validateDeleteInput({ _id, author: author || "" });

        const existingStory = await checkStoryExists(_id);
        checkStoryOwnership(existingStory, author!);
        
        return await performStoryDeletion(_id);
    } catch (error) {
        handleError(error);
    }
};