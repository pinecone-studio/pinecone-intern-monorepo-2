import { GraphQLResolveInfo } from 'graphql';
import { notificationModel } from 'src/models/notifications.model';
import { getNotificationsByLoggedUser } from 'src/resolvers/queries/notifications';

jest.mock('src/models/notifications.model', () => ({
  notificationModel: {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockResolvedValueOnce([{ _id: '123', otherUserId: '1112', currentUserId: '1', postId: {'postNum1'} }]),
    toObject: jest.fn(),
  },
}));

describe('get notificationBy logged User', async () => {
  it('should throw something wrong in authorization', async () => {
    try {
      await getNotificationsByLoggedUser!({}, { currentUserId: '11' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('wrong in authorization'));
    }
  });

  it('should throw notifications', async () => {});
});
