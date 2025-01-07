import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../providers';
import { DiscardStory } from './DiscardStory';

export const CreateStory = ({
  openStoryModal,
  handleUploadStoryImg,
  storyImg,
  discardStory,
  handleCreateStory,
}: {
  openStoryModal: boolean;
  handleUploadStoryImg: (_event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  storyImg: string;
  discardStory: () => void;
  handleCreateStory: () => void;
}) => {
  const { user } = useAuth();

  return (
    <Dialog open={openStoryModal}>
      {storyImg === '' ? (
        <DialogContent className="sm:max-w-[638px]">
          <DialogTitle className="m-auto">Add story</DialogTitle>
          <DropdownMenuSeparator />
          <div className={`sm:h-[620px] flex flex-col justify-center`}>
            <div className="grid gap-4 py-4">
              <label className="flex flex-col items-center gap-4 cursor-pointer" htmlFor="file-upload" data-testid="openInputBtn">
                <div className="relative w-[96px] h-[77px]">
                  <Image src="/images/Frame.png" sizes="h-auto w-auto" alt="ImportPhoto" fill={true} className="w-auto h-auto" />
                </div>
                <p className="text-[20px]">Drag photos and videos here</p>
              </label>
              <input data-testid="input" id="file-upload" type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUploadStoryImg} />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#2563EB] m-auto text-sm px-4 py-[10px] text-white rounded-lg" onClick={handleCreateStory}>
                Select from computer
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[638px]">
          <div className="flex items-center -mt-2">
            <DiscardStory discardStory={discardStory} />
            <DialogTitle className="m-auto">Add to story</DialogTitle>
          </div>

          <DropdownMenuSeparator />
          <div className="sm:h-[620px] flex flex-col justify-center">
            <div className="relative w-[580px] h-[580px]">
              <Image src={storyImg} alt="ImportPhoto" fill={true} className="w-auto h-auto" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-[#F4F4F5] text-sm px-6 py-[10px] text-black rounded-lg" onClick={handleCreateStory}>
              <Avatar className="w-5 h-5 mr-3">
                <AvatarImage src={user?.profileImg || 'https://github.com/shadcn.png'} alt="@shadcn" />
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
