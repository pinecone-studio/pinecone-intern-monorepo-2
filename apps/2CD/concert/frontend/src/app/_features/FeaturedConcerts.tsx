/* eslint-disable no-secrets/no-secrets */
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Image from 'next/image';
import { useGetFeaturedConcertQuery } from '../../generated';

export const FeaturedConcerts = () => {
  const { data } = useGetFeaturedConcertQuery();
  console.log(data);

  return (
    <Carousel className="w-full max-w-full  p-0">
      <CarouselContent>
        {data?.getFeaturedConcerts.map((concert, index) => (
          <CarouselItem key={index}>
            <div className="p-1  h-[600px]">
              <Image src={'https://res.cloudinary.com/dszot6j60/image/upload/v1749452826/image_nmkypg.webp'} fill alt={'featured concert image'} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-[50px] rounded-md bg-transparent text-white" />
      <CarouselNext className="absolute right-[50px] rounded-md bg-transparent text-white" />
    </Carousel>
  );
};
