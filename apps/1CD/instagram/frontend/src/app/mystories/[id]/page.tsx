'use client';
import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useGetMyActiveStoriesQuery } from '@/generated';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Progress } from '@/app/(main)/_components/ProgressStyle';
import DeleteStory from '@/app/(main)/_components/story/DeleteStoryDialog';
import { formatDistanceToNowStrict } from 'date-fns';

const MyStoriesPage = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const { data: myOwnStories, refetch } = useGetMyActiveStoriesQuery();

  const currentUserStories = myOwnStories?.getMyActiveStories?.stories || [];
  const currentUserData = myOwnStories?.getMyActiveStories?.user;

  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);

  const date: Date = currentUserStories[currentStoryIndex]?.createdAt;

  useEffect(() => {
    if (!currentUserStories.length) return;

    let progress = 0;
    const id = setInterval(() => {
      progress += 1.5;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(id);
        setProgress(0);
        if (currentStoryIndex + 1 < currentUserStories.length) {
          setCurrentStoryIndex(currentStoryIndex + 1);
        }
      }
    }, 100);

    setIntervalId(id);

    return () => clearInterval(id);
  }, [currentStoryIndex, currentUserStories.length]);

  const handleNextStory = () => {
    setProgress(0);
    if (currentStoryIndex + 1 < currentUserStories.length) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };

  const handlePreviousStory = () => {
    setProgress(0);
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleDialogOpen = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const handleDelete = async () => {
    if (currentUserStories.length === 1) {
      router.push('/home');
    } else if (currentStoryIndex >= currentUserStories.length - 1) {
      setCurrentStoryIndex((prev) => Math.max(0, prev - 1));
    }
    await refetch();
  };

  return (
    <div className="bg-[#18181B] h-screen relative flex items-center">
      <div className="absolute top-0 flex justify-between w-full p-6">
        <img src="https://umamiharstad.no/wp-content/uploads/2018/09/instagram-font-logo-white-png.png" className="w-[103px] h-[29px]" />
      </div>
      <Button className="absolute top-0 right-0 p-6" onClick={() => router.push('/home')}>
        <X />
      </Button>
      <div className="flex items-center justify-center w-full h-full gap-4 p-10">
        <Carousel className="w-full max-w-[600px] m-auto flex justify-center transition-all duration-500 ease-in-out">
          <CarouselContent>
            {currentUserStories.map((story, index) => (
              <CarouselItem key={index} className={currentStoryIndex === index ? 'block transition-all duration-500 ease-in-out' : 'hidden'}>
                <div
                  style={{
                    backgroundImage: `url(${story.image})`,
                  }}
                  className="h-[800px] w-[521px] bg-no-repeat bg-cover bg-center rounded-md"
                >
                  <div className="px-3 pt-3">
                    <Progress value={progress} className="w-[100%] bg-[#8C8C8C] h-1" />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3 p-3">
                      <Avatar className="w-[44px] h-[44px]">
                        <AvatarImage src={currentUserData?.profileImg || '/images/profileImg.webp'} alt={currentUserData?.userName} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-white">{currentUserData?.userName}</span>
                      <span className="text-[#71717A] text-xs">
                        {formatDistanceToNowStrict(new Date(date), { addSuffix: false })
                          .split(' ')
                          .map((word, index) => (index === 1 ? word[0] : word))
                          .join(' ')}
                      </span>
                    </div>
                    <DeleteStory
                      storyId={story._id}
                      onDialogOpen={handleDialogOpen}
                      onDelete={() => {
                        handleDelete();
                        handleDialogOpen();
                      }}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious disabled={false} onClick={handlePreviousStory} />
          <CarouselNext disabled={false} onClick={handleNextStory} />
        </Carousel>
      </div>
    </div>
  );
};

export default MyStoriesPage;
