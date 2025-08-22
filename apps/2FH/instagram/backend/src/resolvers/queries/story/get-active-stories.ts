import { GraphQLError } from 'graphql';
import { FollowRequest, FollowRequestStatus, Story, StorySchemaType } from 'src/models';

interface Context {
  user?: {
    id: string;
    username: string;
  };
}

const validateUser = (context: Context): void => {
  if (!context.user) {
    throw new GraphQLError('User not authenticated');
  }
};

const getFollowedUserIds = async (userId: string): Promise<string[]> => {
  const followRequests = await FollowRequest.find({
    requesterId: userId,
    status: FollowRequestStatus.ACCEPTED,
  }).select('receiverId');

  return followRequests.filter((req) => req && req.receiverId).map((req) => req.receiverId.toString());
};

export const getActiveStories = async (_: unknown, __: unknown, context: Context): Promise<StorySchemaType[]> => {
  validateUser(context);

  try {
    const followedUserIds = await getFollowedUserIds(context.user!.id);

    if (followedUserIds.length === 0) {
      return [];
    }

    const now = new Date();
    const stories = await Story.find({
      author: { $in: followedUserIds },
      $or: [{ expiredAt: { $exists: false } }, { expiredAt: null }, { expiredAt: { $gt: now } }],
    })
      .populate('author', 'userName profileImage')
      .populate('viewers', 'userName profileImage')
      .sort({ createdAt: -1 });

    return stories;
  } catch (error) {
    throw new GraphQLError('Failed to fetch active stories' + (error instanceof Error ? `: ${error.message}` : ''));
  }
};
