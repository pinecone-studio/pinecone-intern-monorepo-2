import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FaRegComment } from 'react-icons/fa';
import ImageScroll from './ImageScroll';
import CommentLists from './CommentLists';

const PostComment = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <FaRegComment />
        </DialogTrigger>
        <div className="w-4/5 h-3/4">
          <DialogContent className="flex min-w-full h-screen bg-blue-500">
            <ImageScroll />
            <CommentLists />
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default PostComment;
