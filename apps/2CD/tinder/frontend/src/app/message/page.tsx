// app/matches/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_MATCHES } from './_utils/get-my-matches';


type User = {
  _id: string;
  name: string;
  avatarUrl?: string;
};

type Match = {
  _id: string;
  createdAt: string;
  users: User[];
};

type GetMyMatchesData = {
  getMyMatches: Match[];
};

const  MatchesPage = () => {
  const { loading, error, data } = useQuery<GetMyMatchesData>(GET_MY_MATCHES);

  
  if (loading) {
    return <p>Loading your matches…</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Error: {error.message}</p>;
  }
  const matches = data!.getMyMatches;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Matches</h1>
      {matches.length === 0 ? (
        <p>You have no matches yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {matches.map((match) => (
            <li
              key={match._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div>
                <strong>Match ID:</strong> {match._id}
              </div>
              <div>
                <strong>Created At:</strong>{' '}
                {new Date(match.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Users in this match:</strong>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  {match.users.map((u) => (
                    <li
                      key={u._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span>{u.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MatchesPage;
