import Image from 'next/image';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

interface PostDetailContentProps {
  post: {
    image: string[];
    caption: string;
    author: {
      userName: string;
      profileImage: string;
      fullName: string;
    };
    likes: Array<{ _id: string }>;
    comments: Array<{
      _id: string;
      content: string;
      author: string;
      createdAt: string;
    }>;
    createdAt: string;
  };
  user: {
    _id: string;
    profileImage: string;
    userName: string;
  } | null;
  likedPosts: Set<string>;
  formatTimeAgo: (dateString: string) => string;
}

export const PostDetailContent = ({ post, user, likedPosts, formatTimeAgo }: PostDetailContentProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2">
    {/* Image */}
    <div className="aspect-square lg:aspect-auto lg:h-[600px]">
      <Image src={post.image[0] || '/placeholder-image.jpg'} alt={post.caption || `Post by ${post.author.userName}`} width={1000} height={1000} className="w-full h-full object-cover" />
    </div>

    {/* Post Details */}
    <div className="flex flex-col">
      {/* Author Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image src={post.author.profileImage || '/placeholder-avatar.jpg'} alt={post.author.userName} width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-semibold text-sm">{post.author.userName}</span>
            <p className="text-gray-500 text-sm">{post.author.fullName}</p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="flex-1 p-4 overflow-y-auto max-h-[400px]">
        {/* Caption */}
        <div className="mb-4">
          <span className="font-semibold text-sm mr-2">{post.author.userName}</span>
          <span className="text-sm">{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment._id} className="text-sm">
                <span className="font-semibold mr-2">{comment.author === user?._id ? user.userName : 'User'}</span>
                <span>{comment.content}</span>
                <div className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.createdAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Heart
              className={`w-6 h-6 cursor-pointer transition-colors ${
                post.likes.some((like) => like._id === user?._id) || likedPosts.has(post._id) ? 'text-red-500 fill-current' : 'hover:text-gray-600'
              }`}
            />
            <MessageCircle className="w-6 h-6 cursor-pointer hover:text-gray-600" />
            <Send className="w-6 h-6 cursor-pointer hover:text-gray-600" />
          </div>
          <Bookmark className="w-6 h-6 cursor-pointer hover:text-gray-600" />
        </div>
        <p className="font-semibold text-sm mb-2">{post.likes.length.toLocaleString()} likes</p>
        <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image src={user?.profileImage || '/placeholder-avatar.jpg'} alt={user?.userName || 'User'} width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <input type="text" placeholder="Add a comment..." className="flex-1 text-sm outline-none placeholder-gray-400" />
          <button className="text-blue-500 font-semibold text-sm">Post</button>
        </div>
      </div>
    </div>
  </div>
);
