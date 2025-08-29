import { GraphQLError } from 'graphql';
import { PostModel, User, PostSchemaType } from 'src/models';
import { HydratedDocument } from 'mongoose';

type PostDocument = HydratedDocument<PostSchemaType>;

interface Context {
  user?: {
    id: string;
    username: string;
  };
}

const validateUser = (context: Context) => {
  if (!context.user) throw new GraphQLError('User not authenticated');
};
const  getPost= async(context: Context) =>{

  const userId = context.user!.id;

  const user = await User.findById(userId).select('followings');

  if (!user || !user.followings || user.followings.length === 0) return [];

  const posts = await PostModel.find({ author: { $in: user.followings } })
    .populate([
      {
        path: 'comments',
        populate: [{ path: 'author', select: 'username profileImage  _id' }, { path: 'likes', select: 'username profileImage' }, { path: 'content' }],
      },
      { path: 'author', select: 'username profileImage _id ' },
      { path: 'likes', select: 'username profileImage ' },
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
