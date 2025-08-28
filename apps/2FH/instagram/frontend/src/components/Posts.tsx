'use client';
import { posts } from '@/utils/fake-data';
import Image from 'next/image';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export const Posts = () => {
  const [likedPosts, setLikedPosts] = useState(new Set<number>());
  const [savedPosts, setSavedPosts] = useState(new Set<number>());

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newLikes = new Set(prev);
      if (newLikes.has(postId)) {
        newLikes.delete(postId);
      } else {
        newLikes.add(postId);
      }
      return newLikes;
    });
  };

  const toggleSave = (postId: number) => {
    setSavedPosts((prev) => {
      const newSaves = new Set(prev);
      if (newSaves.has(postId)) {
        newSaves.delete(postId);
      } else {
        newSaves.add(postId);
      }
      return newSaves;
    });
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white border-b border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white font-bold">🍓</div>
              <div>
                <span className="font-semibold text-sm">{post.username}</span>
                <span className="text-gray-500 text-sm ml-1">• {post.timeAgo}</span>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 cursor-pointer" />
          </div>
          <div className="relative">
            <Image src={post.image} alt="Post" width={1000} height={1000} className="w-full aspect-square object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <Heart
                  data-testid={`heart-${post.id}`}
                  className={`w-6 h-6 cursor-pointer transition-colors ${likedPosts.has(post.id) ? 'text-red-500 fill-current' : 'hover:text-gray-600'}`}
                  onClick={() => toggleLike(post.id)}
                />
                <MessageCircle className="w-6 h-6 cursor-pointer hover:text-gray-600" />
                <Send className="w-6 h-6 cursor-pointer hover:text-gray-600" />
              </div>
              <Bookmark
                data-testid={`bookmark-${post.id}`}
                className={`w-6 h-6 cursor-pointer transition-colors ${savedPosts.has(post.id) ? 'fill-current' : 'hover:text-gray-600'}`}
                onClick={() => toggleSave(post.id)}
              />
            </div>
            <p className="font-semibold text-sm mb-2">{post.likes.toLocaleString()} likes</p>
            <p className="text-sm">
              <span className="font-semibold">{post.username}</span> {post.caption}
            </p>
            <p className="text-gray-500 text-sm mt-2 cursor-pointer">View all {post.comments.toLocaleString()} comments</p>

            <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
              <input type="text" placeholder="Add a comment..." className="flex-1 text-sm outline-none placeholder-gray-400" />
              <button className="text-blue-500 font-semibold text-sm">Post</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
