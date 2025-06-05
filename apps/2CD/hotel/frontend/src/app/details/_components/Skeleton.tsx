'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const HotelDetailsSkeleton = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center p-4">
        <div className="w-full max-w-[1080px] space-y-6">
          {/* Header Skeleton */}
          <header className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-64" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4 rounded-full" />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </header>

          {/* Image and Side Info */}
          <div className="flex gap-4">
            {/* Skeleton for HotelImage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              <Card className="lg:col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-md h-[390px]">
                <CardContent className="p-0 h-full">
                  <Skeleton className="w-full h-full" />
                </CardContent>
              </Card>
              <div className="grid grid-rows-2 gap-4">
                <Card className="overflow-hidden rounded-2xl shadow-md h-[187px]">
                  <CardContent className="p-0 h-full">
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
                <Card className="overflow-hidden rounded-2xl shadow-md h-[187px]">
                  <CardContent className="p-0 h-full">
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Skeleton for PriceDetail and Location */}
            <div className="w-[400px] inline-flex flex-col gap-4">
              <Card className="p-5 h-[200px] shadow-md">
                <Skeleton className="h-5 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-full mt-4" />
              </Card>
              <Card className="w-[400px] h-[300px] shadow-md">
                <Skeleton className="w-full h-full" />
              </Card>
            </div>
          </div>

          {/* Description Skeleton */}
          <Card className="p-5 shadow-md space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        </div>
      </div>
    </>
  );
};
