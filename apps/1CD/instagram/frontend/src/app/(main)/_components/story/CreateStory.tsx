import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader } from 'lucide-react';
import { DiscardStory } from '../../../../components/story/DiscardStory';
import { useAuth } from '../../../../components/providers';
import { Dispatch, SetStateAction } from 'react';

export const CreateStory = ({
  openStoryModal,
  handleUploadStoryImg,
  storyImg,
  discardStory,
  handleCreateStory,
  setOpenStoryModal,
  StoryUploadLoading,
}: {
  openStoryModal: boolean;
  handleUploadStoryImg: (_event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  storyImg: string;
  discardStory: () => void;
  handleCreateStory: () => void;
  setOpenStoryModal: Dispatch<SetStateAction<boolean>>;
  StoryUploadLoading: boolean;
}) => {
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Dialog open={openStoryModal} onOpenChange={setOpenStoryModal}>
      {storyImg === '' ? (
        <DialogContent className="sm:max-w-[560px] [&>button]:hidden">
          <DialogTitle className="m-auto">Add story</DialogTitle>
          <DropdownMenuSeparator />
          <div className={`sm:h-[620px] flex flex-col justify-center`}>
            {StoryUploadLoading ? (
              <div className="flex justify-center items-center w-full h-[300px]" data-testid="loader">
                <Loader className="w-10 h-10 text-2xl animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <label className="flex flex-col items-center gap-4 cursor-pointer" htmlFor="file-upload-story" data-testid="openInputBtn">
                  <div className="relative w-[96px] h-[77px]">
                    <Image src="/images/Frame.png" alt="ImportPhoto" fill={true} className="w-auto h-auto" />
                  </div>
                  <p className="text-[20px]">Drag photos and videos here</p>
                  <p className="bg-[#2563EB] text-sm px-4 py-[10px] text-white rounded-lg">Select from computer</p>
                </label>
                <input data-testid="input" id="file-upload-story" type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUploadStoryImg} />
              </div>
            )}
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[560px] m-0 p-0">
          <div className="flex items-center pt-4">
            <DiscardStory discardStory={discardStory} />
            <DialogTitle className="mx-auto">
              <span className="-ml-6">Add to story</span>
            </DialogTitle>
          </div>

          <div className="sm:h-[620px] flex flex-col justify-center m-0 p-0">
            <div className="relative w-[558px] h-[620px]">
              {imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="w-10 h-10 text-2xl animate-spin" />
                </div>
              )}
              <Image src={storyImg} alt="ImportPhoto" fill={true} className={`w-auto h-auto duration-300 `} onLoadingComplete={handleImageLoad} />
            </div>
          </div>
          <DialogFooter className="pb-3 pr-6 my-0">
            <Button type="submit" className="bg-[#F4F4F5] text-sm px-6 py-[10px] text-black rounded-lg" onClick={handleCreateStory}>
              <Avatar className="w-5 h-5 mr-3">
                <AvatarImage src={user?.profileImg || '/images/profileImg.webp'} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>Your story</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
