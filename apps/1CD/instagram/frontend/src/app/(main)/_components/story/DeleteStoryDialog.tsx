import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from './DeleteDialogStyle';
import { useDeleteStoryMutation } from '@/generated';
import { toast } from '@/components/ui/use-toast';

const DeleteStory = ({ storyId, onDialogOpen, onDelete }: { storyId: string; onDialogOpen: () => void; onDelete: () => void }) => {
  const [deleteStory, { loading }] = useDeleteStoryMutation({
    onCompleted: () => {
      onDelete();
      toast({ variant: 'default', title: 'Success', description: 'Deleted story successfully' });
    },
  });

  const handleDelete = async () => {
    try {
      const response = await deleteStory({ variables: { storyId } });

      if (!response.data?.deleteStory) {
        throw new Error('Failed to delete story');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete story' });
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 text-white" onClick={onDialogOpen}>
          <EllipsisVertical />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[325px] p-0 m-0 [&>button]:hidden bg-[#18181B] rounded-3xl">
        <div className="flex flex-col items-center">
          <div className="flex justify-center w-full border-b border-[#29292a]">
            <Button className="p-6 text-base font-semibold text-red-700" onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
          <div>
            <DialogClose className="p-3 text-white">Cancel</DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStory;
