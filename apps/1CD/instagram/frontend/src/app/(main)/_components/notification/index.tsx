/* eslint-disable complexity */
import React from 'react';
import NotifyFollowRequestCard from '@/app/(main)/_components/NotifyFollowReqCard';
import NotifyPostLikeCard from '@/app/(main)/_components/NotifyPostLikeCard';
import NoNotification from '../NoNotification';
import { NotificationType, useConfirmFollowReqMutation, useGetNotificationsByLoggedUserQuery, useViewNotifyMutation } from '@/generated';
import { useAuth } from '@/components/providers';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { isThisWeek, isThisYear, isToday, isYesterday } from 'date-fns';
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
  const { data: notifyData, loading } = useGetNotificationsByLoggedUserQuery();
  console.log('notify datag harah', notifyData);
  console.log('current useriig harah', notifyData?.getNotificationsByLoggedUser[0].currentUserId);
  console.log('nevtersen useriin id iig harah', user?._id);
  console.log('notify datagiin otheruseriig harah', notifyData?.getNotificationsByLoggedUser[0].otherUserId._id);
  const [viewNotify] = useViewNotifyMutation();
  const [confirmFollowReq] = useConfirmFollowReqMutation();
  if (!notifyData || !accountVis) return;
  if (loading) return <p data-testid="notificationLoading">loading...</p>;
  const notificationView = async (id: string) => {
    await viewNotify({ variables: { id: id } });
  };
  const followReqCon = async (followerId: string) => {
    await confirmFollowReq({ variables: { followerId: followerId } });
  };
  // console.log('follow reqiin following idiig harah');
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
            appReq={() => followReqCon(oneNotification.otherUserId._id)}
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
