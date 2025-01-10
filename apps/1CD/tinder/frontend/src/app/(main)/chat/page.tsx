'use client';

import { useMatch } from '@/hooks/use-match';
import { Chatsidebar } from '@/components/Chatsidebar';
import { Loader } from '@/components/Loader';
import { Matches } from '@/components/Matches';
import { HeartOff } from 'lucide-react';
import Header from '../recs/_components/heaeder/Header';

const Chat = () => {
  const { haveMatch, noMatch, matchloading } = useMatch();

  if (matchloading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (haveMatch) {
    return (
      <div className="flex flex-col h-screen w-full">
        <Header />
        <div className="max-w-[1000px] m-auto flex-1 flex flex-col pt-6 w-full" data-cy="Matches-Found">
          <Matches />
          <div className="flex-1 flex flex-row">
            <Chatsidebar />
            <div className="border flex flex-col flex-1 justify-center items-center">
              <p className="text-foreground text-base">Hi, you’ve got a match!</p>
              <p className="text-muted-foreground">Choose a match and start chatting</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (noMatch) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="text-center mt-10 flex flex-col justify-center items-center flex-1" data-cy="No-Matches-Found">
          <HeartOff size={40} />
          <p>No Matches Yet</p>
          <p>Keep swiping, your next match could be just around the corner!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="text-center mt-10 flex justify-center items-center h-screen" data-cy="Error occured">
        <p>Error occurred, try again</p>
      </div>
    </div>
  );
};

export default Chat;
