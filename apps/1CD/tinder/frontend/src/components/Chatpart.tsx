'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Oneuser } from './Oneuser';
import { Loader } from './Loader';
import { Chatmessages } from './Chatmessages';
import { Send } from 'lucide-react';

type Props = {
  chatloading: boolean;
  response: any;
  errormessage: any;
  handleMessageChange: any;
  sendMessage: any;
  message: string;
  loading: boolean;
};

export const Chatpart = ({ chatloading, response, errormessage, handleMessageChange, sendMessage, message, loading }: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col border-t border-b border-r flex-1 h-full" data-cy="Chat-Part-Big-Page">
      {chatloading ? (
        <Loader />
      ) : (
        <div className="flex flex-col h-full">
          <Oneuser />
          <div className="flex flex-col w-full flex-1">
            <Chatmessages errormessage={errormessage} response={response} />
            <div className="py-5 px-6 flex gap-4 border-t">
              <Input placeholder="Say something nice" value={message} onChange={handleMessageChange} data-cy="Chat-Part-Message-Input" onKeyDown={handleKeyDown} />
              <Button variant="destructive" className="rounded-full" onClick={sendMessage} data-cy="Chat-Part-Send-Button" disabled={loading}>
                {loading ? (
                  'Loading'
                ) : (
                  <div className="flex gap-2 items-center">
                    <Send size={13} /> Send
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
