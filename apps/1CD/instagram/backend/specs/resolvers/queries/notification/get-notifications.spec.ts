/* eslint-disable max-nested-callbacks */

import { GraphQLResolveInfo } from 'graphql';
import { notificationModel } from 'src/models/notifications.model';
import { getNotificationsByLoggedUser } from 'src/resolvers/queries/notifications';

jest.mock('src/models/notifications.model', () => ({
  notificationModel: {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockResolvedValue([
      {
        _id: '123',
        otherUserId: { _id: '1112', userName: 'user 1' },
        currentUserId: '1',
        postId: { _id: 'postNum1', userName: 'user 1', description: 'jest mock desc', images: ['http://example.com/zurag1'] },
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          otherUserId: { _id: '1112', userName: 'user 1' },
          currentUserId: '1',
          postId: { _id: 'postNum1', userName: 'user 1', description: 'jest mock desc', images: ['http://example.com/zurag1'] },
        }),
      },
    ]),
  },
}));

describe('get notificationBy logged User', () => {
  it('should throw something wrong in authorization', async () => {
    try {
      await getNotificationsByLoggedUser!({}, {}, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('wrong in authorization'));
    }
  });

  it('should throw notifications', async () => {
    // const mockNotifications = [
    //   {
    //     _id: '123',
    //     otherUserId: '1112',
    //     currentUserId: { _id: '1', userName: 'user 1' },
    //     postId: { _id: 'postNum1', userName: 'user 1', description: 'jest mock desc', images: ['http://example.com/zurag1'] },
    //     toObject: jest.fn().mockReturnValue({
    //       _id: '123',
    //       otherUserId: '1112',
    //       currentUserId: { _id: '1', userName: 'user 1' },
    //       postId: { _id: 'postNum1', userName: 'user 1', description: 'jest mock desc', images: ['http://example.com/zurag1'] },
    //     }),
    //   },
    // ];

    const mockPopulate = jest.fn().mockReturnThis();

    (notificationModel.find as jest.Mock).mockImplementation(() => ({
      populate: mockPopulate.mockImplementation(() => ({
        populate: mockPopulate.mockImplementation(() => [
          {
            _id: '123',
            otherUserId: { _id: '1', userName: 'user 1' },
            currentUserId: '1',
            postId: { _id: 'postNum1', userName: 'user 1', description: 'jest mock desc', images: ['http://example.com/zurag1'] },
            toObject: jest.fn().mockReturnValue({
              _id: '123',
              otherUserId: { _id: '1', userName: 'user 1' },
              currentUserId: '1',
              postId: { _id: 'postNum1', userName: 'user 1', description: 'jest mock desc', images: ['http://example.com/zurag1'] },
            }),
          },
        ]),
      })),
    }));
    const res = await getNotificationsByLoggedUser!({}, {}, { userId: 'user 1' }, {} as GraphQLResolveInfo);
    expect(notificationModel.find).toHaveBeenCalledWith({ currentUserId: 'user 1' });
    expect(mockPopulate).toHaveBeenCalledWith('postId');
    expect(mockPopulate).toHaveBeenCalledWith('otherUserId');
    expect(res).toEqual([
      {
        _id: '123',
        otherUserId: { _id: '1', userName: 'user 1' },
        currentUserId: '1',
        postId: { _id: 'postNum1', userName: 'user 1', description: 'jest mock desc', images: ['http://example.com/zurag1'] },
      },
    ]);
  });
});
