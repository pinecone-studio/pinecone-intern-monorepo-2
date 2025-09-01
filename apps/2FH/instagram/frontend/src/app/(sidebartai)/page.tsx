'use client';

import { RightSidebar, useNavigation } from '@/components';
import { HomePageStories } from '@/components/HomePageStories';

import { Posts } from '@/components/Posts';

const HomePage = () => {
  const { isSearchOpen } = useNavigation();

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 flex justify-center">
      <div className={`w-full max-w-full  md:pb-16 transition-all duration-300 ${!isSearchOpen ? 'lg:mr-80' : ''} mx-auto  flex flex-col items-center`}>
        <HomePageStories />
        <Posts />
      </div>
      {!isSearchOpen && <RightSidebar />}
    </div>
  );
};

export default HomePage;
