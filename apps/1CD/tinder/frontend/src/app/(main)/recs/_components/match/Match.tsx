import { Dialog, DialogContent } from '@/components/providers/Dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import Image from 'next/image';

const Match = ({ setIsMatchOpen, isMatchOpen, data }: { setIsMatchOpen: (_value: boolean) => void; isMatchOpen: boolean; data: object }) => {
  const closeModal = () => {
    setIsMatchOpen(!false);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50" data-cy="match-page">
      <Dialog open={isMatchOpen} onOpenChange={closeModal} data-cy="match-modal">
        <DialogContent className="w-[375px] z-[1000000] ">
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Its a Match!</h3>
            <div className="relative h-[152px]" data-cy="match-images">
              <Image src="/logo.svg" alt="Your profile" width={152} height={152} className="w-[150px] h-[150px] absolute left-6 border-4  rounded-full shadow-lg border-[#E4E4E7]" />
              <Image src="/logo.svg" alt="Baatarvan" width={152} height={152} className="w-[150px] absolute right-6 h-[150px] border-4 z-[100000000]  rounded-full shadow-lg border-[#E4E4E7]" />
            </div>
            <div className="text-center">
              <p className="text-gray-600">You matched with Baatarvan</p>
            </div>

            <div className="space-y-4" data-cy="modal-footer">
              <Input placeholder="Say something nice" className="w-full" data-cy="message-input" />
              <Button className="flex w-full gap-1 text-white rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600" data-cy="send-button">
                <Send size={16} />
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Match;
