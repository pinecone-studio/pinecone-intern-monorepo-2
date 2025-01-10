'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';
import { Unmatch } from './Dialog';
import { useOneUserContext } from './providers/OneuserProvider';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';

export const Oneuser = () => {
  const [open, setOpen] = useState(false);
  const { oneUser, id } = useOneUserContext();
  const handledialog = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="border-t" data-cy="Chat-Oneuser-Part">
        <div className="flex justify-between border-b items-center py-[22px] px-6">
          <div className="flex justify-center items-center gap-3">
            <div className="rounded-full w-12 h-12 overflow-hidden">
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
            <Dialog>
              <DialogTrigger>
                <Button variant="outline">View Profile</Button>
              </DialogTrigger>
              <DialogContent className="w-[440px] h-[660px] p-0">
                <Carousel className="w-[440px] h-[660px]">
                  <DialogDescription></DialogDescription>
                  <DialogTitle></DialogTitle>
                  <CarouselContent className="relative m-0" data-cy="carousel">
                    {oneUser.photos.map((oneUserPhoto: any, index: number) => (
                      <CarouselItem key={index} className="pl-0 w-[440px] h-[660px]">
                        <div className="relative p-0 h-[660px] ">
                          <Image src={oneUserPhoto} width={440} height={660} alt="img" className="w-full h-full object-cover rounded-lg shadow-lg aspect-auto" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-0 bg-[#94999f8e] border-[#505965CC] hover:bg-[#696c6fb7]" />
                  <CarouselNext className="absolute right-0  bg-[#94999f7d] border-[#505965CC] hover:bg-[#696c6fb7]" data-cy="nextButton" />
                </Carousel>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => handledialog()}>
              Unmatch
            </Button>
          </div>
          <Unmatch open={open} closeDialog={closeDialog} user1={id} />
        </div>
      </div>
    </>
  );
};
