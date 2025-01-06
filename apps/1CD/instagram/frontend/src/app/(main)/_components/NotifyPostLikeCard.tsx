import { Heart } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNowStrict } from 'date-fns';
const NotifyPostLikeCard = ({ userName, profileImg, createdDate }: { userName: string; profileImg: string; createdDate: Date }) => {
  const dateDistance = formatDistanceToNowStrict(createdDate);
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2">
      <div className="flex items-center gap-3">
        <section className="relative flex rounded-full w-[44px] h-[44px]">
          <Image fill={true} src={profileImg} alt="profile-image" className="absolute object-cover h-full rounded-full" data-testid="notify-postlike-proImg" />
        </section>
        <div className="flex flex-col text-[#09090B] ">
          <div className="">
            <span className="text-sm font-semibold" data-testid="notify-postlike-username">
              {userName}
            </span>
            <span className="ml-2 text-sm">liked your post</span>
          </div>
          <span className="text-[#71717A] text-xs" data-testid="notify-postlike-dateDistance">
            {dateDistance}
          </span>
        </div>
      </div>
      <Heart fill="red" className="text-red-500" />
    </div>
  );
};
export default NotifyPostLikeCard;
