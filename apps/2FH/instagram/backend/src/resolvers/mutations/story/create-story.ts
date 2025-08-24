import { Story, User } from "src/models";
import { GraphQLError } from "graphql";

interface CreateStoryInput {
    image: string;
    author: string;
}

const validateInput = (input: CreateStoryInput): void => {
    if (!input.image || !input.image.trim()) {
        throw new GraphQLError("Image is required");
    }
};

const handleError = (error: unknown): never => {
    if (error instanceof GraphQLError) {
        throw error;
    }
    
    throw new GraphQLError(
        "Failed to create story " + (error instanceof Error ? error.message : "Error")
    );
};

export const createStory = async(
    _: unknown, 
    { input }: { input: CreateStoryInput }
): Promise<any> => {
    try {
        const { image, author } = input;
        
        validateInput(input);
        if (!author) {
            throw new GraphQLError("User is not authenticated");
        }

        const user = await User.findById({ _id: author });
        if (!user) {
            throw new GraphQLError("User not found");
        }
        const newStory = await Story.create({ author, image });
        return newStory;
    } catch (error) {
        handleError(error);
    }
};