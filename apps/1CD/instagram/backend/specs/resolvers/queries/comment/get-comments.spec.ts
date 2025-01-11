import { GraphQLResolveInfo } from 'graphql';
import { commentModel } from 'src/models/comment.model';
import { getComments } from 'src/resolvers/queries/comment/get-comments';
jest.mock('src/models/comment.model', () => ({
  commentModel: {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockResolvedValueOnce([
      {
        _id: '11',
        postId: '1',
        commentText: 'String',
        commentedUser: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
        reply: 'reply 1',
        commentIsLike: 'false',
        createdAt: '2024-12-21T06:11:30.947Z',
        updatedAt: 'Date',
      },
      {
        _id: '1',
        postId: '1',
        commentText: 'String',
        commentedUser: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
        reply: 'reply 1',
        commentIsLike: 'false',
        createdAt: '2024-12-20T06:11:30.947Z',
        updatedAt: 'Date',
      },
    ]),
  },
}));

describe('get posts all comments', () => {
  it('should throw something wrong in authorization', async () => {
    try {
      await getComments!({}, { postId: '1' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('wrong in authorization'));
    }
  });
  it('should return comments for a given postId', async () => {
    (commentModel.find as jest.Mock).mockReturnThis();
    (commentModel.populate as jest.Mock).mockResolvedValueOnce([
      {
        _id: '11',
        postId: '1',
        commentText: 'String',
        commentedUser: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
        reply: 'reply 1',
        commentIsLike: 'false',
        createdAt: '2024-12-21T06:11:30.947Z',
        updatedAt: 'Date',
      },
      {
        _id: '1',
        postId: '1',
        commentText: 'String',
        commentedUser: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
        reply: 'reply 1',
        commentIsLike: 'false',
        createdAt: '2024-12-20T06:11:30.947Z',
        updatedAt: 'Date',
      },
    ]);
    const response = await getComments!({}, { postId: '1' }, { userId: 'user 1' }, {} as GraphQLResolveInfo);
    expect(response).toEqual([
      {
        _id: '11',
        postId: '1',
        commentText: 'String',
        commentedUser: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
        reply: 'reply 1',
        commentIsLike: 'false',
        createdAt: '2024-12-21T06:11:30.947Z',
        updatedAt: 'Date',
      },
      {
        _id: '1',
        postId: '1',
        commentText: 'String',
        commentedUser: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
        reply: 'reply 1',
        commentIsLike: 'false',
        createdAt: '2024-12-20T06:11:30.947Z',
        updatedAt: 'Date',
      },
    ]);
  });
});
