'use client';

import { HotelImage } from '@/components/HotelImage';
import { SignedIn } from '@clerk/nextjs';
import { Heart, Share, Star } from 'lucide-react';


const Page = () => {

  return (
    <div className="w-full flex flex-col items-center p-4">
      <SignedIn>
        <div className="w-full max-w-[1080px] space-y-6">
          {/* Header */}
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star stroke="yellow" className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Hotel Skypark Central</h2>
            </div>
            <div className="flex items-center gap-4">
              <Heart className="cursor-pointer" />
              <Share className="cursor-pointer" />
            </div>
          </header>

          <HotelImage />

          {/* Room Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Economy Double Room, City View</h3>
            <div className="flex gap-10">
              <div>
                <h4 className="font-medium text-gray-300">Accessibility</h4>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Bathroom</h4>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default Page;
