import { GraphQLError } from 'graphql';
import User from '../../../models/user';
import { Profile } from '../../../models/profile';
import Match from '../../../models/match';
import Like from '../../../models/like';
import Message from '../../../models/message';
import { Types, Document } from 'mongoose';

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  toObject: () => any;
}

interface IProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  bio: string;
  age: number;
}

interface IMatch extends Document {
  _id: Types.ObjectId;
  users: IUser[];
}

interface ILike extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
}

interface IMessage extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
}

interface IEnrichedUser {
  _id: string;
  name: string;
  email: string;
  profile: IProfile | null;
  matches: IMatch[];
  likesFrom: ILike[];
  likesTo: ILike[];
  messages: IMessage[];
}

interface ILeanProfile {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  bio: string;
  age: number;
}

interface ILeanMatch {
  _id: Types.ObjectId;
  users: IUser[];
}

interface ILeanLike {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
}

interface ILeanMessage {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
}

interface IRelatedData {
  profiles: ILeanProfile[];
  matches: ILeanMatch[];
  likesFrom: ILeanLike[];
  likesTo: ILeanLike[];
  messages: ILeanMessage[];
}

const findUserProfile = (userId: Types.ObjectId, profiles: ILeanProfile[]): ILeanProfile | null => {
  return profiles.find(p => p.userId.toString() === userId.toString()) || null;
};

const findUserMatches = (userId: Types.ObjectId, matches: ILeanMatch[]): ILeanMatch[] => {
  return matches.filter(m => m.users.some(u => u._id.toString() === userId.toString()));
};

const findUserLikesFrom = (userId: Types.ObjectId, likes: ILeanLike[]): ILeanLike[] => {
  return likes.filter(l => l.sender.toString() === userId.toString());
};

const findUserLikesTo = (userId: Types.ObjectId, likes: ILeanLike[]): ILeanLike[] => {
  return likes.filter(l => l.receiver.toString() === userId.toString());
};

const findUserMessages = (userId: Types.ObjectId, messages: ILeanMessage[]): ILeanMessage[] => {
  return messages.filter(m => m.sender.toString() === userId.toString());
};

const fetchRelatedData = async (users: IUser[]): Promise<IRelatedData> => {
  const userIds = users.map(user => user._id);

  const [profiles, matches, likesFrom, likesTo, messages] = await Promise.all([
    Profile.find({ userId: { $in: userIds } }).lean<ILeanProfile[]>(),
    Match.find({ users: { $in: userIds } }).populate('users').lean<ILeanMatch[]>(),
    Like.find({ sender: { $in: userIds } }).populate('sender').populate('receiver').lean<ILeanLike[]>(),
    Like.find({ receiver: { $in: userIds } }).populate('sender').populate('receiver').lean<ILeanLike[]>(),
    Message.find({ sender: { $in: userIds } }).populate('sender').lean<ILeanMessage[]>(),
  ]);

  return { profiles, matches, likesFrom, likesTo, messages };
};

const enrichUserData = (user: IUser, data: IRelatedData): IEnrichedUser => {
  const userObj = user.toObject();
  const userId = user._id;

  return {
    ...userObj,
    profile: findUserProfile(userId, data.profiles),
    matches: findUserMatches(userId, data.matches),
    likesFrom: findUserLikesFrom(userId, data.likesFrom),
    likesTo: findUserLikesTo(userId, data.likesTo),
    messages: findUserMessages(userId, data.messages),
  };
};

export const getAllUsers = async (): Promise<IEnrichedUser[]> => {
  try {
    const users = await User.find({});
    
    if (!users.length) {
      throw new GraphQLError('Хэрэглэгчид олдсонгүй', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const relatedData = await fetchRelatedData(users);
    return users.map(user => enrichUserData(user, relatedData));
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Алдаа гарлаа', {
      extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error },
    });
  }
};
