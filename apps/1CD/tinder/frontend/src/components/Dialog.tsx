import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
type Props = {
  open:boolean,
  closeDialog: () => void
}

export const Unmatch = ({ open, closeDialog }: Props ) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unmatch this person?</DialogTitle>
          <DialogDescription>if you unmatch, you won’t be able to chat with this person again. This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' className='rounded-full' onClick={()=>closeDialog()}>Keep match</Button>
          <Button variant='destructive' className='rounded-full'>Unmatch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
