/* eslint-disable @next/next/no-img-element */

import { Card, CardContent } from '@/components/ui/card';

export const HotelImage = () => {
  return (
    <>
      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        {/* Main image */}
        <Card className="lg:col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-md h-[390px]">
          <CardContent className="p-0 h-full">
            <img src="/images/main.jpg" alt="Main hotel exterior" className="w-full h-full object-cover" />
          </CardContent>
        </Card>

        {/* Two medium images */}
        <div className="grid grid-rows-2 gap-4">
          <Card className="overflow-hidden rounded-2xl shadow-md h-[187px]">
            <CardContent className="p-0 h-full">
              <img src="/images/top-right-1.jpg" alt="Hotel view 1" className="w-full h-full object-cover" />
            </CardContent>
          </Card>
          <Card className="overflow-hidden rounded-2xl shadow-md h-[187px]">
            <CardContent className="p-0 h-full">
              <img src="/images/top-right-2.jpg" alt="Hotel view 2" className="w-full h-full object-cover" />
            </CardContent>
          </Card>
        </div>

        {/* 5 bottom images */}
        <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {['img1', 'img2', 'img3'].map((img, idx) => (
            <Card key={idx} className="overflow-hidden rounded-2xl shadow-md h-[127px]">
              <CardContent className="p-0 h-full">
                <img src={`/images/${img}.jpg`} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              </CardContent>
            </Card>
          ))}

          {/* Last image with overlay */}
          <div className="relative rounded-2xl overflow-hidden shadow-md h-[127px]">
            <img src="/images/img5.jpg" alt="More photos" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xl font-semibold">+25 photos</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};