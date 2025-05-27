import Match from 'src/models/match';
import { UserType } from 'src/models/user';

export const getMatchById = async (_: any, args: any) => {
  const { _id } = args;

  const match = await Match.findById(_id).populate<{ users: UserType[] }>('users');

  if (!match) {
    throw new Error('Match not found');
  }

  return match;
};
