'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Oneuser } from './Oneuser';
import { Loader } from './Loader';
import { Chatmessages } from './Chatmessages';
import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
var jwt = require('jsonwebtoken');

type Props = {
  chatloading: boolean;
  response: any;
  errormessage: any;
  handleMessageChange: any;
  sendMessage: any;
  message: string;
  loading: boolean;
  authToken:string
};

export const Chatpart = ({ chatloading, response, errormessage, handleMessageChange, sendMessage, message, loading, authToken }: Props) => {
  const [userid, setUserid] = useState('')
  const decoded = jwt.decode(authToken)
  const userId = decoded?._id
  useEffect (()=>{
    if (userId){
      setUserid(userId)
      return
    } else{
      setUserid('675675e84bd85fce3de34006')
    }
  },[])
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') 
      sendMessage();
    }

  return (
    <div className="flex flex-col h-full border-t border-b border-r w-full" data-cy="Chat-Part-Page">
      {chatloading ? (
        <Loader />
      ) : (
        <div className="flex flex-col flex-1 h-full">
          <Oneuser />
          <div className="flex flex-col flex-1 h-full">

            <Chatmessages errormessage={errormessage} response={response} user1={userid} />
            
            <div className="py-5 px-6 flex gap-4 border-t">
              <Input placeholder="Say something nice" value={message} onChange={handleMessageChange} data-cy="Chat-Part-Message-Input" onKeyDown={handleKeyDown}  />
              <Button variant="destructive" className="rounded-full" onClick={sendMessage} data-cy="Chat-Part-Send-Button" disabled={loading}>
                {loading ? (
                  'Loading'
                ) : (
                  <div className='flex gap-2 items-center'>
                    <Send size={13}/> Send
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
