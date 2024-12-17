'use client';

import { Chatsidebar } from '@/components/Chatsidebar';
import { Matches } from '@/components/Matches';
import { MatchProvider, useMatchedUsersContext } from '@/components/providers/MatchProvider';

const Chat = () => {
  const { matchedData } = useMatchedUsersContext();
  return (
      <MatchProvider>
        {matchedData ? (
          <div>
            <p>No Matches Yet</p>
            <p>Keep swiping, your next match could be just around the corner!</p>
          </div>
        ) : (
          <div className="max-w-[1000px] m-auto">
            <Matches />
            <div className="flex">
              <Chatsidebar />
            </div>
          </div>
        )}
      </MatchProvider>
  );
};
export default Chat;
