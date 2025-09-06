'use client';
import Image from 'next/image';
import { formatNumber } from './format-number';
import { Camera, Heart, MessageCircle } from 'lucide-react';
import { useGetUserByUsernameQuery } from '@/generated';

export const Posts = ({ userName }: { userName: string }) => {
  const { data, loading } = useGetUserByUsernameQuery({
    variables: { userName },
  });
  const userData = data?.getUserByUsername;  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-square relative bg-gray-200 animate-pulse">
            <div className="w-full h-full bg-gray-300"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!userData?.posts || userData.posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center flex flex-col items-center justify-center">
          <div className="mb-4">
            <Camera className="size-20 border rounded-full border-[#000000] p-3" />
          </div>
          <h3 className="text-4xl font-semibold text-gray-900 mb-2">No posts yet</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
      {userData.posts.map((post) => (
        <div key={post._id} className="aspect-square relative group cursor-pointer overflow-hidden">
          <div className="border-2">
            <Image
              src={Array.isArray(post.image) ? post.image[0] : post.image}
              width={400}
              height={400}
              alt={post.caption || `Post by ${userData.userName}`}
              className="w-full h-full object-cover"
              placeholder="empty"
            />
          </div>
          
          {/* Hover overlay with stats */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex items-center gap-4 text-white font-semibold">
              <div className="flex items-center gap-1">
                <Heart className="w-5 h-5 fill-white" />
                <span>{formatNumber(post.likes.length)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-5 h-5" />
                <span>{formatNumber(post.comments.length)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};