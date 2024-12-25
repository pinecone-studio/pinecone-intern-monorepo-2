import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import Image from 'next/image';

interface Follower {
  _id: string;
  // accountVisibility: AccountVisibility;
  // bio: string;
  // createdAt: Date;
  // followerCount: number;
  // followingCount: number;
  fullName: string;
  profileImg: string;
  // updatedAt: Date;
  userName: string;
  // email: string;
}
interface FollowerDialogProps {
  followerData: Follower[];
  followerDataCount: number;
}
const FollowerDialog: React.FC<FollowerDialogProps> = ({ followerData = [], followerDataCount }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row space-x-2 hover:cursor-pointer">
          <h1 className="font-semibold" data-testid="followerNumber">
            {followerDataCount}
          </h1>
          <p>followers</p>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 min-w-96 min-h-96 flex flex-col gap-2">
        <DialogHeader className="relative px-4 py-6 flex flex-row h-10 justify-center items-center border-b-2">
          <DialogTitle>Followers</DialogTitle>
          <DialogTrigger className="absolute right-3 top-1 flex flex-row items-center" data-testid="closeButton">
            <X />
          </DialogTrigger>
        </DialogHeader>
        <DialogDescription className="flex flex-col space-y-2 items-start p-0 m-0" data-testid="followerDialog">
          <div className="w-11/12 flex items-center mx-auto">
            <Search size={18} />
            <Input
              type="text"
              placeholder="Search.."
              className="w-10/12 bg-transparent border-none input md:w-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-base"
              // value={searchTerm}
              // onChange={searchHandleChange}
            />
          </div>
          <div className="w-full space-y-2">
            {followerData.map((oneFollower) => (
              <div key={oneFollower._id} className="w-11/12  mx-auto flex flex-row justify-between items-center">
                <div className="flex items-center space-x-4">
                  <section className="relative rounded-full w-14 h-14">
                    <Image src={oneFollower.profileImg} alt="proZurag" fill className="absolute rounded-full object-cover" />
                  </section>
                  <div className="flex flex-col space-y-0">
                    <h1 className="text-lg text-gray-700 font-semibold">{oneFollower.userName}</h1>
                    <h1 className="text-sm font-medium">{oneFollower.fullName}</h1>
                  </div>
                </div>
                <Button className="h-9 bg-gray-200 hover:bg-gray-300 text-black">Remove</Button>
              </div>
            ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
export default FollowerDialog;
