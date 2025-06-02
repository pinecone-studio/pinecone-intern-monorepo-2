import Message from 'src/models/message';

function handleError(error: any): never {
  if (error && error.message) {
    throw new Error(error.message);
  }
  throw new Error('Unknown error');
}

const getMessage = async (_: any, { matchId }: { matchId: string }) => {
  try {
    const messages = await Message.find({ match: matchId }).sort({ createdAt: 1 }); // oldest first
    return messages;
  } catch (error: any) {
    handleError(error);
  }
};

export default getMessage;
