// // import { Story } from "src/models";
// import { GraphQLError } from "graphql";

// interface CreateTaskInput {
//     image: string;
//     author: string;
// }

// export const createStory = async(_:unknown, {input}: {input:CreateTaskInput}) => {
//     try {
//         const {author, image} = input;

//         if(!author || !image){
//             throw new GraphQLError("taskName, description, and userId are required fields");
//         }
//     } catch (error) {
//         if(GraphQLError) {
//             throw error
//         }
//     }
// }