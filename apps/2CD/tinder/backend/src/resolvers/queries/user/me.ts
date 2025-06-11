import { GraphQLError } from 'graphql';
import User from '../../../models/user';
import { Profile } from '../../../models/profile';
import Match from '../../../models/match';
import Like from '../../../models/like';
import Dislike from '../../../models/dislike';
import Message from '../../../models/message';
import { Context } from '../../../types/context';
import { Document } from 'mongoose';

interface UserContext {
  id: string;
}

interface UserData {
  user: Document | null;
  profile: Document | null;
  matches: Document[];
  likesFrom: Document[];
  likesTo: Document[];
  dislikesFrom: Document[];
  dislikesTo: Document[];
  messages: Document[];
}

function validateUserContext(context: Context): UserContext {
  const userContext = context.user as UserContext | undefined;
  if (!userContext?.id) {
    throw new GraphQLError('Нэвтрээгүй байна', {
      extensions: { code: 'UNAUTHORIZED' }
    });
  }
  return userContext;
}

function validateUser(user: Document | null): Document {
  if (!user) {
    throw new GraphQLError('Хэрэглэгч олдсонгүй', {
      extensions: { code: 'NOT_FOUND' }
    });
  }
  return user;
}

function mapDocumentsToObjects(documents: Document[]): Record<string, unknown>[] {
  return documents?.map((doc: Document) => doc.toObject()) || [];
}

async function fetchUserData(userId: string): Promise<UserData> {
  const [user, profile, matches, likesFrom, likesTo, dislikesFrom, dislikesTo, messages] = await Promise.all([
    User.findById(userId),
    Profile.findOne({ userId }),
    Match.find({ $or: [{ user1Id: userId }, { user2Id: userId }] }),
    Like.find({ fromUserId: userId }),
    Like.find({ toUserId: userId }),
    Dislike.find({ fromUserId: userId }),
    Dislike.find({ toUserId: userId }),
    Message.find({ $or: [{ fromUserId: userId }, { toUserId: userId }] })
  ]);

  return {
    user,
    profile,
    matches,
    likesFrom,
    likesTo,
    dislikesFrom,
    dislikesTo,
    messages
  };
}

function formatUserResponse(user: Document, data: Omit<UserData, 'user'>): Record<string, unknown> {
  return {
    ...user.toObject(),
    profile: data.profile?.toObject() || null,
    matches: mapDocumentsToObjects(data.matches),
    likesFrom: mapDocumentsToObjects(data.likesFrom),
    likesTo: mapDocumentsToObjects(data.likesTo),
    dislikesFrom: mapDocumentsToObjects(data.dislikesFrom),
    dislikesTo: mapDocumentsToObjects(data.dislikesTo),
    messages: mapDocumentsToObjects(data.messages)
  };
}

export const me = async (_: unknown, __: unknown, context: Context) => {
  try {
    const userContext = validateUserContext(context);
    const { user, ...restData } = await fetchUserData(userContext.id);
    const validatedUser = validateUser(user);
    return formatUserResponse(validatedUser, restData);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Алдаа гарлаа', {
      extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error }
    });
  }
};
