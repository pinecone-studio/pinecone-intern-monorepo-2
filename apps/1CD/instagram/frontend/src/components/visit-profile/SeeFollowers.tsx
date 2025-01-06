import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { FollowerDialogProps } from '../user-profile/FollowerDialog';

const SeeFollowersDialog: React.FC<FollowerDialogProps> = ({ followerData, followerDataCount }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row space-x-2 hover:cursor-pointer">
          <span className="font-semibold" data-testid="followerNumber" data-cy="followerNum">
            {followerDataCount}
          </span>
          <span>followers</span>
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-2 p-0 min-w-96 min-h-96" data-cy="dialogFollower">
        <DialogHeader className="relative flex flex-row items-center justify-center h-10 px-4 py-6 border-b-2">
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col items-start p-0 m-0 space-y-2" data-testid="followerDialog">
          <div className="flex items-center w-11/12 mx-auto">
            <Search size={18} />
            <Input type="text" placeholder="Search.." className="w-10/12 bg-transparent border-none input md:w-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-base" />
          </div>
          <div className="w-full space-y-2">
            {followerData.map((oneFollower) => (
              <div key={oneFollower._id} className="flex flex-row items-center justify-between w-11/12 mx-auto" data-cy="followerCard">
                <div className="flex items-center space-x-4">
                  <section className="relative rounded-full w-14 h-14">
                    <Image sizes="h-auto w-auto" src={oneFollower.profileImg!} alt="proZurag" fill className="absolute object-cover rounded-full" data-cy="followerCardImg" />
                  </section>
                  <div className="flex flex-col space-y-0">
                    <h1 className="text-lg font-semibold text-gray-700">{oneFollower.userName}</h1>
                    <h1 className="text-sm font-medium">{oneFollower.fullName}</h1>
                  </div>
                </div>
                <Button className="text-black bg-gray-200 h-9 hover:bg-gray-300">Follow</Button>
              </div>
            ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
export default SeeFollowersDialog;
