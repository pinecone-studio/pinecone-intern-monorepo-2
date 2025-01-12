import { Carousel, CarouselItem, CarouselContent } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

export const StoryLoadingSkeleton = () => {
  return (
    <div className="w-full">
      <Carousel opts={{ align: 'start' }} className="w-full">
        <CarouselContent>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <CarouselItem key={index} className="md:basis-[12%] lg:basis-[12.6%]">
              {/* <div className="flex flex-col items-center gap-1">
                <Skeleton className="rounded-full w-14 h-14" />
                <Skeleton className="w-10 h-2" />
              </div> */}
              <div className="flex flex-col items-center gap-2 mt-6 w-fit">
                <Skeleton className="rounded-full w-[73px] h-[73px]" />

                <Skeleton className="w-10 h-2" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export const PostSkeleton = () => {
  return (
    <div className="w-full md:px-[40px] px-5 space-y-8">
      {[1, 2].map((item) => (
        <div key={item} className="md:border-b-[1px] md:pb-5">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between py-[12px]">
            <div className="flex items-center gap-2">
              <Skeleton className="rounded-full w-9 h-9" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="w-8 h-8" />
          </div>

          {/* Image Skeleton */}
          <Skeleton className="w-full h-[400px] rounded-md" />

          {/* Actions Skeleton */}
          <div className="flex items-center justify-between px-1 py-3">
            <div className="flex gap-3">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="w-6 h-6" />
            </div>
            <Skeleton className="w-6 h-6" />
          </div>

          {/* Content Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="w-full h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};
