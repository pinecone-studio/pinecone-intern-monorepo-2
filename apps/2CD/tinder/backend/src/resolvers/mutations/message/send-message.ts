import Match from 'src/models/match';
import Message from 'src/models/message';
import { SendMessageArgs } from 'src/types/graphql';

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

const sendMessage = async (_: any, { matchId, senderId, content }: SendMessageArgs) => {
  try {
    validateContent(content);
    const match = await getMatch(matchId);
    validateUserInMatch(match, senderId);

    const newMessage = await Message.create({
      match: matchId,
      sender: senderId,
      content,
      createdAt: new Date(),
    });

    return newMessage;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send message');
  }
};


export default sendMessage;
