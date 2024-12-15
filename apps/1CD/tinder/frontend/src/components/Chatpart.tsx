'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CREATE_CHAT, GET_CHAT } from '@/graphql/chatgraphql';
import { useMutation, useQuery } from '@apollo/client';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

export const Chatpart = () => {
  const [message, setMessage] = useState<string>('');
  const [createChat] = useMutation(CREATE_CHAT);
  const _id = "675d387555bddb91b144bcb7"; 
  
  const { loading, error, data, refetch } = useQuery(GET_CHAT, {
    variables: {
      input: {
        _id: _id
      }
    },
    // pollInterval:50
  });

  const response = data?.getChat;  
  const userId = '6747be56eef691c549c23461'
  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    try {
      await createChat({
        variables: {
          input: {
            content: message,
            participants: ['6747b8ca2620b89f89ae1b54', '6747be56eef691c549c23461'],
            senderId: '6747be56eef691c549c23461',
            chatId: '675d387555bddb91b144bcb7'
          },
        },
      });
      setMessage('');
      refetch();  
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="border-t border-b border-r flex-1" data-cy="Chat-Part-Page">
      <div className='flex flex-col h-full'>
        <div className="flex justify-between border-b items-center py-[22px] px-6">
          <div className="flex justify-center items-center gap-3">
            <div className="rounded-full w-12 h-12 overflow-hidden">
              <Image
                src="/profile.jpeg"
                alt="Profile pic"
                width={48}
                height={48}
                className="object-cover w-full h-full aspect-square"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-black">Leslie Alexander, 24</p>
              <p className="text-sm text-muted-foreground">Software Engineer</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">View Profile</Button>
            <Button variant="outline">Unmatch</Button>
          </div>
        </div>
        {loading ? (
          <div className="text-center flex-1 flex flex-col justify-center items-center">
            <p className="text-sm text-foreground">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center flex-1 flex flex-col justify-center items-center text-red-500">
            <p className="text-sm">Error loading chat data!</p>
          </div>
        ) : !response || response.length === 0 ? (
          <div className="text-center flex-1 flex flex-col justify-center items-center">
            <p className="text-sm text-foreground">Say Hi!</p>
            <p className="text-sm text-muted-foreground">You’ve got a match! Send a message to start chatting.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col">
            {response.map((resp: { content: string, senderId:string }, index: number) => {
              return (
                <div key={index} className={`${userId==resp.senderId?"bg-[#E11D48] self-end max-w-[320px] text-white":"bg-[#F4F4F5] max-w-[220px] text-foreground"}  p-4 rounded-lg  mb-4`}>
                  {resp.content}
                </div>
              );
            })}
          </div>
        )}
        <div className="py-5 px-6 flex gap-4">
          <Input
            placeholder="Say something nice"
            value={message}
            onChange={handleMessageChange}
            data-cy="Chat-Part-Message-Input"
          />
          <Button variant="destructive" className="rounded-full" onClick={sendMessage} data-cy="Chat-Part-Send-Button">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
