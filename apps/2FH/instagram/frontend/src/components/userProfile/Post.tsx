'use client';

import Image from 'next/image';
import { demoImage } from './mock-images';
import { formatNumber } from './format-number';
import { Heart, MessageCircle } from 'lucide-react';
const mockPosts = [
  {
    id: 1,

    likesCount: 1250,
    commentsCount: 89,
  },
  {
    id: 2,

    likesCount: 2340,
    commentsCount: 156,
  },
  {
    id: 3,

    likesCount: 890,
    commentsCount: 67,
  },
  {
    id: 4,

    likesCount: 3120,
    commentsCount: 234,
  },
  {
    id: 5,

    likesCount: 1876,
    commentsCount: 98,
  },
  {
    id: 6,

    likesCount: 4560,
    commentsCount: 312,
  },
];

export const Posts = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-1 sm:gap-2">
      {mockPosts.map((post) => (
        <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden">
          <div className="border border-gray-200 sm:border-2">
            <Image src={demoImage} width={100} height={100} alt={`Post ${post.id}`} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-4 text-white font-semibold text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{formatNumber(post.likesCount)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{formatNumber(post.commentsCount)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
