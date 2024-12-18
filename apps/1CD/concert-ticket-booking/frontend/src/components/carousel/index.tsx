"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Calendar } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetSpecialEventQuery } from "@/generated";

const CarouselMain = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const { data } = useGetSpecialEventQuery();
  const eventCount = data?.getSpecialEvent.length || 0;
  const firstEvent = data?.getSpecialEvent[0];

  useEffect(() => {
    if (!api || eventCount===0) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    setCurrent(api.selectedScrollSnap());
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, eventCount]);

  useEffect(() => {
    if (!api || eventCount===0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => {
      
        const next = (prev + 1) % eventCount;
        api.scrollTo(next);
        return next;
      });
    }, 3000); 

    return () => {
      clearInterval(interval); 
    };
  }, [api, eventCount]);

  const handleScroll = (direction: 'next' | 'prev') => {
    const nextIndex = direction === 'next' ? current + 1 : current - 1;
    if (nextIndex >= 0 && nextIndex < eventCount) {
      setCurrent(nextIndex);
      api?.scrollTo(nextIndex);
    }
  };

  return (
    <div className="flex w-full bg-black" >
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="w-[100%] h-2/5 relative"
      >
        <Button
          onClick={() => handleScroll('prev')}
          disabled={current === 0}
          className="absolute z-10 transform -translate-y-1/2 bg-transparent left-5 top-1/2 hover:bg-transparent hover:border hover:border-2-slate"
          size={"sm"}
        >
              <ChevronLeft />
        </Button>
        {firstEvent && (
          <CarouselContent className="h-[450px] relative mx-0">
            {data?.getSpecialEvent?.map((prod, index) => (
              <CarouselItem className="relative w-full h-full " key={prod._id} data-testid={`event-${index + 1}`}>
                <div className="relative flex items-center justify-center w-full h-full">
                  <Image alt={prod.name} fill src={prod.image} />
                  <p className="absolute p-1 px-2 text-[12px] text-slate border rounded-2xl top-40 text-slate-200 border-2-slate ">
                    {prod.mainArtists?.map((artist) => artist.name)}
                  </p>
                  <p className="absolute text-[60px] text-white">
                    <strong>{prod.name}</strong>
                  </p>
                  <p className="absolute flex items-center gap-2 text-sm text-white bottom-44">
                  <Calendar />
                  2025.07.12
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
        <Button
          onClick={() => handleScroll('next')}
          disabled={current === eventCount - 1}
          className="absolute z-10 transform -translate-y-1/2 bg-transparent right-5 top-1/2 hover:bg-transparent hover:border hover:border-2-slate"
          size={"sm"}
          data-testid="next-button"
        >
          <ChevronRight />
        </Button>
      </Carousel>
    </div>
  );
};

export default CarouselMain;
