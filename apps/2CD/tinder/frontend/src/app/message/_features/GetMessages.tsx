'use client';

import { useGetMyMatchesQuery, useGetMessageQuery } from '@/generated';
import { useState } from 'react';
import SendMessage from '../_components/SendMessage';

const MatchList = ({ matches, selectedMatchId, onSelect }: any) => (
  <div className="w-1/3 border-r p-4 overflow-y-auto bg-white">
    <h2 className="text-xl font-bold mb-4">Matches</h2>
    <ul className="space-y-2">
      {matches?.map((match: any) => (
        <li
          key={match._id}
          onClick={() => onSelect(match._id)}
          className={`cursor-pointer p-3 rounded-lg border ${
            selectedMatchId === match._id ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100'
          }`}
        >
          {match.users.map((user: any) => (
            <div key={user._id} className="text-sm font-medium">
              {user.name}
            </div>
          ))}
        </li>
      ))}
    </ul>
  </div>
);

const MessageView = ({ messages, loading }: any) => {
  if (loading) return <p>Loading messages...</p>;
  if (!messages?.length) return <p className="text-gray-500">No messages yet.</p>;

  return (
    <ul className="space-y-2">
      {messages.map((msg: any) => (
        <li key={msg._id} className="p-3 bg-white rounded shadow-sm">
          <div className="text-sm text-gray-600 mb-1">{msg.sender.name}</div>
          <div>{msg.content}</div>
        </li>
      ))}
    </ul>
  );
};

export const Messages = () => {
  const { data: matchData, loading: loadingMatches, error: matchError } = useGetMyMatchesQuery();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const { data: messageData, loading: loadingMessages } = useGetMessageQuery({
    skip: !selectedMatchId,
    variables: { matchId: selectedMatchId || '' },
  });

  if (loadingMatches) return <p>Loading matches...</p>;
  if (matchError) return <p>Error: {matchError.message}</p>;

  return (
    <div className="flex h-screen">
      <MatchList
        matches={matchData?.getMyMatches}
        selectedMatchId={selectedMatchId}
        onSelect={setSelectedMatchId}
      />
      <div className="w-2/3 p-4 overflow-y-auto flex flex-col bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <MessageView messages={messageData?.getMessage} loading={loadingMessages} />
        {selectedMatchId && <SendMessage matchId={selectedMatchId} />}

      </div>
    </div>
  );
};
