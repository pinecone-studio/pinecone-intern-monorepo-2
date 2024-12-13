'use client';

import { UserBar } from '@/components/header/UserBar';
import Notification from '@/components/notification';
import { PostCard } from '@/components/post/PostCard';

const Page = () => {
  return (
    <>
      <Notification />
      <div className="flex justify-between w-3/5 p-10 m-auto">
        <div className="flex flex-col items-center ">
          <PostCard />
        </div>
        <UserBar />
      </div>
    </>
  );
};

export default Page;
