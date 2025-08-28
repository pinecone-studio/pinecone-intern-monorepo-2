'use client';

import Image from 'next/image';
import Link from 'next/link';
import { stories } from '../utils/fake-data';

export const HomePageStories = () => {
  return (
    <div className="border-b border-gray-200 bg-white top-0 z-10">
      <div className="flex space-x-4 p-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <Link key={story.id} href={`/stories/${story.id}`} aria-label={story.username} className="flex flex-col items-center group">
            <div
              className={`w-20 h-20 rounded-full p-[2px] flex items-center justify-center 
                bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 
                transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg`}
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <Image className="rounded-full object-cover" src={story.avatar} alt="" aria-hidden width={80} height={80} />
              </div>
            </div>
            <span className="text-xs text-gray-700 mt-1 max-w-16 truncate group-hover:text-black">{story.username}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
