import { Button } from '@/components/ui/button';
import { AccountVisibility } from '@/generated';
import { formatDistanceToNowStrict } from 'date-fns';
import Image from 'next/image';

type FollowReqNotifyType = { accountVisible: AccountVisibility; profileImg: string; userName: string; createdDate: Date };
const NotifyFollowRequestCard = ({ accountVisible, profileImg, userName, createdDate }: FollowReqNotifyType) => {
  const dateDistance = formatDistanceToNowStrict(createdDate);

  return (
    <>
      {accountVisible === 'PRIVATE' && (
        <div className="flex items-center justify-between gap-4 px-3 py-2 bg-sky-50" data-cy="notify-followReqPri-card">
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
            <Button className="bg-[#2563EB] rounded-lg text-[#FAFAFA]" data-cy="confirm-btn-followReq">
              Confirm
            </Button>
            <Button className="bg-[#F4F4F5] rounded-lg text-[#18181B]" data-cy="delete-btn-followReq">
              Delete
            </Button>
          </div>
        </div>
      )}
      {accountVisible === 'PUBLIC' && (
        <div className="flex items-center justify-between gap-4 px-3 py-2 bg-sky-50" data-cy="notify-followReqPub-card">
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
