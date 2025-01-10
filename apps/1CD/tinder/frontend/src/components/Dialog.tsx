import { Button } from '@/components/ui/button';

import { UPDATE_MATCH } from '@/graphql/chatgraphql';
import { useMutation } from '@apollo/client';
import { useMatchedUsersContext } from './providers/MatchProvider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './providers/Dialog2';
type Props = {
  open: boolean;
  closeDialog: () => void;
  user1: string;
};

export const Unmatch = ({ open, closeDialog, user1 }: Props) => {
  const afterUnmatch = () => {
    window.location.href = '/chat';
  };

  const [updateMatch] = useMutation(UPDATE_MATCH, {
    onCompleted: async () => {
      await refetchmatch();
      afterUnmatch();
    },
    onError: (error) => {
      console.error('Error during unmatch:', error);
    },
  });

  const { refetchmatch } = useMatchedUsersContext();

  const unmatch = async () => {
    try {
      await updateMatch({
        variables: {
          input: {
            user1,
          },
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unmatch this person?</DialogTitle>
          <DialogDescription>if you unmatch, you won’t be able to chat with this person again. This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={() => closeDialog()}>
            Keep match
          </Button>
          <Button variant="destructive" className="rounded-full" onClick={() => unmatch()}>
            Unmatch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
