'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GetSpecialEventQuery } from '@/generated';

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
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full h-[450px] relative" data-cy="events">
        <Button
          onClick={() => handleScroll('prev')}
          className="absolute z-10 transform -translate-y-1/2 bg-transparent left-5 top-1/2 hover:bg-transparent hover:border hover:border-2-slate"
          size="sm"
          data-cy="prev-button"
        >
          <ChevronLeft />
        </Button>
        <div>
          <CarouselContent className="h-[450px] relative mx-0">
            {event?.map((prod) => (
              <CarouselItem className="relative w-full h-full " key={prod._id}>
                <div className="relative flex items-center justify-center w-full h-full">
                  <Image alt={prod.name} fill src={prod.image} />
                  <p className="absolute text-[60px] text-white">
                    <strong>{prod.name}</strong>
                  </p>
                  <p className="absolute flex items-center gap-2 text-sm text-white bottom-44">
                    <Calendar />
                    {prod.scheduledDays}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        <Button
          onClick={() => handleScroll('next')}
          className="absolute z-10 transform -translate-y-1/2 bg-transparent right-5 top-1/2 hover:bg-transparent hover:border hover:border-2-slate"
          size="sm"
          data-cy="next-button"
        >
          <ChevronRight />
        </Button>
      </Carousel>
    </div>
  );
};

export default CarouselMain;
