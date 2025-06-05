import Match from 'src/models/match';

export const getMatchById = async (_: any, args: any) => {
  const { _id } = args;

  const match = await Match.findById(_id).populate('users');

  if (!match) {
    throw new Error('Match not found');
  }

  return match;
};
