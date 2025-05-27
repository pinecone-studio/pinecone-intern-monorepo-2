import Message from 'src/models/message';

function validateUser(context: any) {
  if (!context.user || !context.user._id) {
    throw new Error('Unauthorized');
  }
}

const getMessage = async (_: any, { messageId }: { messageId: string }, context: any) => {
  validateUser(context);  

  try {
    const message = await Message.findById(messageId);
    if (!message) throw new Error('Message not found'); 

    return message;
  } catch (error: any) {
    throw new Error(error?.message || 'Unknown error'); 
  }
};


export default getMessage;
