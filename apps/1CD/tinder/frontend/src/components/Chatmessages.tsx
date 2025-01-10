'use client';

import { MessageSquareDashed } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useUserId } from './providers/UserContext';
import { Chatcontent } from './Chatcontent';
import { Chatloadingerror } from './Chatloadingerror';
import { Chatdate } from './Chatdate';

type Props = {
  errormessage: any;
  response: any;
};
export const Chatmessages = ({ errormessage, response }: Props) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { userId } = useUserId();
  const currentDate = new Date();
  const [clickedMessages, setClickedMessages] = useState<string[]>([]);

  const mongolianDate = new Intl.DateTimeFormat('mn-MN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Ulaanbaatar',
  }).format(currentDate);

  const addtoClickedmessages = (_id: any) => {
    if (clickedMessages.includes(_id)) {
      const newClickedMessageArray = clickedMessages.filter((clickedMessageId) => clickedMessageId !== _id);
      setClickedMessages(newClickedMessageArray);
      return;
    }
    setClickedMessages((previousclickedmessage) => [...previousclickedmessage, _id]);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return (
    <div className="flex flex-col w-full p-4 flex-1  " data-cy="Chat-Part-Page">
      {errormessage ? (
        <Chatloadingerror errormessage={errormessage} />
      ) : !response || response.length === 0 ? (
        <div className="flex flex-col justify-center items-center flex-1">
          <MessageSquareDashed size={18} />
          <p className="text-sm text-foreground">Say Hi!</p>
          <p className="text-sm text-muted-foreground">You’ve got a match! Send a message to start chatting.</p>
        </div>
      ) : (
        <div className="p-4 flex flex-col flex-1 overflow-y-scroll max-h-[50vh]">
          {response.map((resp: { content: string; senderId: string; createdAt: string; _id: string }, index: number) => {
            const date = new Date(resp.createdAt);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${month}/${day}/${year}`;
            const previousMessage = response[index - 1];
            const previousDayOfWeek = previousMessage
              ? new Intl.DateTimeFormat('mn-MN', {
                  weekday: 'short',
                  timeZone: 'Asia/Ulaanbaatar',
                }).format(new Date(previousMessage.createdAt))
              : null;

            const time = new Intl.DateTimeFormat('mn-MN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              timeZone: 'Asia/Ulaanbaatar',
            }).format(date);
            const dayOfWeek = new Intl.DateTimeFormat('mn-MN', {
              weekday: 'short',
              timeZone: 'Asia/Ulaanbaatar',
            }).format(date);
            return (
              <div key={resp.createdAt} className="flex flex-col gap-12">
                <Chatdate dayOfWeek={dayOfWeek} previousDayOfWeek={previousDayOfWeek} formattedDate={formattedDate} mongolianDate={mongolianDate} />
                <button
                  className={`${userId === resp.senderId ? 'bg-[#E11D48] self-end max-w-fit' : 'bg-[#F4F4F5] max-w-fit'} ${
                    previousMessage && previousMessage.senderId == resp.senderId ? 'rounded-b-2xl rounded-tr-2xl' : 'rounded-2xl'
                  } py-2 px-6 mb-2 flex flex-col place-content-start`}
                  onClick={() => addtoClickedmessages(resp._id)}
                >
                  <Chatcontent userId={userId} resp={resp} clickedMessages={clickedMessages} time={time} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
