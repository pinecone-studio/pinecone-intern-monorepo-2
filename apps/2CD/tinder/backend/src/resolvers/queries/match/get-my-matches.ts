import Match from 'src/models/match';

export const getMyMatches = async (_: any, __: any, context: any) => {
  const { userId } = context;
  if (!userId) throw new Error('Unauthorized');

  const matches = await Match
    .find({ users: userId })
    .populate('users')
    .exec();

  return matches;
};
