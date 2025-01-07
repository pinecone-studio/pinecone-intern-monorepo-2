import React from 'react';
import NotifyFollowRequestCard from '@/app/(main)/_components/NotifyFollowReqCard';
import NotifyPostLikeCard from '@/app/(main)/_components/NotifyPostLikeCard';
import NoNotification from '../../app/(main)/_components/NoNotification';
import { useGetNotificationsByLoggedUserQuery } from '@/generated';

const Notification = () => {
  const { data: notifyData, loading } = useGetNotificationsByLoggedUserQuery();
  if (loading) return <p data-testid="notificationLoading">loading...</p>;
  return (
    <div className="px-4 py-8 border w-[470px] h-full" data-testid="notification-component">
      <h3 className="text-[#262626] text-2xl font-[550] leading-8 tracking-wide mb-5">Notifications</h3>
      <div className="flex flex-col gap-4">
        <h6>Today</h6>
      </div>
      <NotifyFollowRequestCard />
      {notifyData?.getNotificationsByLoggedUser!.map((oneNotification) => (
        <NotifyPostLikeCard key={oneNotification._id} userName={oneNotification.otherUserId.userName!} profileImg={oneNotification.otherUserId.profileImg!} createdDate={oneNotification.createdAt} />
      ))}

      <NoNotification />
    </div>
  );
};

export default Notification;
