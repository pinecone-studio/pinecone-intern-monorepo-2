'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
export const PostImg = ({ images }: { images: string[] }) => {
  return (
    <Carousel className="relative w-full h-full">
      <CarouselContent>
        {images?.map((img, i) => {
          return (
            <CarouselItem key={i} className="relative w-full h-[585px]">
              <Image fill={true} src={img} alt="Photo1" className="object-cover w-auto h-auto " sizes="w-auto h-auto" priority />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {images?.length === 1 ? (
        ''
      ) : (
        <div className="flex items-center justify-between w-full ">
          <CarouselPrevious className="left-1 top-1/2 " />
          <CarouselNext className="right-1 top-1/2 " />
        </div>
      )}
    </Carousel>
  );
};
