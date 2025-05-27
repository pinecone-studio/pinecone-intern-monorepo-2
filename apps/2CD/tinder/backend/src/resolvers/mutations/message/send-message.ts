import Match from 'src/models/match';
import Message from 'src/models/message';
import { SendMessageArgs } from 'src/types/graphql';

function validateUser(context: any) {
  if (!context.user || !context.user._id) {
    throw new Error('Unauthorized');
  }
  return context.user._id.toString();
}

function validateContent(content: string) {
  if (!content || !content.trim()) {
    throw new Error('Message content cannot be empty');
  }
}

async function getMatch(matchId: string) {
  const match = await Match.findById(matchId);
  if (!match) {
    throw new Error('Match not found');
  }
  return match;
}

function validateUserInMatch(match: any, senderId: string) {
  if (!Array.isArray(match.users) || !match.users.some((user: any) => user.toString() === senderId)) {
    throw new Error('You are not part of this match');
  }
}

const sendMessage = async (_: any, { matchId, content }: SendMessageArgs, context: any) => {
  try {
    validateContent(content);
    const senderId = validateUser(context);
    const match = await getMatch(matchId);
    validateUserInMatch(match, senderId);

    const newMessage = await Message.create({
      matchId,
      senderId,
      content,
      createdAt: new Date(),
    });

    return newMessage;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send message');
  }
};

export default sendMessage;
