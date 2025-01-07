'use client';

import { Input } from '@/components/ui/input';
import { useCreateCommentMutation, useGetCommentsQuery } from '@/generated';
import { Smile } from 'lucide-react';
import React, { useState } from 'react';

export const CreateComment = ({ id }: { id: string }) => {
  const { refetch } = useGetCommentsQuery({
    variables: {
      postId: id,
    },
  });
  const [commentValue, setCommentValue] = useState('');
  const [createComment] = useCreateCommentMutation();
  const handleCreateComment = async () => {
    await createComment({
      variables: {
        input: {
          commentText: commentValue,
          postId: id,
        },
      },
    });
    setCommentValue('');
    refetch();
  };
  return (
    <div className="flex items-center justify-between ">
      <Input
        data-testid="input"
        type="text"
        className="block w-full p-0 overflow-x-scroll text-sm border-none resize focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-wrap "
        role="textbox"
        value={commentValue}
        placeholder="Add a comment..."
        onChange={(e) => setCommentValue(e.target.value)}
      />
      {/* <textarea
        role="textbox"
        placeholder="Add a comment..."
        className="flex w-full !h-[18px] max-h-[80px] p-0  text-sm border-none  focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none	 "
      ></textarea> */}
      <div className="flex gap-1">
        {commentValue.length > 0 ? (
          <p onClick={handleCreateComment} data-testid="createBtn" className="text-sm font-medium text-blue-600 cursor-pointer">
            Post
          </p>
        ) : (
          ''
        )}

        <p>
          <Smile strokeWidth={1} width={18} height={18} />
        </p>
      </div>
    </div>
  );
};
