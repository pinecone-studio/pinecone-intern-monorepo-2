import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNowStrict } from 'date-fns';
import React from 'react';
import { SeenStoryCardProps } from './SeenStoryCard';

const UnseenStoryCard: React.FC<SeenStoryCardProps> = ({ user, date }) => {
  const firstStory = user.stories[0];

  return (
    <div
      key={user.user._id}
      style={{
        backgroundImage: `url(${firstStory.image})`,
      }}
      className="h-[375px] w-[245px] flex flex-col items-center justify-center gap-2 bg-no-repeat bg-cover bg-center rounded-md"
    >
      <div className="rounded-full bg-[linear-gradient(to_top_right,#f9ce34_10%,#ee2a7b_60%)] p-[3px]">
        <div className="rounded-full bg-white w-[60px] h-[60px] flex items-center justify-center">
          <Avatar className="w-[56px] h-[56px]">
            <AvatarImage src={user.user.profileImg || '/images/profileImg.webp'} alt={user.user.userName || 'User'} />
            <AvatarFallback>{user.user.userName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="flex flex-col items-center text-white">
        <span className="font-semibold">{user.user.userName}</span>
        <span className="-mt-1">{formatDistanceToNowStrict(new Date(date)).slice(0, 4)}</span>
      </div>
    </div>
  );
};

export default UnseenStoryCard;
