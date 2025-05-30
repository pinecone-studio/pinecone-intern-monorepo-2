// components/Chat.tsx or similar

'use client';

import { gql, useQuery } from '@apollo/client';

const GET_MATCH_AND_MESSAGES = gql`
  query GetMatchAndMessages($matchId: ID!) {
    getMatchById(id: $matchId) {
      _id
      users {
        _id
        name
        images
      }
    }
    getMessage(matchId: $matchId) {
      _id
      content
      sender {
        _id
        name
        images
      }
      createdAt
    }
  }
`;

const Chat = ({ matchId }: { matchId: string }) => {
  const { data, loading, error } = useQuery(GET_MATCH_AND_MESSAGES, {
    variables: { matchId },
    skip: !matchId,
  });

  if (loading) return <div>Loading chat...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const match = data?.getMatchById;
  const messages = data?.getMessage;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat with:</h2>
      <ul className="mb-6">
        {match?.users?.map((user: any) => (
          <li key={user._id} className="mb-2">
            <span className="font-medium">{user.name}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-2">Messages</h3>
      <div className="space-y-2">
        {messages?.map((msg: any) => (
          <div key={msg._id} className="p-2 border rounded shadow-sm">
            <div className="text-sm text-gray-600">{msg.sender.name}:</div>
            <div className="text-base">{msg.content}</div>
            <div className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
