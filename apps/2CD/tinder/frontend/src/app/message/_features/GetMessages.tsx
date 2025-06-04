'use client';

import { useGetMyMatchesQuery, useGetMessageQuery } from '@/generated';
import { useState } from 'react';

export const Messages = () => {
  const { data: matchData, loading: loadingMatches, error: matchError } = useGetMyMatchesQuery();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const { data: messageData, loading: loadingMessages } = useGetMessageQuery({
    skip: !selectedMatchId,
    variables: { matchId: selectedMatchId || '' },
  });
  console.log(selectedMatchId);
  

  if (loadingMatches) return <p>Loading matches...</p>;
  if (matchError) return <p>Error: {matchError.message}</p>;

  return (
    <div className="flex h-screen">
      {/* Left: Match list */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Your Matches</h2>
        <ul className="space-y-2">
          {matchData?.getMyMatches.map((match) => (
            <li
              key={match._id}
              onClick={() => setSelectedMatchId(match._id)}
              className={`cursor-pointer p-2 rounded-md ${
                selectedMatchId === match._id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              {match.users.map((user) => (
                <div key={user._id}>{user.name}</div>
              ))}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Messages */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Chat</h2>

        {loadingMessages ? (
          <p>Loading messages...</p>
        ) : (
          <ul className="space-y-2">
            {messageData?.getMessage.map((msg) => (
              <li key={msg._id} className="border p-2 rounded">
                <span className="text-sm text-gray-600">{msg.sender.name}</span>
                <p>{msg.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
