'use client';

import { UserBar } from '@/components/header/UserBar';
import { PostCard } from '@/components/post/PostCard';

const Page = () => {
  return (
    <div className="flex justify-between w-full p-10">
      <div className="flex flex-col items-center ">
        <p>Home page</p>
        <PostCard />
      </div>
      <UserBar />
    </div>
  );
};

export default Page;
