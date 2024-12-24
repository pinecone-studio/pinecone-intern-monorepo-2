import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Maybe } from '@/generated';
import Image from 'next/image';

interface RoomCarouselProps {
  roomImages: Maybe<string>[];
}

const RoomCarousel = ({ roomImages }: RoomCarouselProps) => {
  const images = roomImages || [];

  return (
    <Carousel>
      <CarouselContent data-cy="HotelRoomCarousel" className="max-w-xl">
        {images.map(
          (image, index) =>
            image && (
              <CarouselItem key={image + index}>
                <Image src={image} alt="hotel room image" width={580} height={433} className="w-full object-cover h-full" />
              </CarouselItem>
            )
        )}
      </CarouselContent>
      <CarouselPrevious className="left-0" variant="secondary" />
      <CarouselNext className="right-0" variant="secondary" />
    </Carousel>
  );
};

export default RoomCarousel;
