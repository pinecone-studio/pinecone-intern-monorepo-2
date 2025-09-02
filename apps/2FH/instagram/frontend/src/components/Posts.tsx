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
    <div className="space-y-4 w-full max-w-[800px] justify-center">
      {posts.map((post) => (
        <div key={post.id} className="bg-white border-b border-gray-200 w-full">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">🍓</div>
              <div>
                <span className="font-semibold text-xs">{post.username}</span>
                <span className="text-gray-500 text-xs ml-1">• {post.timeAgo}</span>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 cursor-pointer" />
          </div>

          {/* Post Image */}
          <div className="relative w-full">
            <Image src={post.image} alt="Post" width={1000} height={1000} className="w-full aspect-square object-cover" />
          </div>

          {/* Post Actions and Content */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Heart
                  data-testid={`heart-${post.id}`}
                  className={`w-5 h-5 cursor-pointer transition-colors ${likedPosts.has(post.id) ? 'text-red-500 fill-current' : 'hover:text-gray-600'}`}
                  onClick={() => toggleLike(post.id)}
                />
                <MessageCircle className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                <Send className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              </div>
              <Bookmark
                data-testid={`bookmark-${post.id}`}
                className={`w-5 h-5 cursor-pointer transition-colors ${savedPosts.has(post.id) ? 'fill-current' : 'hover:text-gray-600'}`}
                onClick={() => toggleSave(post.id)}
              />
            </div>

            <p className="font-semibold text-xs mb-2">{post.likes.toLocaleString()} likes</p>
            <p className="text-xs">
              <span className="font-semibold">{post.username}</span> {post.caption}
            </p>
            <p className="text-gray-500 text-xs mt-2 cursor-pointer">View all {post.comments.toLocaleString()} comments</p>

            <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
              <input type="text" placeholder="Add a comment..." className="flex-1 text-xs outline-none placeholder-gray-400" />
              <button className="text-blue-500 font-semibold text-xs ml-2">Post</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
