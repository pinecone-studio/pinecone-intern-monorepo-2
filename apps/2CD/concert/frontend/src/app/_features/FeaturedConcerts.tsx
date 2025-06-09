import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Image from 'next/image';
import { format } from 'date-fns';
import { useGetFeaturedConcertQuery } from '../../generated';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

export const FeaturedConcerts = () => {
  const { data } = useGetFeaturedConcertQuery();

  return (
    <Carousel data-testid="featured-concerts" className="w-full max-w-full  p-0">
      <CarouselContent>
        {data?.getFeaturedConcerts.map((concert, index) => (
          <CarouselItem key={index}>
            <div data-testid={`featured-concert${index}`} className="p-1  h-[600px] bg-black flex justify-center items-center">
              <Image src={concert.thumbnailUrl} fill alt={'featured concert image'} />
              <div className="absolute z-10 flex items-center flex-col w-full gap-3">
                <div className="flex gap-2">
                  {concert.artists.map((artist, index) => {
                    return (
                      <Badge className="bg-transparent border border-[#FAFAFA] border-opacity-20 font-light" key={index}>
                        {artist.name}
                      </Badge>
                    );
                  })}
                </div>

                <p className="text-white text-8xl font-bold">{concert.title}</p>
                <div className="flex gap-2 items-center text-white ">
                  <Calendar size={16} />
                  {concert.schedule.map((day, index) => {
                    const date = format(new Date(day.startDate), 'MM/dd');
                    return <p key={index}>{date}</p>;
                  })}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-[50px] rounded-md bg-transparent text-white" />
      <CarouselNext className="absolute right-[50px] rounded-md bg-transparent text-white" />
    </Carousel>
  );
};
