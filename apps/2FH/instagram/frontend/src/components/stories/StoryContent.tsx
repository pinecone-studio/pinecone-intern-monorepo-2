import Image from 'next/image';
import { demoImage } from '@/components/userProfile/mock-images';
import { GetStoryByUserIdQuery } from '@/generated';

type StoryFromQuery = GetStoryByUserIdQuery['getStoryByUserId'][0];

interface StoryContentProps {
  story: StoryFromQuery;
}

export const StoryContent = ({ story }: StoryContentProps) => {
  return (
    <>
      <Image src={story.image} alt="story" width={500} height={800} className="w-full h-full object-cover rounded-lg" data-testid="story-image" />

      <div className="absolute top-12 left-4 flex items-center z-10">
        <div className="p-[2px] rounded-full bg-gradient-to-r from-red-500 to-orange-500">
          <Image src={story.author?.profileImage || demoImage} alt={story.author?.userName || 'user'} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
        </div>
        <span className="text-white ml-2 font-semibold text-sm">{story.author?.userName}</span>
      </div>
    </>
  );
};
