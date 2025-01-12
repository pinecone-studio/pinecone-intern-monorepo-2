import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNowStrict } from 'date-fns';
import React from 'react';

export interface SeenStoryCardProps {
  user: {
    __typename?: 'UserPopulatedStory';
    _id: string;
    stories: {
      __typename?: 'Story';
      _id: string;
      createdAt: Date;
      endDate: string;
      image: string;
    }[];
    user: {
      _id: string;
      userName: string;
      profileImg?: string | null;
    };
  };
  date: Date;
}

const SeenStoryCard: React.FC<SeenStoryCardProps> = ({ user, date }) => {
  const latestStory = user.stories.reduce((latest, story) => {
    return new Date(story.createdAt) > new Date(latest.createdAt) ? story : latest;
  }, user.stories[0]);

  return (
    <div
      key={user.user._id}
      style={{
        backgroundImage: `url(${latestStory.image})`,
      }}
      className="h-[375px] w-[245px] flex flex-col items-center justify-center gap-2 bg-no-repeat bg-cover bg-center rounded-md brightness-50"
    >
      <div className="z-10">
        <Avatar className="ring-1 ring-offset-2 ring-[#E4E4E7] w-[56px] h-[56px]">
          <AvatarImage src={user.user.profileImg || '/images/profileImg.webp'} alt={user.user.userName || 'User'} />
          <AvatarFallback>{user.user.userName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
      </div>
      <div className="z-10 flex flex-col items-center text-white">
        <span className="font-semibold">{user.user.userName}</span>
        <span className="-mt-1">{formatDistanceToNowStrict(new Date(date)).slice(0, 4)}</span>
      </div>
    </div>
  );
};

export default SeenStoryCard;
