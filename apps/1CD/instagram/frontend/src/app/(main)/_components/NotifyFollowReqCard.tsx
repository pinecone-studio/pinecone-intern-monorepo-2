/* eslint-disable complexity */

import { Button } from '@/components/ui/button';
import { AccountVisibility, FollowStatus, useConfirmFollowReqMutation, useGetFollowStatusByFollowingIdQuery, useRemoveFollowReqFromNotifyByPrivateFollowingIdUserMutation } from '@/generated';
import { formatDistanceToNowStrict } from 'date-fns';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';
import { FollowBtn } from './follow/FollowButton';

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
  const { data: followStatus, refetch: followStatusRefetch } = useGetFollowStatusByFollowingIdQuery({ variables: { followerId: followerId, followingId: followingId } });
  const [confirmFollowReq, { loading: confirmLoading }] = useConfirmFollowReqMutation({
    onCompleted: () => {
      followStatusRefetch();
      toast({ variant: 'default', title: 'Success', description: 'Follow request approved' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: `${error.message}`, description: 'Follow request approve failed' });
    },
  });
  const [removeFollowRequest, { loading: removeFollowRequestLoading }] = useRemoveFollowReqFromNotifyByPrivateFollowingIdUserMutation({
    onCompleted: () => {
      followStatusRefetch();
      toast({ variant: 'default', title: 'Success', description: 'Remove follow request successful.' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: `${error.message}`, description: 'Remove follow request failed.' });
    },
  });
  const confirmFollowReqHandler = async () => {
    await confirmFollowReq({ variables: { followerId: followerId } });
  };
  const removeFollowRequestHandler = async () => {
    await removeFollowRequest({ variables: { followerId: followerId, followingId: followingId } });
  };
  return (
    <>
      {accountVisible === AccountVisibility.Private && (
        <div className={`flex items-center justify-between gap-4 px-3 py-2 ${isViewed ? '' : 'bg-sky-50'}`} data-cy="notify-followReqPri-card" onClick={onClick}>
          <div className="flex items-center gap-3">
            <div className="relative flex rounded-full w-[44px] h-[44px]">
              <Image fill={true} src={profileImg} alt="Photo1" className="absolute object-cover h-full rounded-full" data-cy="notify-followReq-img" />
            </div>
            <div className="flex flex-col text-[#09090B]">
              <div className="">
                <span className="text-sm font-semibold" data-cy="notify-followReq-username">
                  {userName}
                </span>
                <span className="ml-2 text-sm">{accountVisible === AccountVisibility.Private ? 'has requested to follow you' : 'started following you'}</span>
              </div>
              <span className="text-[#71717A] text-xs" data-cy="notify-followReq-dateDistance">
                {dateDistance}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {followStatus?.getFollowStatusByFollowingId?.status === FollowStatus.Approved ? (
              <FollowBtn userId={followerId} />
            ) : (
              <>
                <Button className="bg-[#2563EB] rounded-lg text-[#FAFAFA] min-w-20 h-8" data-cy="confirm-btn-followReq" onClick={confirmFollowReqHandler}>
                  {confirmLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Confirm'}
                </Button>
                <Button className="bg-[#F4F4F5] rounded-lg text-[#18181B] min-w-20 h-8 hover:bg-[#F3F4F5]" data-cy="delete-btn-followReq" onClick={removeFollowRequestHandler}>
                  {removeFollowRequestLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Remove'}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default NotifyFollowRequestCard;
