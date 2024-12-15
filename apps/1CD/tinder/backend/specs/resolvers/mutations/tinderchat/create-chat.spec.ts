import { Chatmodel } from '../../../../src/models/tinderchat/chat.model';
import { Messagemodel } from '../../../../src/models/tinderchat/message.model';
import { createChat } from '../../../../src/resolvers/mutations';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/tinderchat/chat.model', () => ({
  Chatmodel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../../../../src/models/tinderchat/message.model', () => ({
  Messagemodel: {
    create: jest.fn(),
  },
}));

describe('createChat Mutation', () => {
  const mockChatResponse = {
    _id: '1234567',
    participants: ['123', '1234'],
  };

  const mockMessageResponse = {
    _id: '123456',
    chatId: '1234567',
    content: 'Hi, untaach!',
    senderId: '123',
  };

  const mockParticipants = ['123', '1234'];
  const mockContent = 'Hi, untaach!';
  const mockSenderId = '123';

  it('should create a new chat and return the message when no chatId is provided', async () => {
    (Chatmodel.create as jest.Mock).mockResolvedValue(mockChatResponse);
    (Messagemodel.create as jest.Mock).mockResolvedValue(mockMessageResponse);

    const input = {
      participants: mockParticipants,
      content: mockContent,
      senderId: mockSenderId,
    };

    const message = await createChat!({}, { input }, {}, {} as GraphQLResolveInfo);

    expect(Chatmodel.create).toHaveBeenCalledWith({ participants: mockParticipants });
    expect(Messagemodel.create).toHaveBeenCalledWith({
      content: mockContent,
      senderId: mockSenderId,
      chatId: mockChatResponse._id,
    });

    expect(message).toEqual(mockMessageResponse);
  });
  it('should add a message to an existing chat when chatId is provided', async () => {
    const mockExistingChat = { _id: '1234567' };
    const result = await createChat!({}, { input: { participants: ['123', '1234'], content: 'Hi, untaach', senderId: '123', chatId: '1234567' } }, {}, {} as GraphQLResolveInfo);
    expect(result).toEqual(mockMessageResponse);
    expect(Chatmodel.findOne).toHaveBeenCalledWith(mockExistingChat);
    expect(Messagemodel.create).toHaveBeenCalledWith({ content: 'Hi, untaach', senderId: '123', chatId: '1234567' });
  });

  it('should create a new chat and message if no chat is found for the provided chatId', async () => {
    (Chatmodel.findOne as jest.Mock).mockResolvedValue({});
    (Chatmodel.create as jest.Mock).mockResolvedValue(mockChatResponse);
    (Messagemodel.create as jest.Mock).mockResolvedValue(mockMessageResponse);

    const input = {
      content: mockContent,
      senderId: mockSenderId,
      chatId: mockChatResponse._id,
      participants: mockParticipants,
    };

    const message = await createChat!({}, { input }, {}, {} as GraphQLResolveInfo);

    expect(Chatmodel.findOne).toHaveBeenCalledWith({ _id: mockChatResponse._id });
    expect(Chatmodel.create).toHaveBeenCalledWith({ participants: mockParticipants });
    expect(Messagemodel.create).toHaveBeenCalledWith({
      content: mockContent,
      senderId: mockSenderId,
      chatId: mockChatResponse._id,
    });
    expect(message).toEqual(mockMessageResponse);
  });

  it('should throw an error when there is an internal server error', async () => {
    (Chatmodel.create as jest.Mock).mockRejectedValue(new Error('Internal server error'));

    const input = {
      participants: mockParticipants,
      content: mockContent,
      senderId: mockSenderId,
    };
    await expect(createChat!({}, { input }, {}, {} as GraphQLResolveInfo)).rejects.toThrowError(new GraphQLError('Error occurred while creating the chat or message: Error: Internal server error'));
  });
});
