import { GraphQLError } from "graphql"
import { Comment, PostModel } from "src/models"

interface CreateCommentInput {
  author: string
  postId: string
  content: string
  replyId?: string[] 
  likes?: string[]   
}

const validateInput = (input: CreateCommentInput): void => {
  if (!input.author) {
    throw new GraphQLError("User is not authenticated")
  }
  if (!input.postId) {
    throw new GraphQLError("postId is required!")
  }
  if (!input.content) {
    throw new GraphQLError("content is empty")
  }
}

export const createComment = async (
  _: unknown,
  { input }: { input: CreateCommentInput }
) => {
  try {
    validateInput(input)

    const { author, postId, content, } = input

    const comment = await Comment.create({
      author,
      postId,
      content,
    })
await PostModel.findByIdAndUpdate({postId},{$push:{comments:comment}})
    return comment
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error
    }
    throw new GraphQLError(
      "Failed to create comment:"+(error instanceof Error ? error.message : JSON.stringify(error))
    )
  }
}
