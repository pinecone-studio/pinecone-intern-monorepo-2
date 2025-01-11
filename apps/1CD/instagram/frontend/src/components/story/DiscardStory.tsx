import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { ArrowLeft } from 'lucide-react';

export const DiscardStory = ({ discardStory }: { discardStory: () => void }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button aria-label="Go back" className="ml-4">
          <ArrowLeft />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[325px] flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle>Discard Story?</DialogTitle>
        </DialogHeader>
        <DialogDescription>If you go back now, you will lose any changes you have made.</DialogDescription>
        <DialogFooter>
          <DialogClose className="inline-flex items-center justify-center px-4 text-sm font-medium transition-colors border rounded-md border-input bg-background hover:bg-accent hover:text-accent-foreground whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            Keep editing
          </DialogClose>
          <Button type="submit" variant="outline" className="text-red-500" onClick={discardStory}>
            Discard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
