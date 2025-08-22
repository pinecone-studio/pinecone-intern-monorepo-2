import { GraphQLError } from 'graphql';
import { EditProfile } from 'src/models/edit-profile';

type Ctx = { userId?: string };

export const getMyProfile = async (_: unknown, __: unknown, ctx: Ctx) => {
  if (!ctx.userId) {
    throw new GraphQLError('User is not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
  }
  const me = await EditProfile.findById(ctx.userId);
  if (!me) {
    throw new GraphQLError('User not found', { extensions: { code: 'NOT_FOUND' } });
  }
  return me;
};
