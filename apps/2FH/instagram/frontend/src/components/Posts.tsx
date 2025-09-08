/* eslint-disable complexity, max-lines-per-function, no-unused-vars ,max-params ,max-lines */
/* istanbul ignore file */
'use client';
import Image from 'next/image';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  useUpdatePostByLikesMutation,
  useCreateCommentOnPostMutation,
  useUpdateCommentByContentMutation,
  useUpdateCommentByLikesMutation,
  useDeleteCommentMutation,
  useCreateReplyOnCommentMutation,
} from '@/generated';
import { Edit3, Trash2 } from 'lucide-react';
import { PostDialog } from './PostDialog';

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

export const Posts = () => {
  const [likedPosts, setLikedPosts] = useState(new Set<string>());
  const [savedPosts, setSavedPosts] = useState(new Set<string>());
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [newReplies, setNewReplies] = useState<Record<string, string>>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [likedComments, setLikedComments] = useState(new Set<string>());
  const [expandedComments, setExpandedComments] = useState(new Set<string>());
  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { user, isAuthenticated } = useAuth();

  // GraphQL mutations
  const [updatePostByLikes] = useUpdatePostByLikesMutation();
  const [createCommentOnPost] = useCreateCommentOnPostMutation();
  const [createReplyOnComment] = useCreateReplyOnCommentMutation();
  const [updateCommentByContent] = useUpdateCommentByContentMutation();
  const [updateCommentByLikes] = useUpdateCommentByLikesMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const { data, loading, error } = useQuery(GET_POSTS_BY_FOLLOWING_USERS, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only', // Force network request, ignore cache
    skip: !isAuthenticated, // Skip query if user is not authenticated
    notifyOnNetworkStatusChange: true,
  });

  const toggleLike = async (postId: string) => {
    if (!user) return;

    const post = data?.getPostsByFollowingUsers?.find((p: Post) => p._id === postId);
    if (!post) return;

    const currentLikes = post.likes.map((like: User) => like._id);
    const isLiked = currentLikes.includes(user._id);

    const newLikes = isLiked ? currentLikes.filter((id: string) => id !== user._id) : [...currentLikes, user._id];

    try {
      await updatePostByLikes({
        variables: {
          _id: postId,
          input: { likes: newLikes },
        },
      });

      // Update local state
      setLikedPosts((prev) => {
        const newLikes = new Set(prev);
        if (isLiked) {
          newLikes.delete(postId);
        } else {
          newLikes.add(postId);
        }
        return newLikes;
      });
    } catch (err) {
      console.error('Error updating post likes:', err);
    }
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

  const handleAddComment = async (postId: string) => {
    if (!user || !newComments[postId]?.trim()) return;

    try {
      await createCommentOnPost({
        variables: {
          postId,
          content: newComments[postId].trim(),
        },
      });

      // Clear the comment input
      setNewComments((prev) => ({
        ...prev,
        [postId]: '',
      }));
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingComment(commentId);
    setEditCommentContent(currentContent);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!user || !editCommentContent.trim()) return;

    try {
      await updateCommentByContent({
        variables: {
          _id: commentId,
          input: { content: editCommentContent.trim() },
          userId: user._id,
        },
      });

      setEditingComment(null);
      setEditCommentContent('');
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      await deleteComment({
        variables: {
          _id: commentId,
          userId: user._id,
        },
      });
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    // Find the comment in the posts data (including nested comments)
    let comment: Comment | undefined;
    for (const post of data?.getPostsByFollowingUsers || []) {
      comment = post.comments.find((c: Comment) => c._id === commentId);
      if (comment) break;

      // Check nested comments (replies)
      for (const parentComment of post.comments) {
        comment = parentComment.comments.find((c: Comment) => c._id === commentId);
        if (comment) break;
      }
      if (comment) break;
    }

    if (!comment) return;

    const currentLikes = comment.likes.map((like: User) => like._id);
    const isLiked = currentLikes.includes(user._id);

    const newLikes = isLiked ? currentLikes.filter((id: string) => id !== user._id) : [...currentLikes, user._id];

    try {
      await updateCommentByLikes({
        variables: {
          _id: commentId,
          input: { likes: newLikes },
        },
      });

      // Update local state
      setLikedComments((prev) => {
        const newLikes = new Set(prev);
        if (isLiked) {
          newLikes.delete(commentId);
        } else {
          newLikes.add(commentId);
        }
        return newLikes;
      });
    } catch (err) {
      console.error('Error updating comment likes:', err);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!user || !newReplies[commentId]?.trim()) return;

    try {
      await createReplyOnComment({
        variables: {
          commentId,
          content: newReplies[commentId].trim(),
        },
      });

      // Clear the reply input
      setNewReplies((prev) => ({
        ...prev,
        [commentId]: '',
      }));

      // Hide reply input
      setShowReplyInput((prev) => ({
        ...prev,
        [commentId]: false,
      }));
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  const toggleReplyInput = (commentId: string) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleExpandedComments = (commentId: string) => {
    setExpandedComments((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(commentId)) {
        newExpanded.delete(commentId);
      } else {
        newExpanded.add(commentId);
      }
      return newExpanded;
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

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment._id} className={`text-sm ${isReply ? 'ml-6 border-l-2 border-gray-100 pl-3' : ''}`}>
      {editingComment === comment._id ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editCommentContent}
            onChange={(e) => setEditCommentContent(e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm"
            autoFocus
            data-testid={`edit-comment-input-${comment._id}`}
          />
          <button onClick={() => handleUpdateComment(comment._id)} className="text-blue-500 text-sm" data-testid={`save-comment-${comment._id}`}>
            Save
          </button>
          <button
            onClick={() => {
              setEditingComment(null);
              setEditCommentContent('');
            }}
            className="text-gray-500 text-sm"
            data-testid={`cancel-edit-${comment._id}`}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <span className="font-semibold">{comment.author === user?._id ? user.userName : 'User'}</span>
            <span className="ml-1">{comment.content}</span>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span>{formatTimeAgo(comment.createdAt)}</span>
              <button
                onClick={() => handleLikeComment(comment._id)}
                className={`flex items-center gap-1 ${comment.likes.some((like) => like._id === user?._id) || likedComments.has(comment._id) ? 'text-red-500' : 'text-gray-500'}`}
                data-testid={`like-comment-${comment._id}`}
              >
                <Heart className={`w-3 h-3 ${comment.likes.some((like) => like._id === user?._id) || likedComments.has(comment._id) ? 'fill-current' : ''}`} />
                {comment.likes.length > 0 && comment.likes.length}
              </button>
              {!isReply && (
                <button onClick={() => toggleReplyInput(comment._id)} className="text-gray-500 hover:text-gray-700" data-testid={`reply-button-${comment._id}`}>
                  Reply
                </button>
              )}
              {comment.author === user?._id && (
                <>
                  <button onClick={() => handleEditComment(comment._id, comment.content)} className="flex items-center gap-1" data-testid={`edit-comment-${comment._id}`}>
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button onClick={() => handleDeleteComment(comment._id)} className="flex items-center gap-1 text-red-500" data-testid={`delete-comment-${comment._id}`}>
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reply Input */}
      {!isReply && showReplyInput[comment._id] && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Write a reply..."
            className="flex-1 px-2 py-1 border rounded text-sm"
            value={newReplies[comment._id] || ''}
            onChange={(e) =>
              setNewReplies((prev) => ({
                ...prev,
                [comment._id]: e.target.value,
              }))
            }
            onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment._id)}
            data-testid={`reply-input-${comment._id}`}
          />
          <button
            onClick={() => handleAddReply(comment._id)}
            className="text-blue-500 text-sm disabled:opacity-50"
            disabled={!newReplies[comment._id]?.trim()}
            data-testid={`add-reply-${comment._id}`}
          >
            Reply
          </button>
          <button onClick={() => toggleReplyInput(comment._id)} className="text-gray-500 text-sm" data-testid={`cancel-reply-${comment._id}`}>
            Cancel
          </button>
        </div>
      )}

      {/* Replies */}
      {!isReply && comment.comments && comment.comments.length > 0 && (
        <div className="mt-2">
          {comment.comments.length > 2 && !expandedComments.has(comment._id) ? (
            <button onClick={() => toggleExpandedComments(comment._id)} className="text-gray-500 text-xs mb-2" data-testid={`view-replies-${comment._id}`}>
              View {comment.comments.length} replies
            </button>
          ) : (
            expandedComments.has(comment._id) && (
              <button onClick={() => toggleExpandedComments(comment._id)} className="text-gray-500 text-xs mb-2" data-testid={`hide-replies-${comment._id}`}>
                Hide replies
              </button>
            )
          )}

          {(expandedComments.has(comment._id) || comment.comments.length <= 2) && <div className="space-y-1">{comment.comments.map((reply) => renderComment(reply, true))}</div>}
        </div>
      )}
    </div>
  );

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
    const isAuthError = error.graphQLErrors?.some((err) => err.message.includes('Unauthorized') || err.message.includes('Authentication') || err.message.includes('token'));

    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium">{isAuthError ? 'Authentication required' : 'Error loading posts'}</p>
        <p className="text-sm">
          {isAuthError ? 'Please log in to view posts from users you follow.' : isNetworkError ? 'Unable to connect to the server. Please check your internet connection.' : 'Please try again later.'}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-xs text-gray-400 max-w-md">
            <summary className="cursor-pointer">Debug info</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto">{JSON.stringify(error, null, 2)}</pre>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium">No posts to show</p>
        <p className="text-sm">Follow some users to see their posts here.</p>
      </div>
    );
  }

  // Dialog handlers
  const handleOpenDialog = (post: Post) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async (postId: string) => {
    // TODO: Implement delete post mutation
    console.log('Delete post:', postId);
    // You can add the delete mutation here
  };

  const handleEditPost = (postId: string) => {
    // TODO: Implement edit post functionality
    console.log('Edit post:', postId);
    // You can navigate to edit page or open edit modal here
  };

  return (
    <div className="space-y-6">
      {posts.map((post: Post) => (
        <div key={post._id} className="bg-white border-b border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image src={post.author.profileImage || '/placeholder-avatar.jpg'} alt={post.author.userName} width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-semibold text-sm">{post.author.userName}</span>
                <span className="text-gray-500 text-sm ml-1">• {formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-gray-600" onClick={() => handleOpenDialog(post)} />
          </div>
          <div className="relative">
            <Image src={post.image[0] || '/placeholder-image.jpg'} alt={post.caption || `Post by ${post.author.userName}`} width={1000} height={1000} className="w-full aspect-square object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <Heart
                  data-testid={`heart-${post._id}`}
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    post.likes.some((like) => like._id === user?._id) || likedPosts.has(post._id) ? 'text-red-500 fill-current' : 'hover:text-gray-600'
                  }`}
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

            {/* Show comments with replies */}
            {post.comments.length > 0 && (
              <div className="mt-2 space-y-1">
                {post.comments.slice(0, 2).map((comment) => renderComment(comment))}
                {post.comments.length > 2 && <p className="text-gray-500 text-sm cursor-pointer">View all {post.comments.length.toLocaleString()} comments</p>}
              </div>
            )}

            <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 text-sm outline-none placeholder-gray-400"
                value={newComments[post._id] || ''}
                onChange={(e) =>
                  setNewComments((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                data-testid={`comment-input-${post._id}`}
              />
              <button
                className="text-blue-500 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleAddComment(post._id)}
                disabled={!newComments[post._id]?.trim()}
                data-testid={`add-comment-${post._id}`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Post Dialog */}
      {selectedPost && (
        <PostDialog
          isOpen={dialogOpen}
          onClose={handleCloseDialog}
          postId={selectedPost._id}
          onDelete={user?._id === selectedPost.author._id ? handleDeletePost : undefined}
          onEdit={user?._id === selectedPost.author._id ? handleEditPost : undefined}
        />
      )}
    </div>
  );
};
