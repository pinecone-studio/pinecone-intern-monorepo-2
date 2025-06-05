import User from 'src/models/user';
import Match from 'src/models/match';

export const getMyMatches = async (_: any, __: any, context: any) => {
  const { clerkId } = context;
  if (!clerkId) throw new Error('Unauthorized');

  const user = await User.findOne({ clerkId });
  if (!user) throw new Error('User not found');

  const matches = await Match
    .find({ users: user._id }) 
    .populate('users')
    .exec();

  return matches;
};
