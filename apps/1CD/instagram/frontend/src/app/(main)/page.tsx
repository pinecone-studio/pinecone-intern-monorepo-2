'use client';
import React from 'react';
import { Navbar } from '@/components/Navbar';

import { PostCard } from '@/components/post/PostCard';

const Page = () => {
  return (
    <div>
      <Navbar />
      <p> Home Page .. </p>
      <PostCard />
    </div>
  );
};

export default Page;
