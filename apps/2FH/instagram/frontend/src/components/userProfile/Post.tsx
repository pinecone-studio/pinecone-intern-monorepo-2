/*istanbul ignore file*/
'use client';

import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';

const GET_POSTS_BY_AUTHOR = gql`
  query GetPostsByAuthor($author: ID!) {
    getPostsByAuthor(author: $author) {
      _id
      image
      caption
      createdAt
    }
  }
`;

interface PostsProps {
  userId: string;
}

export const Posts = ({ userId }: PostsProps) => {
  const { data, loading } = useQuery(GET_POSTS_BY_AUTHOR, {
    variables: { author: userId },
    skip: !userId,
    errorPolicy: 'all', // This will help us see partial data even if there are errors
    fetchPolicy: 'cache-and-network', // This will help with caching issues
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-6 h-6 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin" />
      </div>
    );
  }

  const posts = data?.getPostsByAuthor || [];

  // Show "No posts" message if we have no posts (regardless of error state)
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium">No posts</p>
        <p className="text-sm">When you share photos and videos, they&apos;ll appear on your profile.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
      {posts.map((post: any) => (
        <div key={post._id} className="aspect-square relative group cursor-pointer overflow-hidden">
          <div className="border-2">
            <Image 
              src={post.image[0] || '/placeholder-image.jpg'} 
              width={100} 
              height={100} 
              alt={post.caption || `Post ${post._id}`} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex items-center gap-4 text-white font-semibold">
              <div className="flex items-center gap-1">
                <Heart className="w-5 h-5" />
                <span>0</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-5 h-5" />
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};