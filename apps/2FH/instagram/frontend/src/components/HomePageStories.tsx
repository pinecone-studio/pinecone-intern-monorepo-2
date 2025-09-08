'use client';
import Link from 'next/link';
import { useGetActiveStoriesQuery } from '@/generated';
import { useMemo } from 'react';
import { demoImage } from './userProfile/mock-images';

export const HomePageStories = () => {
  const { data, loading, error } = useGetActiveStoriesQuery();
  const users = useMemo(() => {
    if (!data?.getActiveStories) return [];

    const userMap = new Map();

    data.getActiveStories
      .filter((story) => story.author)
      .forEach((story) => {
        const userId = story.author!._id as string;

        if (!userMap.has(userId)) {
          userMap.set(userId, {
            id: userId,
            username: story.author!.userName as string,
            avatar: story.author!.profileImage as string,
          });
        }
      });

    return Array.from(userMap.values());
  }, [data?.getActiveStories]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!users.length) return <div>No stories available</div>;
  return (
    <div className="border-b border-gray-200 bg-white top-0 z-10">
      <div className="flex space-x-4 p-4 overflow-x-auto scrollbar-hide">
        {users.map((user) => (
          <Link key={user.id} href={`/stories/${user.id}`} aria-label={user.username} className="flex flex-col items-center group">
            <div
              className={`w-20 h-20 rounded-full p-[2px] flex items-center justify-center 
                bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 
                transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg`}
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img className="rounded-full object-cover" src={user.avatar || demoImage} alt="av" width={80} height={80} />
              </div>
            </div>
            <span className="text-xs text-gray-700 mt-1 max-w-16 truncate group-hover:text-black">{user.username}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
