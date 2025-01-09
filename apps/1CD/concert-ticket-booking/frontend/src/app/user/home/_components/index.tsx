'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GetSpecialEventQuery } from '@/generated';
import Link from 'next/link';
import dayjs from 'dayjs';

const CarouselMain = ({ event }: { event: GetSpecialEventQuery['getSpecialEvent'] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const handleScroll = (direction: 'next' | 'prev') => {
    const nextIndex = direction === 'next' ? current + 1 : current - 1;
    setCurrent(nextIndex);
    api?.scrollTo(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (current + 1) % event.length;
      setCurrent(nextIndex);
      api?.scrollTo(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [current, api, event.length]);

  return (
    <div className="flex w-full bg-black">
      <Carousel setApi={setApi} opts={{ loop: true }} className="relative w-full" data-cy="events">
        <Button
          onClick={() => handleScroll('prev')}
          className="absolute z-10 hidden transform -translate-y-1/2 bg-transparent left-2 md:left-5 top-1/2 hover:bg-transparent hover:border hover:border-2-slate sm:block"
          size="sm"
          data-cy="prev-button"
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
        </Button>

        <CarouselContent className="relative mx-0">
          {event?.map((prod) => (
            <CarouselItem className="relative w-full" key={prod._id}>
              <Link href={`/user/home/event/${prod._id}`}>
                <div className="flex items-center justify-center w-full aspect-[16/9] md:aspect-[21/9]">
                  <div className="relative w-full h-full">
                    <Image alt={prod.name} src={prod.image} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw" priority />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white bg-black/30 md:gap-8">
                    <div className="flex flex-wrap justify-center gap-2 mb-2">
                      {prod.mainArtists.map((artist, index) => (
                        <span className="rounded-2xl border-white border-[1px] px-2 py-1 text-xs md:text-sm border-opacity-25" key={index}>
                          {artist.name}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-4xl lg:text-[60px] font-bold text-center">{prod.name}</h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      <div className="flex gap-2 text-sm md:text-base">
                        {prod.scheduledDays.map((day, index) => (
                          <span key={index}>{dayjs(day).format('MM.DD')}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <Button
          onClick={() => handleScroll('next')}
          className="absolute z-10 hidden transform -translate-y-1/2 bg-transparent right-2 md:right-5 top-1/2 hover:bg-transparent hover:border hover:border-2-slate sm:block"
          size="sm"
          data-cy="next-button"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
        </Button>
      </Carousel>
    </div>
  );
};

export default CarouselMain;
