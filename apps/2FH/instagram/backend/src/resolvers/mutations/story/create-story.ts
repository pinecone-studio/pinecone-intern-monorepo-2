import { Story } from "src/models";
import { GraphQLError } from "graphql";

interface CreateStoryInput {
    image: string;
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
        "Failed to create story" + (error instanceof Error ? error.message : "Error")
    );
};

export const createStory = async(
    _: unknown, { input }: { input: CreateStoryInput }, context: {userId: string}
) => {
    try {

       const author = context.userId;

        if(!author) {throw new GraphQLError("User is not authenticated");}

        validateInput(input);

        
        const { image } = input;
        const newStory = await Story.create({ author, image });
        return newStory;
    } catch (error) {
        handleError(error);
    }
};