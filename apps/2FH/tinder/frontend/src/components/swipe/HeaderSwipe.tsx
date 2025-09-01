import React from 'react';  
import Image from 'next/image';

export const HeaderSwipe: React.FC = () => {
    return (
      <div className="flex items-center justify-between mb-8 w-full">
        <div className="flex items-center gap-3 ml-10">
            <Image src="/tinderlogo.png" alt="tinder" width={130} height={32} />
        </div>
        <div className="flex items-center gap-4">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 5A4.5 4.5 0 004 9.5c0 1.61.69 3.12 2.01 4.16L12 19l5.99-5.34A4.52 4.52 0 0020 9.5 4.5 4.5 0 0015.5 5c-1.61 0-3.08.9-3.5 2.09C11.58 5.9 10.11 5 8.5 5z"/>
          </svg>
          
          <div className="w-6 h-6 rounded-full bg-gray-300 mr-10"></div>
        </div>
      </div>
    );
  };