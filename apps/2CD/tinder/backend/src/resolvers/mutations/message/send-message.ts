import Match from 'src/models/match';
import Message from 'src/models/message';
import User from 'src/models/user';
import { Types } from 'mongoose';

interface MessageInput {
  matchId: string;
  content: string;
}

interface Context {
  clerkId?: string;
}

function validateContent(content: string | undefined): void {
  if (!content?.trim()) {
    throw new Error('Message content cannot be empty');
  }
}

async function getMatchById(matchId: string): Promise<any> {
  const match = await Match.findById(matchId);
  if (!match) {
    throw new Error('Match not found');
  }
  return match;
}

function validateUserInMatch(match: { users: Types.ObjectId[] }, userId: string): void {
  const isUserInMatch = match.users.some(
    (user) => user.toString() === userId
  );
  
  if (!isUserInMatch) {
    throw new Error('You are not part of this match');
  }
}

async function getUserFromClerkId(clerkId: string | undefined) {
  if (!clerkId) throw new Error('Unauthorized');

  const user = await User.findOne({ clerkId });
  if (!user) throw new Error('User not found');

  return user;
}

const sendMessage = async (_: unknown, { matchId, content }: MessageInput, context: Context) => {
  try {
    validateContent(content);
    const user = await getUserFromClerkId(context.clerkId);
    const match = await getMatchById(matchId);
    validateUserInMatch(match, user._id.toString());

    return await Message.create({
      match: matchId,
      sender: user._id,
      content,
      createdAt: new Date(),
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send message');
  }
};

export default sendMessage;
