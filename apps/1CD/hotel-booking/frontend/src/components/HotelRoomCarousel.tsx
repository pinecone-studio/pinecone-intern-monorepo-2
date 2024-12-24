'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Maybe } from '@/generated';
import Image from 'next/image';

const RoomCarousel = ({ roomImages }: { roomImages: Maybe<string>[] }) => {
  return (
    <div data-cy="HotelRoomCarousel">
      <Carousel>
        <CarouselContent className="max-w-xl">
          {roomImages?.map(
            (image, index) => image && <CarouselItem key={image + index}>{<Image src={`${image}`} alt="hotel image" width={580} height={433} className="w-full object-cover h-full" />}</CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="left-0" variant={'secondary'} />
        <CarouselNext className="right-0" variant={'secondary'} />
      </Carousel>
    </div>
  );
};
export default RoomCarousel;
