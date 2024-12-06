import { Button } from '@/components/ui/button';
import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
// import ImageScroll from './ImageScroll';
// import { useAuth } from '../providers/AuthProvider';
const CommentLists = () => {
  // const { user } = useAuth;

  // console.log('user', user);
  return (
    <div className="bg-white p-6 w-[500px] h-[900px]">
      <div className="border-b-2 p-4 flex justify-between items-center">
        <p>user</p>
        <Button variant="link" className="text-black">
          <BsThreeDotsVertical />
        </Button>
      </div>
    </div>
  );
};
export default CommentLists;
