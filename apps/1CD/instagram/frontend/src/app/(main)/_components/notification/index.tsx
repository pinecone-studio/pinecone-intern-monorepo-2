/* eslint-disable complexity */
import React, { useEffect } from 'react';
import NotifyFollowRequestCard from '@/app/(main)/_components/NotifyFollowReqCard';
import NotifyPostLikeCard from '@/app/(main)/_components/NotifyPostLikeCard';
import NoNotification from '../NoNotification';
import { NotificationType, useGetNotificationsByLoggedUserQuery, useViewNotifyMutation } from '@/generated';
import { useAuth } from '@/components/providers';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { isThisWeek, isThisYear, isToday, isYesterday } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export type notification = {
  __typeName?: string;
  _id: string;
  notificationType: NotificationType;
  otherUserId: { userName: string; profileImg?: string | null; __typeName?: string; _id: string };
  createdAt: Date;
  isViewed: boolean;
  currentUserId: string;
};
const Notification = () => {
  const { user } = useAuth();
  const accountVis = user?.accountVisibility;
  const { data: notifyData, loading, refetch } = useGetNotificationsByLoggedUserQuery();
  useEffect(() => {
    refetch();
  }, [notifyData]);
  console.log('notify datanuudiig harah isviewed false baih', notifyData?.getNotificationsByLoggedUser.filter((oneNotify) => oneNotify.isViewed === false).length);
  const [viewNotify] = useViewNotifyMutation();
  if (!notifyData || !accountVis) return;
  if (loading) return <Skeleton className="w-[470px] h-full" data-testid="notificationLoading"></Skeleton>;
  const notificationView = async (id: string) => {
    await viewNotify({ variables: { id: id } });
  };
  const sortedNotify = notifyData.getNotificationsByLoggedUser.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const todayNotify = sortedNotify.filter((oneNotify) => isToday(new Date(oneNotify.createdAt)));
  const yesterdayNotify = sortedNotify.filter((oneNotify) => isYesterday(new Date(oneNotify.createdAt)) && !isToday(new Date(oneNotify.createdAt)));
  const thisWeekNotify = sortedNotify.filter((oneNotify) => isThisWeek(new Date(oneNotify.createdAt)) && !isYesterday(new Date(oneNotify.createdAt)) && !isToday(new Date(oneNotify.createdAt)));
  const earlierNotify = sortedNotify.filter(
    (oneNotify) => isThisYear(new Date(oneNotify.createdAt)) && !isThisWeek(new Date(oneNotify.createdAt)) && !isYesterday(new Date(oneNotify.createdAt)) && !isToday(new Date(oneNotify.createdAt))
  );

  const notifyDiv = (notifies: notification[]): React.ReactNode => {
    return notifies.map((oneNotification) => {
      if (oneNotification.notificationType === 'POSTLIKE') {
        return (
          <NotifyPostLikeCard
            data-cy="notify-postlike-card"
            key={oneNotification._id}
            userName={oneNotification.otherUserId.userName}
            profileImg={oneNotification.otherUserId.profileImg || '/images/profileImg.webp'}
            createdDate={oneNotification.createdAt}
            isViewed={oneNotification.isViewed}
            onClick={() => notificationView(oneNotification._id)}
          />
        );
      } else if (oneNotification.notificationType === 'FOLLOW') {
        return (
          <NotifyFollowRequestCard
            key={oneNotification._id}
            userName={oneNotification.otherUserId.userName}
            profileImg={oneNotification.otherUserId.profileImg || '/images/profileImg.webp'}
            createdDate={oneNotification.createdAt}
            accountVisible={accountVis}
            isViewed={oneNotification.isViewed}
            onClick={() => notificationView(oneNotification._id)}
            followerId={oneNotification.otherUserId._id}
            followingId={user._id}
          />
        );
      }
    });
  };

  return (
    <div className="px-4 py-8 border w-[470px] h-full" data-testid="notification-component">
      <h3 className="text-[#262626] text-2xl font-[550] leading-8 tracking-wide mb-5">Notifications</h3>
      {!notifyData.getNotificationsByLoggedUser.length && <NoNotification data-cy="noNotificationComp" />}
      {todayNotify.length > 0 && (
        <div>
          <div className="flex flex-col gap-4">
            <h6>Today</h6>
            <div data-cy="notifyDiv">{notifyDiv(todayNotify)}</div>
          </div>
          <DropdownMenuSeparator />
        </div>
      )}
      {yesterdayNotify.length > 0 && (
        <div>
          <div className="flex flex-col gap-4">
            <h6>Yesterday</h6>
            <div>{notifyDiv(yesterdayNotify)}</div>
          </div>
          <DropdownMenuSeparator />
        </div>
      )}
      {thisWeekNotify.length > 0 && (
        <div>
          <div className="flex flex-col gap-4">
            <h6>This week</h6>
            <div>{notifyDiv(thisWeekNotify)}</div>
          </div>
          <DropdownMenuSeparator />
        </div>
      )}
      {earlierNotify.length > 0 && (
        <div>
          <div className="flex flex-col gap-4">
            <h6>Earlier</h6>
            <div>{notifyDiv(earlierNotify)}</div>
          </div>
          <DropdownMenuSeparator />
        </div>
      )}
    </div>
  );
};

export default Notification;
