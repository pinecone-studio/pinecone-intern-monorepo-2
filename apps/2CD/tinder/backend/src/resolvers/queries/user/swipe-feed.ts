import { GraphQLError } from 'graphql';
import User from '../../../models/user';
import Dislike from '../../../models/dislike';
import { Types } from 'mongoose';

interface SwipeFeedArgs {
  limit: number;
  excludeIds: string[];
  userId: string;
}

export const getSwipeFeed = async (_: unknown, { limit, excludeIds, userId }: SwipeFeedArgs) => {
  try {
    const dislikedUsers = await Dislike.find({ sender: userId })
      .select('receiver')
      .lean();

    const dislikedUserIds = dislikedUsers.map(dislike => dislike.receiver.toString());
    
    const allExcludedIds = [...new Set([...excludeIds, ...dislikedUserIds])];

    // Filter out invalid ObjectIds
    const validExcludedIds = allExcludedIds.filter(id => {
      try {
        new Types.ObjectId(id);
        return true;
      } catch {
        return false;
      }
    });

    const users = await User.aggregate([
      {
        $match: {
          _id: { $nin: validExcludedIds.map((id: string) => new Types.ObjectId(id)) },
        },
      },
      {
        $sample: { size: limit },
      },
    ]);

    if (!users.length) {
      return [];
    }

    const populatedUsers = await User.find({ _id: { $in: users.map((user: { _id: Types.ObjectId }) => user._id) } })
      .populate({
        path: 'profile',
        select: 'bio photos location',
      })
      .lean();

    return populatedUsers;
  } catch (error) {
    throw new GraphQLError('Алдаа гарлаа', {
      extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error },
    });
  }
};
