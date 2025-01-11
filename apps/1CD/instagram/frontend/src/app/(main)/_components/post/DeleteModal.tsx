'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeletePostMutation, useGetMyPostsQuery } from '@/generated';
import { Dispatch, SetStateAction } from 'react';

export const DeleteModal = ({ setOpenDeleteModal, openDeleteModal, id }: { setOpenDeleteModal: Dispatch<SetStateAction<boolean>>; openDeleteModal: boolean; id: string }) => {
  const [deletePost, { loading }] = useDeletePostMutation();
  const { refetch } = useGetMyPostsQuery();
  const handleDalete = async () => {
    await deletePost({
      variables: {
        _id: id,
      },
    });
    await refetch();
    setOpenDeleteModal(false);
  };

  return (
    <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden" data-testid="open-delete-modal">
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>Are you sure you want to delete this post?</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button data-testid="cancel-btn" className="text-black bg-white hover:text-white hover:bg-slate-400" onClick={() => setOpenDeleteModal(false)}>
            Cancel
          </Button>
          <Button data-testid="delete-post-btn" className="text-red-500 bg-white border hover:text-black hover:bg-white hover:border-red-500" onClick={() => handleDalete()}>
            {loading ? 'Loading ...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
