import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FaRegComment } from 'react-icons/fa';
import ImageScroll from './ImageScroll';
import CommentLists from './CommentLists';

const Comment = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <FaRegComment />
        </DialogTrigger>
        <DialogContent className="w-[500px] h-[500px] flex">
          <ImageScroll />
          <CommentLists />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comment;
