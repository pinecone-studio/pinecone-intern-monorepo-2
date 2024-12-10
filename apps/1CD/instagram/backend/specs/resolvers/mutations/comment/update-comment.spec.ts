import { GraphQLResolveInfo } from 'graphql';
import { updateComment } from 'src/resolvers/mutations/comment/update-comment';

jest.mock('src/models/comment.model', () => ({
  commentModel: {
    findByIdAndUpdate: jest.fn().mockResolvedValueOnce({ _id: 'comment 1', postId: 'post 1', commentText: 'uneheer goy bailaa, amjilt huseyyyy', commentedUser: 'user 1' }).mockReturnValueOnce(null),
  },
}));

describe('update comment', () => {
  it('should throw error in authorization', async () => {
    try {
      await updateComment!({}, { input: { _id: 'comment 1', commentText: 'uneheer goy bailaa, amjilt husey' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('error in authorization'));
    }
  });
  it('should update comment', async () => {
    const response = await updateComment!({}, { input: { _id: 'comment 1', commentText: 'uneheer goy bailaa, amjilt huseyyyy' } }, { userId: 'user 1' }, {} as GraphQLResolveInfo);
    expect(response).toEqual({ _id: 'comment 1', postId: 'post 1', commentText: 'uneheer goy bailaa, amjilt huseyyyy', commentedUser: 'user 1' });
  });
  it('should throw finding error', async () => {
    try {
      await updateComment!({}, { input: { _id: 'comment 1', commentText: 'uneheer goy bailaa, amjilt huseyyyy' } }, { userId: 'user 1' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('can not find comment id'));
    }
  });
});
