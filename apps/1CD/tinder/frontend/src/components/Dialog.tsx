import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import { UPDATE_MATCH } from '@/graphql/chatgraphql';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useMatchedUsersContext } from './providers/MatchProvider';
type Props = {
  open:boolean,
  closeDialog: () => void
  user1:string
}

export const Unmatch = ({ open, closeDialog, user1}: Props ) => {
  const [updateMatch] = useMutation(UPDATE_MATCH)
  const { refetchmatch } = useMatchedUsersContext()
  const router = useRouter();
  const afterunmatch = ()=>{
    router.push('/chat')
    refetchmatch()
  }
  const unmatch =async ()=>{
    try{
      await updateMatch ({
        variables:{
          input:{
            user1
          }
        }
      }).finally(()=> afterunmatch())
    }
    catch(error){
      console.error('Error sending message:', error);
    }
  }
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unmatch this person?</DialogTitle>
          <DialogDescription>if you unmatch, you won’t be able to chat with this person again. This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' className='rounded-full' onClick={()=>closeDialog()}>Keep match</Button>
          <Button variant='destructive' className='rounded-full' onClick={()=>unmatch()}>Unmatch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
