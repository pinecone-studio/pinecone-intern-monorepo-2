'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';
import { Unmatch } from './Dialog';
import { useOneUserContext } from './providers/OneuserProvider';

export const Oneuser = () => {
  const [open, setOpen] = useState(false);
  const {oneUser, id} = useOneUserContext()
  const handledialog = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  console.log({oneUser});

  return (
    <>
      <div className="border-t" data-cy="Chat-Oneuser-Part">
          <div className="flex justify-between border-b items-center py-[22px] px-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 overflow-hidden rounded-full">
                <Image src={oneUser.photos[0]} alt="Profile pic" width={48} height={48} className="object-cover w-full h-full aspect-square" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-black">
                  {oneUser?.name}, {oneUser?.age}
                </p>
                <p className="text-sm text-muted-foreground">{oneUser?.profession}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">View Profile</Button>
              <Button variant="outline" onClick={() => handledialog()}>
                Unmatch
              </Button>
            </div>
            <Unmatch open={open} closeDialog={closeDialog} user1={id} user2={'6747be56eef691c549c23461'} />
          </div>
      </div>
    </>
  );
};
