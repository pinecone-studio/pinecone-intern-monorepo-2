import { GraphQLResolveInfo } from 'graphql';
import { notificationModel } from 'src/models';
import { viewNotify } from 'src/resolvers/mutations';

jest.mock('src/models/notifications.model', () => ({
  notificationModel: { findByIdAndUpdate: jest.fn() },
}));

describe('if click on notification  isvewed change to true', () => {
  it('should throw something wrong in authorization', async () => {
    try {
      await viewNotify!({}, { _id: '11' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('wrong in authorization'));
    }
  });
  it('should throw error if notification not found', async () => {
    (notificationModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(viewNotify!({}, { _id: '11' }, { userId: 'user 1' }, {} as GraphQLResolveInfo)).rejects.toThrow('can not find this notification');
  });
  it('Should return viewednotify and change the isviewed boolean', async () => {
    const mockNotifyView = { _id: '11', isViewed: true };
    (notificationModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockNotifyView);
    const response = await viewNotify!({}, { _id: '11' }, { userId: 'user 1' }, {} as GraphQLResolveInfo);
    expect(notificationModel.findByIdAndUpdate as jest.Mock).toHaveBeenCalledWith('11', { isViewed: true }, { new: true });
    expect(response).toEqual({ _id: '11', isViewed: true });
  });
});
