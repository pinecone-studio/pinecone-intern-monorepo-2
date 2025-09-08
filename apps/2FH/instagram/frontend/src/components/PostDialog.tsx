'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Icons removed as they're not used in the simplified design

interface PostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postAuthor: {
    _id: string;
    userName: string;
  };
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
}

export const PostDialog = ({ isOpen, onClose, postId: _postId, postAuthor, onDelete, onEdit }: PostDialogProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        await onDelete(_postId);
        onClose();
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(_postId);
    }
    onClose();
  };

  const handleGoToPost = () => {
    router.push(`/${postAuthor.userName}/post/${_postId}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Dialog - Instagram style */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white rounded-xl shadow-xl min-w-[280px] max-w-[320px] overflow-hidden">
          {/* Options */}
          <div className="py-1">
            {/* Go to Post */}
            <button onClick={handleGoToPost} className="w-full px-4 py-4 text-center hover:bg-gray-50 transition-colors">
              <span className="text-gray-900 font-medium text-base">Go to Post</span>
            </button>

            {/* Edit */}
            {onEdit && (
              <button onClick={handleEdit} className="w-full px-4 py-4 text-center hover:bg-gray-50 transition-colors border-t border-gray-200">
                <span className="text-gray-900 font-medium text-base">Edit</span>
              </button>
            )}

            {/* Delete */}
            {onDelete && (
              <button onClick={handleDelete} disabled={isDeleting} className="w-full px-4 py-4 text-center hover:bg-red-50 transition-colors border-t border-gray-200 disabled:opacity-50">
                <span className="text-red-600 font-medium text-base">{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            )}

            {/* Cancel */}
            <button onClick={onClose} className="w-full px-4 py-4 text-center hover:bg-gray-50 transition-colors border-t border-gray-200">
              <span className="text-gray-900 font-medium text-base">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDialog;
