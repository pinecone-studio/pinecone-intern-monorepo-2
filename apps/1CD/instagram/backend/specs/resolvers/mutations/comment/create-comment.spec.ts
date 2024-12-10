import { GraphQLResolveInfo } from 'graphql';
import { createComment } from 'src/resolvers/mutations/comment/create-comment';
import { commentModel } from 'src/models/comment.model';

jest.mock('src/models/comment.model', () => ({
  commentModel: {
    create: jest.fn(),
    // .mockResolvedValue({
    //   _id: '11',
    //   postId: '1',
    //   commentText: 'String',
    //   commentedUser: 'user 1',
    //   reply: 'reply 1',
    //   commentIsLike: 'false',
    //   createdAt: 'Date',
    //   updatedAt: 'Date',
    // })
    findById: jest.fn(),
    // .mockImplementation(() => ({
    //   populate: jest.fn().mockResolvedValue({
    //     _id: '11',
    //     postId: '1',
    //     commentText: 'String',
    //     commentedUser: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
    //     reply: 'reply 1',
    //     commentIsLike: 'false',
    //     createdAt: 'Date',
    //     updatedAt: 'Date',
    //   }),
    // }))
  },
}));

describe('create comment', () => {
  it('should throw error in authorization', async () => {
    try {
      await createComment!({}, { input: { postId: 'post 1', commentText: 'goy baina, amjilt husey' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('something wrong in authorization'));
    }
  });
  it('create comment and should return new comment', async () => {
    const mockedCreatedComment = { _id: '1', postId: 'post 1', commentText: 'goy baina, amjilt husey', commentedUser: 'user 1' };
    const mockedPopulatedCreatedComment = {
      _id: '11',
      postId: '1',
      commentText: 'goy baina, amjilt husey',
      commentedUser: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
    };
    (commentModel.create as jest.Mock).mockResolvedValueOnce(mockedCreatedComment);
    (commentModel.findById as jest.Mock).mockImplementation(() => ({ populate: jest.fn().mockResolvedValueOnce(mockedPopulatedCreatedComment) }));

    const response = await createComment!({}, { input: { postId: 'post 1', commentText: 'goy baina, amjilt husey' } }, { userId: 'user 1' }, {} as GraphQLResolveInfo);
    expect(response).toEqual(mockedPopulatedCreatedComment);
  });
});
