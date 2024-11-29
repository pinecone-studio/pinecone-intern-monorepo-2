'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeletePostMutation } from '@/generated';
import { Dispatch, SetStateAction } from 'react';

export const DeleteModal = ({ setOpenDeleteModal, openDeleteModal, id }: { setOpenDeleteModal: Dispatch<SetStateAction<boolean>>; openDeleteModal: boolean; id: string }) => {
  const [deletePost, { loading }] = useDeletePostMutation();

  const handleDalete = async () => {
    await deletePost({
      variables: {
        _id: '6747e938f81062f3c8d5df89',
      },
    });
    setOpenDeleteModal(false);
  };

  //aldaaa zaawal toast uguh
  //refresh hiih
  return (
    <Dialog open={openDeleteModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete post?{id}</DialogTitle>
          <DialogDescription>Are you sure you want to delete this post?</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button className="text-black bg-white hover:text-white hover:bg-slate-400" onClick={() => setOpenDeleteModal(false)}>
            Cancel
          </Button>
          <Button className="text-red-500 bg-white border hover:text-black hover:bg-white hover:border-red-500" onClick={() => handleDalete()}>
            {loading ? 'Loading ...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
