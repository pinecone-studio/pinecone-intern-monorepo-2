import { useState } from 'react';
import Image from 'next/image';

export const TinderHeader = () => {
  const [logoError, setLogoError] = useState(false);
  return (
    <div className="bg-white px-4 py-3.5">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between">
          <div className="flex items-center space-x-2">
            {!logoError ? (
              // Image from public folder: apps/2FH/tinder/frontend/public/tindalogos.svg
              <Image
                src="/tindalogos.svg"
                alt="logo"
                width={24}
                height={24}
                className="w-20 h-10 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <svg className="w-10 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Image src="/message-square.svg" alt="notification" width={5} height={5} />
              {/* <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg> */}
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
