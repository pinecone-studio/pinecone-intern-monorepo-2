'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Oneuser } from './Oneuser';
import { Loader } from './Loader';
import { Errormessage } from './Errormessage';

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
  const user1 = '675675e84bd85fce3de34006';

  return (
    <div className="flex flex-col h-full border-t border-b border-r w-full" data-cy="Chat-Part-Page">
      {chatloading ? (
        <Loader />
      ) : (
        <div className="flex flex-col flex-1 h-full">
          <Oneuser />
          <div className="flex flex-col flex-1 h-full">
            <Errormessage errormessage={errormessage} response={response} user1={user1}/>
            <div className="py-5 px-6 flex gap-4 border-t">
              <Input placeholder="Say something nice" value={message} onChange={handleMessageChange} data-cy="Chat-Part-Message-Input" />
              <Button variant="destructive" className="rounded-full" onClick={sendMessage} data-cy="Chat-Part-Send-Button">
                {loading ? 'Loading' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
