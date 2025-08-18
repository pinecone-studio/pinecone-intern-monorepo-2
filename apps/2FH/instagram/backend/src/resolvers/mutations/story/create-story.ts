import { Story } from "src/models";
import { GraphQLError } from "graphql";

interface CreateStoryInput {
    image: string;
    author: string
}

const validateInput = (input: CreateStoryInput): void => {
    if (!input.author) {
        throw new GraphQLError("User is not authenticated");
    }
    if (!input.image) {
        throw new GraphQLError("Image is required");
    }
};

const handleError = (error: unknown): never => {
    if (error instanceof GraphQLError) {
        throw error;
    }
    
    throw new GraphQLError(
        "Failed to create story" + (error instanceof Error ? error.message : "Error")
    );
};

export const createStory = async(
    _: unknown, 
    { input }: { input: CreateStoryInput }, 
) => {
    try {
        validateInput(input);
        
        const { image, author } = input;
        const newStory = await Story.create({ author, image });
        return newStory;
    } catch (error) {
        handleError(error);
    }
};