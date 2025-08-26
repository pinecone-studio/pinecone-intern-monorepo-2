'use client';

import Image from 'next/image';
import { demoImage } from './mock-images';
import { formatNumber } from './format-number';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
      {mockPosts.map((post) => (
        <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden">
          <div className="border-2">
            <Image src={demoImage} width={100} height={100} alt={`Post ${post.id}`} className="w-full h-full object-cover" />
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex items-center gap-4 text-white font-semibold">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{formatNumber(post.likesCount)}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formatNumber(post.commentsCount)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
