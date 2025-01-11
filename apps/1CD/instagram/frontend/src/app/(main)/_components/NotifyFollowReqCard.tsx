/* eslint-disable complexity */

import { Button } from '@/components/ui/button';
import { AccountVisibility, FollowStatus, useConfirmFollowReqMutation, useGetFollowStatusQuery } from '@/generated';
import { formatDistanceToNowStrict } from 'date-fns';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';

type FollowReqNotifyType = {
  accountVisible: AccountVisibility;
  profileImg: string;
  userName: string;
  createdDate: Date;
  isViewed: boolean;
  onClick: () => Promise<void>;
  followerId: string;
  followingId: string;
};
const NotifyFollowRequestCard = ({ accountVisible, profileImg, userName, createdDate, isViewed, onClick, followerId, followingId }: FollowReqNotifyType) => {
  const dateDistance = formatDistanceToNowStrict(createdDate);
  console.log('follow statusiig harah=====.......', followerId, followingId);

  const { data: followStatus, loading: followStatusLoading } = useGetFollowStatusQuery({ variables: { followerId: '675911e5a5fa39b22efb46ae', followingId: '676115ef991135fb65e9cb47' } });
  const [confirmFollowReq, { loading: confirmLoading }] = useConfirmFollowReqMutation({
    onCompleted: () => {
      toast({ variant: 'default', title: 'Success', description: 'Follow request approved' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: `${error.message}`, description: 'Follow request approve failed' });
    },
  });
  if (followStatusLoading) return <p>loading...</p>;
  const confirmFollowReqHandler = async () => {
    await confirmFollowReq({ variables: { followerId: followerId } });
  };
  console.log('follow statusiig harah=====', followStatus, followerId, followingId);

  return (
    <>
      {(accountVisible === AccountVisibility.Private || followStatus?.getFollowStatus?.status === FollowStatus.Pending) && (
        <div className={`flex items-center justify-between gap-4 px-3 py-2 ${isViewed ? '' : 'bg-sky-50'}`} data-cy="notify-followReqPri-card" onClick={onClick}>
          <div className="flex items-center gap-3">
            <div className="relative flex rounded-full w-[44px] h-[44px]">
              <Image fill={true} src={profileImg} alt="Photo1" className="absolute object-cover h-full rounded-full" data-cy="notify-followReq-private-img" />
            </div>
            <div className="flex flex-col text-[#09090B]">
              <div className="">
                <span className="text-sm font-semibold" data-cy="notify-followReq-username">
                  {userName}
                </span>
                <span className="ml-2 text-sm">has requested to follow you</span>
              </div>
              <span className="text-[#71717A] text-xs" data-cy="notify-followReq-dateDistance">
                {dateDistance}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#2563EB] rounded-lg text-[#FAFAFA] w-20" data-cy="confirm-btn-followReq" onClick={confirmFollowReqHandler}>
              {confirmLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Confirm'}
            </Button>
            <Button className="bg-[#F4F4F5] rounded-lg text-[#18181B] w-20 hover:bg-[#F3F4F5]" data-cy="delete-btn-followReq">
              Delete
            </Button>
          </div>
        </div>
      )}
      {(accountVisible === AccountVisibility.Public || followStatus?.getFollowStatus?.status === FollowStatus.Approved) && (
        <div className={`flex items-center justify-between gap-4 px-3 py-2 ${isViewed ? '' : 'bg-sky-50'}`} data-cy="notify-followReqPub-card" onClick={onClick}>
          <div className="flex items-center gap-3">
            <div className="relative flex rounded-full w-[44px] h-[44px]">
              <Image fill={true} src={profileImg} alt="Photo1" className="absolute object-cover h-full rounded-full" data-cy="notify-followReq-public-img" />
            </div>
            <div className="flex flex-col text-[#09090B]">
              <div className="">
                <span className="text-sm font-semibold" data-cy="notify-followReq-username">
                  {userName}
                </span>
                <span className="ml-2 text-sm">started following you</span>
              </div>
              <span className="text-[#71717A] text-xs" data-cy="notify-followReq-dateDistance">
                {dateDistance}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#2563EB] rounded-lg text-[#FAFAFA]" data-cy="follow-btn-followReq">
              Follow
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
export default NotifyFollowRequestCard;
