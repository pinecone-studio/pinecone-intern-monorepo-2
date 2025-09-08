import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const TinderHeader = () => {
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  const handleAvatarClick = () => {
    router.push('/profile-settings');
  };

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
                width={30}
                height={30}
                className="w-24 h-12 object-contain"
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
              <Image 
                src="/message-square.svg" 
                alt="notification" 
                width={20} 
                height={20} 
                className="w-5 h-5"
              />
            </button>
            <button 
              onClick={handleAvatarClick}
              className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <Image 
                src="/AvatarImage.svg" 
                alt="Profile Avatar" 
                width={32} 
                height={32} 
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
