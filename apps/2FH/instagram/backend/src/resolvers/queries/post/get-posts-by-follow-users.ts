import { GraphQLError } from 'graphql';
import { PostModel, User, PostSchemaType } from 'src/models';
import { HydratedDocument } from 'mongoose';

type PostDocument = HydratedDocument<PostSchemaType>;

interface Context {
  userId?: string;
}

const validateUser = (context: Context) => {
  if (!context.userId) throw new GraphQLError('User not authenticated');
};
const  getPost= async(context: Context) =>{

  const userId = context.userId!;

  const user = await User.findById(userId).select('followings');

  if (!user || !user.followings || user.followings.length === 0) return [];

  const posts = await PostModel.find({ author: { $in: user.followings } })
    .populate([
      {
        path: 'comments',
        populate: [{ path: 'likes', select: 'userName profileImage' }],
      },
      { path: 'author', select: 'userName profileImage _id ' },
      { path: 'likes', select: 'userName profileImage ' },
    ])
    .sort({ createdAt: -1 })
    .lean();

  return posts as PostDocument[];
}
export const getPostsByFollowingUsers = async (_: unknown, __: unknown, context: Context): Promise<PostDocument[]> => {
  validateUser(context);

  try {
    return await getPost(context);
  } catch (error) {
    throw new GraphQLError('Failed to fetch posts by following users' + (error instanceof Error ? `: ${error.message}` : ''));
  }
};
