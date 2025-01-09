'use client';
import { Button } from '@/components/ui/button';
import { useGetFollowersQuery, useRemoveFollowerMutation } from '@/generated';
import React, { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/(main)/_components/comment/DeleteDialog';
import Image from 'next/image';
import { useAuth } from '@/components/providers';

export const RemoveFollow = ({
  id,
  openRemoveDialog,
  setOpenRemoveDialog,
  userName,
  profileImg,
}: {
  id: string;
  userName: string;
  profileImg: string;
  openRemoveDialog: boolean;
  setOpenRemoveDialog: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useAuth();
  const { refetch } = useGetFollowersQuery({
    variables: {
      followingId: user?._id || '',
    },
  });
  const [removeFollower, { loading }] = useRemoveFollowerMutation();
  const handleRemoveFollewer = async () => {
    await removeFollower({
      variables: {
        id: id,
      },
    });
    refetch();
    setOpenRemoveDialog(false);
  };
  return (
    <Dialog open={openRemoveDialog} onOpenChange={setOpenRemoveDialog}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden" data-testid="open-delete-modal">
        <DialogHeader className="flex flex-col justify-center">
          <div className="flex justify-center">
            <div className="relative rounded-full w-[52px] h-[52px]">
              <Image sizes="h-auto w-auto" src={profileImg || '/images/profileImg.webp'} alt="proZurag" fill className="absolute object-cover rounded-full" data-cy="followerCardImg" />
            </div>
          </div>
          <DialogTitle className="flex justify-center">Remove follower?</DialogTitle>
          <DialogDescription className="flex justify-center text-center">Instagram won’t tell ${userName} they were removed from your followers.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={handleRemoveFollewer} className="text-red-500 bg-white border hover:text-black hover:bg-white hover:border-red-500">
            {loading ? 'Removing ...' : 'Remove'}
          </Button>
          <Button data-testid="cancel-btn" className="text-black bg-white hover:text-white hover:bg-slate-400" onClick={() => setOpenRemoveDialog(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
