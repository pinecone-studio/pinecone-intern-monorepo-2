/* eslint-disable complexity, max-lines-per-function, no-unused-vars ,max-params ,max-lines */
/* istanbul ignore file */
'use client';
import Image from 'next/image';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';

const GET_POSTS_BY_FOLLOWING_USERS = gql`
  query GetPostsByFollowingUsers {
    getPostsByFollowingUsers {
      _id
      image
      caption
      createdAt
      updatedAt
      author {
        _id
        userName
        profileImage
      }
      likes {
        _id
        userName
        profileImage
      }
      comments {
        _id
        content
        author
        likes {
          _id
          userName
          profileImage
        }
        createdAt
        updatedAt
      }
    }
  }
`;

interface User {
  _id: string;
  userName: string;
  profileImage: string;
}

interface Comment {
  _id: string;
  content: string;
  author: string;
  likes: User[];
  createdAt: string;
  updatedAt: string;
}

interface Post {
  _id: string;
  image: string[];
  caption: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  likes: User[];
  comments: Comment[];
}

export const Posts = () => {
  const [likedPosts, setLikedPosts] = useState(new Set<string>());
  const [savedPosts, setSavedPosts] = useState(new Set<string>());
  const { isAuthenticated } = useAuth();


  const { data, loading, error } = useQuery(GET_POSTS_BY_FOLLOWING_USERS, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only', // Force network request, ignore cache
    skip: !isAuthenticated, // Skip query if user is not authenticated
    notifyOnNetworkStatusChange: true,
  });


  const toggleLike = (postId: string) => {
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

  const toggleSave = (postId: string) => {
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p className="text-lg font-medium">Please log in to see posts</p>
        <p className="text-sm">Sign in to view posts from users you follow.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-6 h-6 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin" />
      </div>
    );
  }

  if (error) {
    // Check if it's a network error or authentication error
    const isNetworkError = error.networkError;
    const isAuthError = error.graphQLErrors?.some(err => 
      err.message.includes('Unauthorized') || 
      err.message.includes('Authentication') ||
      err.message.includes('token')
    );

    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-lg font-medium">
          {isAuthError ? 'Authentication required' : 'Error loading posts'}
        </p>
        <p className="text-sm">
          {isAuthError 
            ? 'Please log in to view posts from users you follow.' 
            : isNetworkError 
              ? 'Unable to connect to the server. Please check your internet connection.'
              : 'Please try again later.'
          }
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-xs text-gray-400 max-w-md">
            <summary className="cursor-pointer">Debug info</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }

  const posts = data?.getPostsByFollowingUsers || [];

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium">No posts to show</p>
        <p className="text-sm">Follow some users to see their posts here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post: Post) => (
        <div key={post._id} className="bg-white border-b border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image 
                  src={post.author.profileImage || '/placeholder-avatar.jpg'} 
                  alt={post.author.userName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-semibold text-sm">{post.author.userName}</span>
                <span className="text-gray-500 text-sm ml-1">• {formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 cursor-pointer" />
          </div>
          <div className="relative">
            <Image 
              src={post.image[0] || '/placeholder-image.jpg'} 
              alt={post.caption || `Post by ${post.author.userName}`} 
              width={1000} 
              height={1000} 
              className="w-full aspect-square object-cover" 
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <Heart
                  data-testid={`heart-${post._id}`}
                  className={`w-6 h-6 cursor-pointer transition-colors ${likedPosts.has(post._id) ? 'text-red-500 fill-current' : 'hover:text-gray-600'}`}
                  onClick={() => toggleLike(post._id)}
                />
                <MessageCircle className="w-6 h-6 cursor-pointer hover:text-gray-600" />
                <Send className="w-6 h-6 cursor-pointer hover:text-gray-600" />
              </div>
              <Bookmark
                data-testid={`bookmark-${post._id}`}
                className={`w-6 h-6 cursor-pointer transition-colors ${savedPosts.has(post._id) ? 'fill-current' : 'hover:text-gray-600'}`}
                onClick={() => toggleSave(post._id)}
              />
            </div>
            <p className="font-semibold text-sm mb-2">{post.likes.length.toLocaleString()} likes</p>
            <p className="text-sm">
              <span className="font-semibold">{post.author.userName}</span> {post.caption}
            </p>
            <p className="text-gray-500 text-sm mt-2 cursor-pointer">View all {post.comments.length.toLocaleString()} comments</p>

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
