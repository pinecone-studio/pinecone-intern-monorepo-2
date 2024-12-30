'use client';

import { useMatch } from '@/hooks/use-match';
import { Chatsidebar } from '@/components/Chatsidebar';
import { Loader } from '@/components/Loader';
import { Matches } from '@/components/Matches';
import { HeartOff } from 'lucide-react';

const Chat = () => {
  const {haveMatch, noMatch, matchloading} =useMatch()
  console.log(noMatch, haveMatch, matchloading)

  if (matchloading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (haveMatch) {
    return (
      <div className="max-w-[1000px] m-auto h-screen flex flex-col" data-cy='Matches-Found'>
        <Matches />
        <div className="flex flex-1">
          <Chatsidebar />
          <div className="flex-1 border flex flex-col justify-center items-center">
            <p className="text-foreground text-base">Hi, you’ve got a match!</p>
            <p className="text-muted-foreground">Choose a match and start chatting</p>
          </div>
        </div>
      </div>
    );
  }

  if (noMatch) {
    return (
      <div className="text-center mt-10 flex flex-col justify-center items-center h-screen" data-cy='No-Matches-Found'>
        <HeartOff size={40}/>
        <p>No Matches Yet</p>
        <p>Keep swiping, your next match could be just around the corner!</p>
      </div>
    );
  }

  return (
    <div className="text-center mt-10 flex justify-center items-center h-screen" data-cy='Error occured'>
      <p>Error occurred, try again</p>
    </div>
  );
};

export default Chat;
