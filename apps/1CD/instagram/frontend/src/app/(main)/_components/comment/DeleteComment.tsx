'use client';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/(main)/_components/comment/DeleteDialog';
import { Button } from '@/components/ui/button';

import { useDeleteCommentMutation } from '@/generated';
import { Dispatch, SetStateAction } from 'react';

export const DeleteCommentModal = ({
  setOpenDeleteCommentModal,
  openDeleteCommentModal,
  id,
  refetch,
}: {
  setOpenDeleteCommentModal: Dispatch<SetStateAction<boolean>>;
  openDeleteCommentModal: boolean;
  id: string;
  refetch: () => void;
}) => {
  const [deleteComment, { loading }] = useDeleteCommentMutation();

  const handleDalete = async () => {
    await deleteComment({
      variables: {
        id: id,
      },
    });
    await refetch();
    setOpenDeleteCommentModal(false);
  };

  return (
    <Dialog open={openDeleteCommentModal} onOpenChange={setOpenDeleteCommentModal}>
      <DialogContent className="sm:max-w-[325px] [&>button]:hidden justify-center " data-testid="open-delete-modal">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <div className="flex flex-col gap-2 w-28">
          <Button data-testid="delete-post-btn" className="text-red-500 bg-white border hover:text-black hover:bg-white hover:border-red-500" onClick={() => handleDalete()}>
            {loading ? 'Loading ...' : 'Delete'}
          </Button>
          <Button data-testid="cancel-btn" className="text-black bg-white hover:text-white hover:bg-slate-400" onClick={() => setOpenDeleteCommentModal(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
