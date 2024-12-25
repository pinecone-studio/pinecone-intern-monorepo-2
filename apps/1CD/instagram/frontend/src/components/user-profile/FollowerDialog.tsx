import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AccountVisibility, FollowerInfo } from '@/generated';
import { X } from 'lucide-react';

interface Follower {
  _id: FollowerInfo.[followerId]._id;
  // accountVisibility: AccountVisibility;
  // bio: string;
  // createdAt: Date;
  // followerCount: number;
  // followingCount: number;
  // fullName: string;
  // profileImg: string;
  // updatedAt: Date;
  userName: string;
  // email: string;
}
interface FollowerDialogProps {
  followerData: Follower[];
  followerDataCount: number;
}
const FollowerDialog: React.FC<FollowerDialogProps> = ({ followerData, followerDataCount }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row space-x-2 hover:cursor-pointer">
          <h1 className="font-semibold" data-cy="followerNumber">
            {followerDataCount}
          </h1>
          <p>followers</p>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 min-w-96 min-h-96">
        <DialogHeader className="mx-4 my-3 flex flex-row h-10 justify-between items-center">
          <DialogTitle>Followers</DialogTitle>
          <DialogTrigger className="flex flex-row justify-center items-center">
            <X />
          </DialogTrigger>
        </DialogHeader>
        <DialogDescription>
          {followerData.map((oneFollower) => (
            <h1 key={oneFollower._id}>{oneFollower.userName}</h1>
          ))}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
export default FollowerDialog;
