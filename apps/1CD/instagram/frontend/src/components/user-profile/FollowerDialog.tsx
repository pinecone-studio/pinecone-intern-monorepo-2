import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X } from 'lucide-react';
const FollowerDialog = () => {
  return (
    <DialogContent className="p-0 min-w-96 min-h-96">
      <DialogHeader className="mx-4 my-3 flex flex-row h-10 justify-between items-center">
        <DialogTitle>Followers</DialogTitle>
        <DialogTrigger className="flex flex-row justify-center items-center">
          <X />
        </DialogTrigger>
      </DialogHeader>
      <DialogDescription></DialogDescription>
    </DialogContent>
  );
};
export default FollowerDialog;
