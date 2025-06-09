import User from '../../../models/user';
import { Profile } from '../../../models/profile';
import Match from '../../../models/match';
import Like from '../../../models/like';
import Message from '../../../models/message';
import { Document, Types } from 'mongoose';

type UserDocument = Document & {
  clerkId: string;
  email: string;
};

type ProfileDocument = Document & {
  userId: Types.ObjectId;
  bio: string;
  age: number;
};

type MatchDocument = Document & {
  users: UserDocument[];
};

type LikeDocument = Document & {
  from: Types.ObjectId;
  to: Types.ObjectId;
};

type MessageDocument = Document & {
  sender: Types.ObjectId;
};

function processMatches(matches: MatchDocument[]): Map<string, MatchDocument[]> {
  const matchMap = new Map();
  matches.forEach(match => {
    match.users.forEach((user: UserDocument) => {
      const userId = user._id.toString();
      if (!matchMap.has(userId)) {
        matchMap.set(userId, []);
      }
      matchMap.get(userId).push(match);
    });
  });
  return matchMap;
}

function processLikesFrom(likes: LikeDocument[]): Map<string, LikeDocument[]> {
  const likesMap = new Map();
  likes.forEach(like => {
    const userId = like.from.toString();
    if (!likesMap.has(userId)) {
      likesMap.set(userId, []);
    }
    likesMap.get(userId).push(like);
  });
  return likesMap;
}

function processLikesTo(likes: LikeDocument[]): Map<string, LikeDocument[]> {
  const likesMap = new Map();
  likes.forEach(like => {
    const userId = like.to.toString();
    if (!likesMap.has(userId)) {
      likesMap.set(userId, []);
    }
    likesMap.get(userId).push(like);
  });
  return likesMap;
}

function processMessages(messages: MessageDocument[]): Map<string, MessageDocument[]> {
  const messageMap = new Map();
  messages.forEach(message => {
    const userId = message.sender.toString();
    if (!messageMap.has(userId)) {
      messageMap.set(userId, []);
    }
    messageMap.get(userId).push(message);
  });
  return messageMap;
}

async function fetchRelatedData(userIds: Types.ObjectId[]) {
  return Promise.all([
    Profile.find({ userId: { $in: userIds } }),
    Match.find({ users: { $in: userIds } }).populate('users'),
    Like.find({ from: { $in: userIds } }).populate('to'),
    Like.find({ to: { $in: userIds } }).populate('from'),
    Message.find({ sender: { $in: userIds } }).populate('sender')
  ]) as Promise<[ProfileDocument[], MatchDocument[], LikeDocument[], LikeDocument[], MessageDocument[]]>;
}

function createDataMaps(profiles: ProfileDocument[], matches: MatchDocument[], likesFrom: LikeDocument[], likesTo: LikeDocument[], messages: MessageDocument[]) {
  return {
    profileMap: new Map(profiles.map(p => [p.userId.toString(), p])),
    matchMap: processMatches(matches),
    likesFromMap: processLikesFrom(likesFrom),
    likesToMap: processLikesTo(likesTo),
    messageMap: processMessages(messages)
  };
}

function getProfileData(userId: string, dataMaps: ReturnType<typeof createDataMaps>) {
  return dataMaps.profileMap.get(userId) || null;
}

function getMatchData(userId: string, dataMaps: ReturnType<typeof createDataMaps>) {
  return dataMaps.matchMap.get(userId) || [];
}

function getLikeData(userId: string, dataMaps: ReturnType<typeof createDataMaps>) {
  return {
    likesFrom: dataMaps.likesFromMap.get(userId) || [],
    likesTo: dataMaps.likesToMap.get(userId) || []
  };
}

function getMessageData(userId: string, dataMaps: ReturnType<typeof createDataMaps>) {
  return dataMaps.messageMap.get(userId) || [];
}

function getRelatedData(userId: string, dataMaps: ReturnType<typeof createDataMaps>) {
  const profile = getProfileData(userId, dataMaps);
  const matches = getMatchData(userId, dataMaps);
  const { likesFrom, likesTo } = getLikeData(userId, dataMaps);
  const messages = getMessageData(userId, dataMaps);

  return {
    profile,
    matches,
    likesFrom,
    likesTo,
    messages
  };
}

function enrichUserData(user: UserDocument, dataMaps: ReturnType<typeof createDataMaps>) {
  const userId = user._id.toString();
  const relatedData = getRelatedData(userId, dataMaps);
  return {
    ...user.toObject(),
    ...relatedData
  };
}

export const getAllUsers = async () => {
  const users = await User.find().select('-password');
  const userIds = users.map(user => user._id);
  
  const [profiles, matches, likesFrom, likesTo, messages] = await fetchRelatedData(userIds);
  const dataMaps = createDataMaps(profiles, matches, likesFrom, likesTo, messages);
  
  return users.map(user => enrichUserData(user, dataMaps));
};
