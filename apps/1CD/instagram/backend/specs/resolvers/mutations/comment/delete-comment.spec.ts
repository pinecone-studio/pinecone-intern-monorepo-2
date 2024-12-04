import { GraphQLResolveInfo } from 'graphql';
import { deleteComment } from 'src/resolvers/mutations/comment/delete-comment';

jest.mock('src/models/comment.model', () => ({
  commentModel: {
    findByIdAndDelete: jest.fn().mockResolvedValueOnce({ _id: 'comment 1', postId: 'post 1', commentText: 'uneheer goy bailaa, amjilt husey', commentedUser: 'user 1' }).mockReturnValueOnce(null),
  },
}));

describe('delete comment', () => {
  it('should throw error in authorization', async () => {
    try {
      await deleteComment!({}, { _id: 'comment 1' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('wrong in authorization'));
    }
  });
  it('should delete comment', async () => {
    const response = await deleteComment!({}, { _id: 'comment 1' }, { userId: 'user 1' }, {} as GraphQLResolveInfo);
    expect(response).toEqual({ _id: 'comment 1', postId: 'post 1', commentText: 'uneheer goy bailaa, amjilt husey', commentedUser: 'user 1' });
  });
  it('id not found and should throw error', async () => {
    try {
      await deleteComment!({}, { _id: 'comment 1' }, { userId: 'user 1' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('id not found and can not delete comment'));
    }
  });
});
