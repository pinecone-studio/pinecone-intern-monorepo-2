import { Comment, User } from 'src/models';
import { CommentResolvers } from 'src/resolvers/types/comment';

jest.mock('src/models', () => ({
  Comment: { find: jest.fn() },
  User: { find: jest.fn() }
}));

describe('CommentResolvers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Comment.comments', () => {
    it('should return empty array when parent has no comments', async () => {
      const parent = { comments: [] };
      const result = await CommentResolvers.Comment.comments(parent);
      expect(result).toEqual([]);
      expect(Comment.find).not.toHaveBeenCalled();
    });

    it('should return empty array when parent has no comments property', async () => {
      const parent = {};
      const result = await CommentResolvers.Comment.comments(parent);
      expect(result).toEqual([]);
      expect(Comment.find).not.toHaveBeenCalled();
    });

    it('should return populated comments when parent has comments', async () => {
      const mockComments = [
        { _id: 'comment1', content: 'test1' },
        { _id: 'comment2', content: 'test2' }
      ];
      const parent = { comments: ['comment1', 'comment2'] };
      
      (Comment.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockComments)
      });

      const result = await CommentResolvers.Comment.comments(parent);

      expect(Comment.find).toHaveBeenCalledWith({ _id: { $in: ['comment1', 'comment2'] } });
      expect(result).toEqual(mockComments);
    });
  });

  describe('Comment.likes', () => {
    it('should return empty array when parent has no likes', async () => {
      const parent = { likes: [] };
      const result = await CommentResolvers.Comment.likes(parent);
      expect(result).toEqual([]);
      expect(User.find).not.toHaveBeenCalled();
    });

    it('should return empty array when parent has no likes property', async () => {
      const parent = {};
      const result = await CommentResolvers.Comment.likes(parent);
      expect(result).toEqual([]);
      expect(User.find).not.toHaveBeenCalled();
    });

    it('should return populated likes when parent has likes', async () => {
      const mockLikes = [
        { _id: 'user1', userName: 'user1', profileImage: 'image1.jpg' },
        { _id: 'user2', userName: 'user2', profileImage: 'image2.jpg' }
      ];
      const parent = { likes: ['user1', 'user2'] };
      
      (User.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockLikes)
      });

      const result = await CommentResolvers.Comment.likes(parent);

      expect(User.find).toHaveBeenCalledWith({ _id: { $in: ['user1', 'user2'] } });
      expect(result).toEqual(mockLikes);
    });
  });
});
