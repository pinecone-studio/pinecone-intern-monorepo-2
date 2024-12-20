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
    _id: '6747bf86eef691c549c23463',
    participants: ['6747bf86eef691c549c23464', '6747bf86eef691c549c23465'],
  };

  const mockMessageResponse = {
    _id: '6747bf86aaf691c549c23463',
    chatId: '6747bf86eef691c549c23463',
    content: 'Hi, untaach!',
    senderId: '6747bf86eef691c549c23464',
  };

  const user2 = '6747bf86eef691c549c23465';
  const mockContent = 'Hi, untaach!';

  it('should create a new chat and message when previously has not chatted', async () => {
    (Chatmodel.findOne as jest.Mock).mockResolvedValue(null);
    (Chatmodel.create as jest.Mock).mockResolvedValue(mockChatResponse);
    (Messagemodel.create as jest.Mock).mockResolvedValue(mockMessageResponse);

    const input = {
      user2: user2,
      content: mockContent
    };
    const userId ='6747bf86eef691c549c23464'

    const message = await createChat!({}, {input}, {userId}, {} as GraphQLResolveInfo);

    expect(Chatmodel.create).toHaveBeenCalledWith({ participants: [userId, user2] });
    expect(Messagemodel.create).toHaveBeenCalledWith({
      content: mockContent,
      senderId: userId,
      chatId: mockChatResponse._id,
    });

    expect(message).toEqual(mockMessageResponse);
  });

  it('should create a new message when previously has chatted', async () => {
    (Chatmodel.findOne as jest.Mock).mockResolvedValue(mockChatResponse);
    (Messagemodel.create as jest.Mock).mockResolvedValue(mockMessageResponse);

    const input = {
      user2: user2,
      content: mockContent
    };
    const userId ='6747bf86eef691c549c23464'

    const message = await createChat!({}, {input}, {userId}, {} as GraphQLResolveInfo);

    expect(Messagemodel.create).toHaveBeenCalledWith({
      content: mockContent,
      senderId: userId,
      chatId: mockChatResponse._id,
    });

    expect(message).toEqual(mockMessageResponse);
  });

  it('should throw an error when there is an internal server error', async () => {
    (Chatmodel.findOne as jest.Mock).mockRejectedValue(new Error('Internal server error'));
    const userId ='6747bf86eef691c549c23464'
    const input = {
      user2:user2,
      content: mockContent
    };
    await expect(createChat!({}, { input }, {userId}, {} as GraphQLResolveInfo)).rejects.toThrowError(new GraphQLError('Error occurred while creating the chat or message: Error: Internal server error'));
  });
});
