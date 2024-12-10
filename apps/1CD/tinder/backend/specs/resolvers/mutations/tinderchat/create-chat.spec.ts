import { createChat } from '../../../../src/resolvers/mutations/tinderchat/create-chat';
import { Chatmodel } from '../../../../src/models/tinderchat/chat.model';
import { Messagemodel } from '../../../../src/models/tinderchat/message.model';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLError } from 'graphql';

jest.mock('../../../../src/models/tinderchat/chat.model', () => ({
  Chatmodel: {
    create: jest.fn(),
  },
}));

jest.mock('../../../../src/models/tinderchat/message.model', () => ({
  Messagemodel: {
    create: jest.fn(),
  },
}));

describe('It should save tinder chat', () => {
  const mockChatResponse = {
    _id: '1234567',
    participants: ['123', '1234']!,
  };

  const mockMessageResponse = {
    _id: '123456',
    chatId: '1234567',
    content: 'Hi, untaach!',
    senderId: '123',
  };

  const mockChatParticipants = ['123', '1234'];
  const mockMessageContent = 'Hi, untaach!';
  const mockSenderId = '123';

  it('should create a tinder chat and return the message', async () => {
    (Chatmodel.create as jest.Mock).mockResolvedValue(mockChatResponse);
    (Messagemodel.create as jest.Mock).mockResolvedValue(mockMessageResponse);

    const input = {
      participants: mockChatParticipants,
      content: mockMessageContent,
      senderId: mockSenderId,
    };

    const message = await createChat!({}, { input }, {}, {} as GraphQLResolveInfo);

    expect(Chatmodel.create).toHaveBeenCalledWith({ participants: input.participants });
    expect(Messagemodel.create).toHaveBeenCalledWith({
      content: input.content,
      senderId: input.senderId,
      chatId: mockChatResponse._id,
    });
    expect(message).toEqual(mockMessageResponse);
  });

  it('should throw an error when the chat creation fails', async () => {
    (Chatmodel.create as jest.Mock).mockResolvedValue(null);
    const input = {
      participants: mockChatParticipants,
      content: mockMessageContent,
      senderId: mockSenderId,
    };

    await expect(createChat!({}, { input }, {}, {} as GraphQLResolveInfo)).rejects.toThrowError(
      new GraphQLError('Could not create chat')
    );
  });

  it('should throw an error when internal server error occurs', async () => {
    (Chatmodel.create as jest.Mock).mockResolvedValue(mockChatResponse);
    (Messagemodel.create as jest.Mock).mockRejectedValue(new Error('Internal server error'));
    const input = {
      participants: mockChatParticipants,
      content: mockMessageContent,
      senderId: mockSenderId,
    };
    await expect(createChat!({}, { input }, {}, {} as GraphQLResolveInfo)).rejects.toThrowError(
      new GraphQLError('Error occurred while creating the chat or message: Error: Internal server error')
    );
  });
});
