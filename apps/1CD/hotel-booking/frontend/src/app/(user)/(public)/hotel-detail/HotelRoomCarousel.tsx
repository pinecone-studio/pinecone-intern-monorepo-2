'use client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Maybe } from '@/generated';
import Image from 'next/image';

interface RoomCarouselProps {
  roomImages: Maybe<string>[];
}

const RoomCarousel = ({ roomImages }: RoomCarouselProps) => {
  return (
    <Carousel>
      <CarouselContent data-cy="HotelRoomCarousel" className="max-w-xl">
        {roomImages.map(
          (image, index) =>
            image && (
              <CarouselItem data-cy={`carousel-item${index}`} key={image + index}>
                <Image src={image} alt="hotel room image" width={580} height={433} className="object-cover w-full h-full" />
              </CarouselItem>
            )
        )}
      </CarouselContent>
      <CarouselPrevious data-cy="previos-image" className="left-0" variant="secondary" />
      <CarouselNext data-cy="next-image" className="right-0" variant="secondary" />
    </Carousel>
  );
};

export default RoomCarousel;
