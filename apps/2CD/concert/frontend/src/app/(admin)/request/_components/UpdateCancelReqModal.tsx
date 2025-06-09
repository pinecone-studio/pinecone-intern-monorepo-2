import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const UpdateCancelReqModal = ({ onclick, name }: { onclick: () => void; name: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="update-req-modal">
          дуусгах
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" data-testid="">
        <DialogHeader>
          <DialogTitle>Төлөв өөрчлөх</DialogTitle>
          <DialogDescription>{`"${name}" харилцагчийн төлбөрийн буцаалтын шилжүүлсэн үү?`}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button data-testid="updateReqStatusBtn" onClick={onclick}>
              шилжүүлсэн
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
