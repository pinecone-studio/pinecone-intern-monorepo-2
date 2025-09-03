'use client';

import { RightSidebar, useNavigation } from '@/components';
import { HomePageStories } from '@/components/HomePageStories';

import { Posts } from '@/components/Posts';

const HomePage = () => { /* istanbul ignore next */
  const { isSearchOpen } = useNavigation();

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 flex justify-center  ">
      <div className="w-full max-w-[935px] px-4 sm:px-6 pb-16">
        <HomePageStories />
        <Posts />
      </div>
      {!isSearchOpen && <RightSidebar />}
    </div>
  );
};

export default HomePage;
