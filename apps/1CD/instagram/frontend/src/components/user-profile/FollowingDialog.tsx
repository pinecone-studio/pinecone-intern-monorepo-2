import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import Image from 'next/image';

interface Following {
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
interface FollowingDialogProps {
  followingData: Following[];
  followingDataCount: number;
}
const FollowingDialog: React.FC<FollowingDialogProps> = ({ followingData, followingDataCount }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row space-x-2 hover:cursor-pointer">
          <h1 className="font-semibold" data-testid="followingNumber" data-cy="followingNum">
            {followingDataCount}
          </h1>
          <p>followings</p>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 min-w-96 min-h-96 flex flex-col gap-2" data-cy="dialogFollowing">
        <DialogHeader className="relative px-4 py-6 flex flex-row h-10 justify-center items-center border-b-2">
          <DialogTitle>Followings</DialogTitle>
          <DialogTrigger className="absolute right-3 top-1 flex flex-row items-center" data-testid="closeButtonFollowing" data-cy="buttonCloseFollowing">
            <X />
          </DialogTrigger>
        </DialogHeader>
        <DialogDescription className="flex flex-col space-y-2 items-start p-0 m-0" data-testid="followingDialog">
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
            {followingData.map((oneFollowing) => (
              <div key={oneFollowing._id} className="w-11/12  mx-auto flex flex-row justify-between items-center" data-cy="followingCard">
                <div className="flex items-center space-x-4">
                  <section className="relative rounded-full w-14 h-14">
                    <Image src={oneFollowing.profileImg!} alt="proZurag" fill className="absolute rounded-full object-cover" data-cy="followingCardImg" />
                  </section>
                  <div className="flex flex-col space-y-0">
                    <h1 className="text-lg text-gray-700 font-semibold">{oneFollowing.userName}</h1>
                    <h1 className="text-sm font-medium">{oneFollowing.fullName}</h1>
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
export default FollowingDialog;
