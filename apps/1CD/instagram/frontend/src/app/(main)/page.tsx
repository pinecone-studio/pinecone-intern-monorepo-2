'use client';
import React from 'react';
import { PostCard } from '@/components/post/PostCard';
import { UserBar } from '@/components/header/UserBar';

const Page = () => {
  return (
    <div className="flex justify-between w-full p-10">
      <div className="flex justify-center ">
        <PostCard />
      </div>

      <UserBar />
    </div>
  );
};

export default Page;
