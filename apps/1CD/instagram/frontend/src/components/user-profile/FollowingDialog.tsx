import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/(main)/_components/FollowerFollowingDialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
      <DialogContent className="flex flex-col gap-2 p-0 min-w-96 min-h-96" data-cy="dialogFollowing">
        <DialogHeader className="relative flex flex-row items-center justify-center h-10 px-4 py-6 border-b-2">
          <DialogTitle>Followings</DialogTitle>
          {/* <DialogTrigger className="absolute flex flex-row items-center right-3 top-1" data-testid="closeButtonFollowing" data-cy="buttonCloseFollowing">
            <X />
          </DialogTrigger> */}
        </DialogHeader>
        <DialogDescription className="flex flex-col items-start p-0 m-0 space-y-2" data-testid="followingDialog">
          <div className="flex items-center w-11/12 mx-auto">
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
              <div key={oneFollowing._id} className="flex flex-row items-center justify-between w-11/12 mx-auto" data-cy="followingCard">
                <div className="flex items-center space-x-4">
                  <section className="relative rounded-full w-14 h-14">
                    <Image src={oneFollowing.profileImg!} alt="proZurag" fill className="absolute object-cover rounded-full" data-cy="followingCardImg" />
                  </section>
                  <div className="flex flex-col space-y-0">
                    <h1 className="text-lg font-semibold text-gray-700">{oneFollowing.userName}</h1>
                    <h1 className="text-sm font-medium">{oneFollowing.fullName}</h1>
                  </div>
                </div>
                <Button className="text-black bg-gray-200 h-9 hover:bg-gray-300">Remove</Button>
              </div>
            ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
export default FollowingDialog;
