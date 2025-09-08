import Image from 'next/image';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';

interface PostDetailHeaderProps {
  post: {
    author: {
      userName: string;
      profileImage: string;
    };
    createdAt: string;
  };
  onGoBack: () => void;
  onOpenDialog: () => void;
  formatTimeAgo: (dateString: string) => string;
}

export const PostDetailHeader = ({ post, onGoBack, onOpenDialog, formatTimeAgo }: PostDetailHeaderProps) => (
  <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 z-10">
    <button onClick={onGoBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
      <ArrowLeft className="w-5 h-5" />
    </button>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <Image src={post.author.profileImage || '/placeholder-avatar.jpg'} alt={post.author.userName} width={32} height={32} className="w-full h-full object-cover" />
      </div>
      <div>
        <span className="font-semibold text-sm">{post.author.userName}</span>
        <span className="text-gray-500 text-sm ml-1">• {formatTimeAgo(post.createdAt)}</span>
      </div>
    </div>
    <div className="ml-auto">
      <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-gray-600" onClick={onOpenDialog} />
    </div>
  </div>
);
