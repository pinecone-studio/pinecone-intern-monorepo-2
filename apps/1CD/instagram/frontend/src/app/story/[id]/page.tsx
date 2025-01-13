'use client';
import React, { useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useGetAllUsersWithLatestStoriesQuery } from '@/generated';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Progress } from '@/app/(main)/_components/ProgressStyle';
import SeenStoryCard from '@/app/(main)/_components/story/SeenStoryCard';
import UnseenStoryCard from '@/app/(main)/_components/story/UnseenStoryCard';

const UserStoryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [seenStories, setSeenStories] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const { data: latestStories } = useGetAllUsersWithLatestStoriesQuery();
  const allStories = latestStories?.getAllUsersWithLatestStories || [];
  const currentUserStories = allStories[currentUserIndex]?.stories || [];
  const currentUserData = allStories[currentUserIndex]?.user;
  const date: Date = currentUserStories[currentStoryIndex]?.createdAt;

  useEffect(() => {
    if (!id || !allStories.length) return;
    const userIndex = allStories.findIndex((story) => story.user._id === id);
    setCurrentUserIndex(userIndex !== -1 ? userIndex : 0);
  }, [id, allStories]);

  useEffect(() => {
    if (!currentUserStories.length) return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1.5;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setProgress(0);
        if (currentStoryIndex + 1 < currentUserStories.length) {
          setCurrentStoryIndex(currentStoryIndex + 1);
        } else {
          handleNextUser();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, currentUserIndex, currentUserStories.length]);

  const handleNextStory = () => {
    setProgress(0);
    if (currentStoryIndex + 1 < currentUserStories.length) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      handleNextUser();
    }
  };

  const handlePreviousStory = () => {
    setProgress(0);
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      handlePreviousUser();
    }
  };

  const handleNextUser = () => {
    setSeenStories((prev) => [...prev, currentUserData._id]);
    const unseenUsers = allStories.filter((story) => !seenStories.includes(story.user._id));
    if (unseenUsers.length === 1 && unseenUsers[0].user._id === currentUserData._id) {
      returnToMainPage();
    } else {
      const nextUserIndex = (currentUserIndex + 1) % allStories.length;
      setCurrentUserIndex(nextUserIndex);
      setCurrentStoryIndex(0);
    }
  };

  const handlePreviousUser = () => {
    const previousUserIndex = (currentUserIndex - 1 + allStories.length) % allStories.length;
    setCurrentUserIndex(previousUserIndex);
    setCurrentStoryIndex(allStories[previousUserIndex]?.stories.length - 1 || 0);
  };

  const returnToMainPage = () => {
    router.push('/home');
  };

  const seenUsers = allStories.filter((story) => seenStories.includes(story.user._id));
  const unseenUsers = allStories.filter((story) => !seenStories.includes(story.user._id));

  return (
    <div className="bg-[#18181B] h-screen relative flex items-center">
      <div className="absolute top-0 flex justify-between w-full p-6">
        <img src="https://umamiharstad.no/wp-content/uploads/2018/09/instagram-font-logo-white-png.png" className="w-[103px] h-[29px]" />
      </div>
      <Button className="absolute top-0 right-0 p-6" onClick={returnToMainPage}>
        <X />
      </Button>
      <div className="flex items-center justify-center w-full h-full gap-4 p-10">
        <div className="w-[500px]">
          <div className="flex justify-end gap-10">
            {seenUsers.slice(-2).map((user) => (
              <SeenStoryCard key={user.user._id} user={user} date={date} />
            ))}
          </div>
        </div>
        <div className="mx-20">
          <Carousel className="w-full max-w-[600px] m-auto transition-all duration-500 ease-in-out">
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
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious disabled={false} onClick={handlePreviousStory} />
            <CarouselNext disabled={false} onClick={handleNextStory} />
          </Carousel>
        </div>
        <div className="w-[500px]">
          <div className="flex gap-10">
            {unseenUsers.slice(1, 3).map((user) => (
              <UnseenStoryCard key={user.user._id} user={user} date={date} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserStoryPage;
