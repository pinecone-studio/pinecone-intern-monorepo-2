import { MutationResolvers } from 'src/generated';
import { notificationModel } from 'src/models';

export const viewNotify: MutationResolvers['viewNotify'] = async (_: unknown, { _id }, { userId }) => {
  if (!userId) throw new Error('wrong in authorization');
  const viewedNotify = await notificationModel.findByIdAndUpdate(_id, { isViewed: true }, { new: true });
  if (!viewedNotify) throw new Error('can not find this notification');

  return viewedNotify;
};
