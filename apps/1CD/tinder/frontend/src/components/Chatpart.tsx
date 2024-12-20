'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Oneuser } from './Oneuser';
import { Loader } from './Loader';

type Props= {
  chatloading :boolean, 
  response:any, 
  errormessage:any, 
  handleMessageChange:any, 
  sendMessage:any, 
  message:string, 

}

export const Chatpart = ({chatloading, response, errormessage, handleMessageChange, sendMessage, message}:Props) => {
  const user1 = '675675e84bd85fce3de34006'
  return (
    <div className="flex flex-col h-full border-t border-b border-r w-full" data-cy="Chat-Part-Page">
  {chatloading ? (
    <Loader />
  ) : (
    <div className="flex flex-col flex-1 h-full">
      <Oneuser />
      <div className="flex flex-col flex-1 h-full">
        <div className="flex-1">
          {errormessage ? (
            <div className="text-center flex flex-col justify-center items-center text-red-500 h-full">
              {errormessage === 'Error occured: Could not find chat' ? (
                <div className="text-center flex flex-col justify-center items-center">
                  <p className="text-sm text-foreground">Say Hi!</p>
                  <p className="text-sm text-muted-foreground">You’ve got a match! Send a message to start chatting.</p>
                </div>
              ) : (
                <p className="text-sm">Error loading chat data!</p>
              )}
            </div>
          ) : !response || response.length === 0 ? (
            <div className="flex flex-col justify-center items-center flex-1">
              <p className="text-sm text-foreground">Say Hi!</p>
              <p className="text-sm text-muted-foreground">You’ve got a match! Send a message to start chatting.</p>
            </div>
          ) : (
            <div className="overflow-y-auto p-4 flex flex-col max-h-[600px]">
              {response.map((resp: { content: string; senderId: string }, index: number) => {
                return (
                  <div key={index} className={`${user1 == resp.senderId ? 'bg-[#E11D48] self-end max-w-[320px] text-white' : 'bg-[#F4F4F5] max-w-[220px] text-foreground'} p-4 rounded-lg mb-4`}>
                    {resp.content}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="py-5 px-6 flex gap-4 border-t">
          <Input placeholder="Say something nice" value={message} onChange={handleMessageChange} data-cy="Chat-Part-Message-Input" />
          <Button variant="destructive" className="rounded-full" onClick={sendMessage} data-cy="Chat-Part-Send-Button">
            Send
          </Button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};
