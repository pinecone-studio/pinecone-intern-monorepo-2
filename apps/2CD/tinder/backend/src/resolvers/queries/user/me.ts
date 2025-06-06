import User from '../../../models/user';
import { Profile } from '../../../models/profile';
import Match from '../../../models/match';
import Like from '../../../models/like';
import Message from '../../../models/message';

export const me = async (_parent: unknown, args: { clerkId: string }) => {
  const { clerkId } = args;

  const user = await User.findOne({ clerkId }).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }

  const profile = await Profile.findOne({ userId: user._id });
  const matches = await Match.find({ users: user._id }).populate('users');
  const likesFrom = await Like.find({ from: user._id }).populate('to');
  const likesTo = await Like.find({ to: user._id }).populate('from');
  
  const matchIds = matches.map(match => match._id);
  const messages = await Message.find({ match: { $in: matchIds } })
    .populate('sender')
    .sort({ createdAt: -1 });
  
  return {
    ...user.toObject(),
    profile,
    matches,
    likesFrom,
    likesTo,
    messages
  };
};
