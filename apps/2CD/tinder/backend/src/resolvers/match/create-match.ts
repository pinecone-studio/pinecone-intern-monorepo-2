import Match from 'src/models/match';
 
type CreateMatchArgs = {
  userId: string;
};
 
type Context = {
  user?: { _id: string | null };
};
 
export const createMatch = async (_: unknown, { userId }: CreateMatchArgs, { user }: Context) => {
  if (!user || !user._id) {
    throw new Error('Unauthorized');
  }
 
  const existingMatch = await Match.findOne({
    users: { $all: [user._id, userId] },
  });
 
  if (existingMatch) {
    return existingMatch;
  }
 
  const newMatch = await Match.create({
    users: [user._id, userId],
  });
 
  return newMatch;
};
 