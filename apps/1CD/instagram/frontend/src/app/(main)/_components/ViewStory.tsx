'use client';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { oneUserStoriesType } from '@/types';

const BigStoryCard = ({ progress, oneUserStories }: { progress: number; oneUserStories: oneUserStoriesType }) => {
  console.log('ost', oneUserStories);
  return (
    <>
      <Carousel className="w-full max-w-[530px]">
        <CarouselContent>
          {oneUserStories?.map((story, index) => (
            <CarouselItem key={index}>
              <div
                style={{
                  backgroundImage: `url(${story.userStories?.map((e) => e.story.image)})`,
                }}
                className="h-[800px] w-[521px] bg-no-repeat bg-cover bg-center rounded-md"
              >
                <div className="px-3 pt-3">
                  {' '}
                  <Progress value={progress} className="w-[100%] bg-[#8C8C8C] h-1" />
                </div>

                <div className="flex items-center gap-3 p-3">
                  <Avatar className="w-[44px] h-[44px]">
                    <AvatarImage src={story.userId.profileImg || '/images/profileImg.webp'} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white">{story.userId.userName}</span>
                  <span className="text-[#71717A] text-xs">5h</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default BigStoryCard;
