import React, { useEffect } from 'react';
import NoNotification from './NoNotification';
import NotifyFollowRequestCard from '@/app/(main)/_components/NotifyFollowRequestCard';
import NotifyPostLikeCard from '@/app/(main)/_components/NotifyPostLikeCard';
import { useGetNotificationsByLoggedUserQuery } from '@/generated';

const Notification = () => {
  const token = localStorage.getItem('token');
  const { data: notifyData } = useGetNotificationsByLoggedUserQuery({ context: { headers: { Authorization: `Bearer ${token}` } } });
  console.log('notify harah', notifyData?.getNotificationsByLoggedUser);
  useEffect(() => {
    console.log('notify harah', notifyData);
  }, [notifyData]);
  return (
    <div className="px-4 py-8 border w-[470px] h-full">
      <h3 className="text-[#262626] text-2xl font-[550] leading-8 tracking-wide mb-5">Notifications</h3>
      <div className="flex flex-col gap-4">
        <h6>Today</h6>
      </div>
      <NotifyFollowRequestCard />
      <NotifyPostLikeCard />
      <NoNotification />
    </div>
  );
};

export default Notification;
