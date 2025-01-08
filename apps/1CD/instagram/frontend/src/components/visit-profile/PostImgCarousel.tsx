'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
export const PostImg = ({ images }: { images: string[] }) => {
  return (
    <Carousel className="relative w-[800px] h-full">
      <CarouselContent>
        {images?.map((img, i) => {
          return (
            <CarouselItem key={i} className="relative w-[800px] h-[800px]">
              <Image fill={true} src={img} alt="Photo1" className="object-cover w-auto h-auto " sizes="w-auto h-auto" priority />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {images?.length === 1 ? (
        ''
      ) : (
        <div className="flex items-center justify-between">
          <CarouselPrevious className="left-1 " />
          <CarouselNext className="right-1 " />
        </div>
      )}
    </Carousel>
  );
};
