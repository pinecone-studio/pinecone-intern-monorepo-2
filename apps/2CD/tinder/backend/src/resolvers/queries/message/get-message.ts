import Message from 'src/models/message';

function validateUser(context: any) {
  if (!context.user || !context.user._id) {
    throw new Error('Unauthorized');
  }
}

function handleError(error: any): never {
  if (error && error.message) {
    throw new Error(error.message);
  }
  throw new Error('Unknown error');
}

const getMessage = async (_: any, { messageId }: { messageId: string }, context: any) => {
  validateUser(context);

  try {
    const message = await Message.findById(messageId);
    if (!message) throw new Error('Message not found');

    return message;
  } catch (error: any) {
    handleError(error);
  }
};

export default getMessage;
