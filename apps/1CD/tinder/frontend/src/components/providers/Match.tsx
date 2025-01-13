/* eslint-disable complexity */ 
import { Dialog, DialogContent } from '@/components/providers/Dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetMatchedUserQuery } from '@/generated';
import { CREATE_CHAT } from '@/graphql/chatgraphql';
import { useMutation } from '@apollo/client';

import { Send } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import { Loading } from '@/components/Loading';

const Match = ({ setIsMatchOpen, isMatchOpen, swipedUserId }: { setIsMatchOpen: (_value: boolean) => void; isMatchOpen: boolean; swipedUserId: string | null }) => {
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  const { data, loading } = useGetMatchedUserQuery({
    variables: {
      matchedUser: swipedUserId ?? '',
    },
  });
  const [createChat] = useMutation(CREATE_CHAT);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }
    try {
      await createChat({
        variables: {
          input: {
            content: message,
            user2: swipedUserId,
          },
        },
      });
      router.push(`/chat/${swipedUserId}`);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const closeModal = () => {
    setIsMatchOpen(!isMatchOpen);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50" data-cy="match-page">
      <Dialog open={isMatchOpen} onOpenChange={closeModal}>
        <DialogContent className="w-[375px] z-[1000000] rounded-md" data-cy="match-modal">
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Its a Match!</h3>
            <div className="relative h-[152px]" data-cy="match-images">
              {data?.getMatchedUser.swipedUserImg && (
                <Image
                  src={data?.getMatchedUser.swipedUserImg}
                  alt="Your profile"
                  width={152}
                  height={152}
                  data-cy="swipedUserImg"
                  className="w-[150px] h-[150px] absolute left-6 border-4  rounded-full shadow-lg border-[#E4E4E7] object-cover"
                />
              )}
              {data?.getMatchedUser.userImg && (
                <Image
                  src={data?.getMatchedUser.userImg}
                  alt="Baatarvan"
                  width={152}
                  height={152}
                  data-cy="swipingUserImg"
                  className="w-[150px] absolute right-6 h-[150px] border-4 z-[100000000]  rounded-full shadow-lg border-[#E4E4E7] object-cover"
                />
              )}
            </div>
            <div className="text-center">
              <p className="text-gray-600">{`You matched with ${data?.getMatchedUser.swipedName}`}</p>
            </div>

            <div className="space-y-4" data-cy="modal-footer">
              <Input placeholder="Say something nice" className="w-full" data-cy="message-input" value={message} onChange={handleMessageChange} />
              <Button
                className="flex w-full gap-1 text-white rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                type="button"
                onClick={sendMessage}
                data-cy="send-button"
              >
                {loading ? (
                  'Loading'
                ) : (
                  <div className="flex items-center gap-2">
                    <Send size={13} /> Send
                  </div>
                )}
              </Button>
              
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Match;
