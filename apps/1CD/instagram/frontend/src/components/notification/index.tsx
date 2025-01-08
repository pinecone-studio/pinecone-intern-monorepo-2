import React from 'react';
import NotifyFollowRequestCard from '@/app/(main)/_components/NotifyFollowReqCard';
import NotifyPostLikeCard from '@/app/(main)/_components/NotifyPostLikeCard';
import NoNotification from '../../app/(main)/_components/NoNotification';
import { useGetNotificationsByLoggedUserQuery } from '@/generated';
import { useAuth } from '../providers';

const Notification = () => {
  const { user } = useAuth();
  const accountVis = user?.accountVisibility;
  const { data: notifyData, loading } = useGetNotificationsByLoggedUserQuery();
  if (loading) return <p data-testid="notificationLoading">loading...</p>;
  console.log('datanuudiig harah', notifyData);
  return (
    <div className="px-4 py-8 border w-[470px] h-full" data-testid="notification-component">
      <h3 className="text-[#262626] text-2xl font-[550] leading-8 tracking-wide mb-5">Notifications</h3>
      <div className="flex flex-col gap-4">
        <h6>Today</h6>
      </div>

      {notifyData?.getNotificationsByLoggedUser!.map((oneNotification) => {
        if (oneNotification.notificationType === 'POSTLIKE') {
          return (
            <NotifyPostLikeCard
              key={oneNotification._id}
              userName={oneNotification.otherUserId.userName!}
              profileImg={oneNotification.otherUserId.profileImg!}
              createdDate={oneNotification.createdAt}
            />
          );
        } else if (oneNotification.notificationType === 'FOLLOW') {
          return (
            <NotifyFollowRequestCard
              key={oneNotification._id}
              userName={oneNotification.otherUserId.userName}
              profileImg={oneNotification.otherUserId.profileImg!}
              createdDate={oneNotification.createdAt}
              accountVisible={accountVis!}
            />
          );
        }
      })}
      <NoNotification />
    </div>
  );
};

export default Notification;
