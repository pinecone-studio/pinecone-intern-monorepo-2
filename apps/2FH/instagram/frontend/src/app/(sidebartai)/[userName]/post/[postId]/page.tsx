'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';
import { PostDialog } from '@/components/PostDialog';
import { PostDetailHeader } from './PostDetailHeader';
import { PostDetailContent } from './PostDetailContent';
import { useState } from 'react';

const GET_POST_BY_ID = gql`
  query GetPostById($postId: ID!) {
    getPostById(_id: $postId) {
      _id
      image
      caption
      createdAt
      updatedAt
      author {
        _id
        userName
        profileImage
        fullName
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
        parentId
        parentType
        likes {
          _id
          userName
          profileImage
        }
        comments {
          _id
          content
          author
          parentId
          parentType
          likes {
            _id
            userName
            profileImage
          }
          createdAt
          updatedAt
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
  fullName: string;
}

interface Comment {
  _id: string;
  content: string;
  author: string;
  parentId: string;
  parentType: string;
  likes: User[];
  comments: Comment[];
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

const PostDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [likedPosts] = useState(new Set<string>());

  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { postId: params.postId },
    skip: !params.postId,
  });

  const post: Post | undefined = data?.getPostById;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleDeletePost = async (postId: string) => {
    console.log('Delete post:', postId);
    router.push(`/${post?.author.userName}`);
  };

  const handleEditPost = (postId: string) => {
    console.log('Edit post:', postId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-gray-800 animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium">Post not found</p>
        <p className="text-sm">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <button onClick={handleGoBack} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      <PostDetailHeader post={post} onGoBack={handleGoBack} onOpenDialog={handleOpenDialog} formatTimeAgo={formatTimeAgo} />

      <PostDetailContent post={post} user={user} likedPosts={likedPosts} formatTimeAgo={formatTimeAgo} />

      {/* Post Dialog */}
      {post && (
        <PostDialog
          isOpen={dialogOpen}
          onClose={handleCloseDialog}
          postId={post._id}
          postAuthor={post.author}
          onDelete={user?._id === post.author._id ? handleDeletePost : undefined}
          onEdit={user?._id === post.author._id ? handleEditPost : undefined}
        />
      )}
    </div>
  );
};

export default PostDetailPage;
